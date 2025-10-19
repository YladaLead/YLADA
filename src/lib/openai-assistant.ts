import OpenAI from 'openai'
import { yladaCache } from './ylada-cache'
import { yladaLearning } from './ylada-learning'
import { AssistantMonitoring, measureLatency } from './assistant-monitoring'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface UserProfile {
  nome?: string
  profissao?: string
  especializacao?: string
  publico_alvo?: string
  objetivo_principal?: string
  tipo_ferramenta?: string
  idioma?: string
  nivel_tecnico?: 'iniciante' | 'intermediario' | 'avancado'
  ultima_ferramenta_criada?: string
  preferencias_ia?: {
    tom?: 'profissional' | 'leve' | 'divertido'
    use_emojis?: boolean
    estilo?: string
  }
}

export interface AssistantResponse {
  message: string
  profile?: Partial<UserProfile>
  nextStep?: number
  complete?: boolean
  toolSuggestion?: {
    name: string
    type: string
    description: string
  }
}

export class YLADAAssistant {
  private chatAssistantId: string
  private creatorAssistantId: string
  private expertAssistantId: string
  private threadId?: string

  constructor() {
    this.chatAssistantId = process.env.OPENAI_ASSISTANT_CHAT_ID || ''
    this.creatorAssistantId = process.env.OPENAI_ASSISTANT_CREATOR_ID || ''
    this.expertAssistantId = process.env.OPENAI_ASSISTANT_EXPERT_ID || ''
  }

  // Criar thread para nova conversa
  async createThread(): Promise<string> {
    try {
      const thread = await openai.beta.threads.create()
      this.threadId = thread.id
      return thread.id
    } catch (error) {
      console.error('Erro ao criar thread:', error)
      throw new Error('Falha ao iniciar conversa com a YLADA Assistant')
    }
  }

  // Enviar mensagem para a assistant
  async sendMessage(message: string, userProfile?: UserProfile): Promise<AssistantResponse> {
    try {
      // Verificar cache primeiro
      const cachedResponse = await yladaCache.getCachedResponse(message, userProfile || {})
      if (cachedResponse) {
        console.log('🎯 Resposta encontrada no cache! Economizando IA...')
        return cachedResponse.assistant_response
      }

      if (!this.threadId) {
        await this.createThread()
      }

      // Determinar qual assistente usar
      const assistantId = this.determineAssistant(message, userProfile)
      const assistantType = this.getAssistantType(assistantId)
      const assistantUsed = this.getAssistantUsed(assistantId)
      const intent = AssistantMonitoring.detectIntent(message, userProfile)
      
      console.log(`🤖 Usando ${assistantType} para esta mensagem (intent: ${intent})`)

      // Medir latência da operação
      const { result: response, latency } = await measureLatency(async () => {
        // Preparar contexto do usuário
        const contextMessage = this.buildContextMessage(userProfile)
        const fullMessage = contextMessage ? `${contextMessage}\n\n${message}` : message

        // Adicionar mensagem ao thread
        await openai.beta.threads.messages.create(this.threadId!, {
          role: 'user',
          content: fullMessage
        })

        // Executar assistant com fallback
        let run
        try {
          run = await openai.beta.threads.runs.create(this.threadId!, {
            assistant_id: assistantId
          })
        } catch (error) {
          console.warn(`⚠️ Erro com ${assistantType}, tentando fallback...`)
          
          // Fallback: se creator falhar, usar expert
          if (assistantId === this.creatorAssistantId) {
            run = await openai.beta.threads.runs.create(this.threadId!, {
              assistant_id: this.expertAssistantId
            })
            console.log('🔄 Fallback para Expert executado')
          } else {
            throw error
          }
        }

        // Aguardar resposta
        let runStatus = await openai.beta.threads.runs.retrieve(this.threadId!, run.id)
        
        while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
          await new Promise(resolve => setTimeout(resolve, 1000))
          runStatus = await openai.beta.threads.runs.retrieve(this.threadId!, run.id)
        }

        if (runStatus.status === 'completed') {
          // Buscar mensagens do thread
          const messages = await openai.beta.threads.messages.list(this.threadId!)
          const lastMessage = messages.data[0]
          
          if (lastMessage && lastMessage.content[0].type === 'text') {
            const responseText = lastMessage.content[0].text.value
            const parsedResponse = this.parseAssistantResponse(responseText, userProfile)
            
            // Salvar no cache para próximas vezes
            await yladaCache.saveCachedResponse(message, userProfile || {}, parsedResponse)
            
            // Salvar dados de aprendizado
            await yladaLearning.saveLearningData(
              message,
              userProfile || {},
              parsedResponse,
              'neutral'
            )
            
            return parsedResponse
          }
        }

        throw new Error('Falha ao obter resposta da assistant')
      })

      // Salvar métricas de monitoramento
      await AssistantMonitoring.saveMetrics({
        assistant_used: assistantUsed,
        tokens_in: AssistantMonitoring.estimateTokens(message),
        tokens_out: AssistantMonitoring.estimateTokens(response.message),
        latency_ms: latency,
        intent,
        escalated: assistantId !== this.determineAssistant(message, userProfile),
        message_length: message.length,
        timestamp: new Date()
      })

      return response

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      // Fallback para resposta local se OpenAI falhar
      return this.getFallbackResponse(message, userProfile)
    }
  }

  // Determinar qual assistente usar baseado no contexto
  private determineAssistant(message: string, userProfile?: UserProfile): string {
    const messageLength = message.length
    const messageLower = message.toLowerCase()
    
    // Detectar intenção de criação de template
    const isTemplateGeneration = messageLower.includes('criar') || 
                                 messageLower.includes('gerar') || 
                                 messageLower.includes('quiz') || 
                                 messageLower.includes('calculadora') || 
                                 messageLower.includes('checklist') || 
                                 messageLower.includes('planilha') ||
                                 messageLower.includes('diagnóstico') ||
                                 messageLower.includes('simulador') ||
                                 messageLower.includes('catálogo')
    
    // Detectar casos Enterprise/complexos
    const isEnterpriseCase = messageLength > 1200 || 
                            messageLower.includes('enterprise') ||
                            messageLower.includes('empresa') ||
                            messageLower.includes('contrato') ||
                            messageLower.includes('política') ||
                            messageLower.includes('integração') ||
                            messageLower.includes('b2b') ||
                            messageLower.includes('multi-etapas')
    
    // Detectar escalação do chat para creator
    const isEscalationToCreator = userProfile?.objetivo_principal?.toLowerCase().includes('criar') ||
                                  userProfile?.tipo_ferramenta ||
                                  messageLower.includes('ferramenta') ||
                                  messageLower.includes('template')
    
    // Lógica de roteamento
    if (isEnterpriseCase) {
      return this.expertAssistantId
    } else if (isTemplateGeneration || isEscalationToCreator) {
      return this.creatorAssistantId
    } else {
      return this.chatAssistantId
    }
  }

  // Obter tipo do assistente usado para métricas
  private getAssistantUsed(assistantId: string): 'chat' | 'creator' | 'expert' {
    if (assistantId === this.chatAssistantId) return 'chat'
    if (assistantId === this.creatorAssistantId) return 'creator'
    if (assistantId === this.expertAssistantId) return 'expert'
    return 'chat' // fallback
  }

  // Obter tipo do assistente para logs
  private getAssistantType(assistantId: string): string {
    if (assistantId === this.chatAssistantId) return 'Chat (GPT-4o mini)'
    if (assistantId === this.creatorAssistantId) return 'Creator (GPT-4o)'
    if (assistantId === this.expertAssistantId) return 'Expert (GPT-4)'
    return 'Unknown'
  }

  // Construir mensagem de contexto baseada no perfil
  private buildContextMessage(profile?: UserProfile): string {
    if (!profile) return ''

    const context = []
    
    if (profile.nome) context.push(`Nome: ${profile.nome}`)
    if (profile.profissao) context.push(`Profissão: ${profile.profissao}`)
    if (profile.especializacao) context.push(`Especialização: ${profile.especializacao}`)
    if (profile.publico_alvo) context.push(`Público-alvo: ${profile.publico_alvo}`)
    if (profile.objetivo_principal) context.push(`Objetivo: ${profile.objetivo_principal}`)
    if (profile.tipo_ferramenta) context.push(`Tipo de ferramenta: ${profile.tipo_ferramenta}`)
    if (profile.idioma) context.push(`Idioma: ${profile.idioma}`)
    if (profile.preferencias_ia?.tom) context.push(`Tom preferido: ${profile.preferencias_ia.tom}`)

    return context.length > 0 ? `CONTEXTO DO USUÁRIO:\n${context.join('\n')}` : ''
  }

  // Parsear resposta da assistant
  private parseAssistantResponse(response: string, currentProfile?: UserProfile): AssistantResponse {
    // Detectar se é uma resposta de finalização
    const isComplete = response.includes('gerar') && 
                      (response.includes('link') || response.includes('ferramenta') || response.includes('pronto'))

    // Detectar sugestão de ferramenta
    const toolMatch = response.match(/\*\*(.*?)\*\*/)
    const toolSuggestion = toolMatch ? {
      name: toolMatch[1],
      type: 'quiz', // Default, pode ser refinado
      description: response
    } : undefined

    // Detectar próximo passo baseado na resposta
    let nextStep: number | undefined
    if (response.includes('foco principal') || response.includes('especialização')) {
      nextStep = 2
    } else if (response.includes('conectar') || response.includes('público')) {
      nextStep = 3
    } else if (response.includes('objetivo') || response.includes('meta')) {
      nextStep = 4
    } else if (response.includes('tipo de ferramenta') || response.includes('criar')) {
      nextStep = 5
    } else if (response.includes('tom') || response.includes('estilo')) {
      nextStep = 6
    } else if (response.includes('sugestões') || response.includes('opções')) {
      nextStep = 7
    }

    return {
      message: response,
      nextStep,
      complete: isComplete,
      toolSuggestion
    }
  }

  // Resposta de fallback se OpenAI falhar
  private getFallbackResponse(message: string, profile?: UserProfile): AssistantResponse {
    const input = message.toLowerCase()
    
    // Detectar profissão
    if (input.includes('nutricionista') || input.includes('nutrição')) {
      return {
        message: `Perfeito! E qual é o foco principal do seu trabalho? (Exemplo: emagrecimento, estética facial, saúde intestinal, performance esportiva…)`,
        profile: { profissao: 'Nutricionista' },
        nextStep: 2
      }
    }
    
    if (input.includes('esteticista') || input.includes('estética')) {
      return {
        message: `Ótimo! E qual é sua especialização? (Exemplo: facial, corporal, depilação, tratamentos estéticos…)`,
        profile: { profissao: 'Esteticista' },
        nextStep: 2
      }
    }
    
    if (input.includes('personal trainer') || input.includes('educador físico')) {
      return {
        message: `Excelente! E qual é seu foco? (Exemplo: emagrecimento, hipertrofia, funcional, reabilitação…)`,
        profile: { profissao: 'Personal Trainer' },
        nextStep: 2
      }
    }
    
    if (input.includes('coach') || input.includes('mentor')) {
      return {
        message: `Perfeito! E qual é sua área de coaching? (Exemplo: vida, carreira, relacionamentos, saúde mental…)`,
        profile: { profissao: 'Coach' },
        nextStep: 2
      }
    }

    // Resposta genérica
    return {
      message: `Entendi! E qual é o foco principal do seu trabalho? Me conte um pouco mais sobre sua especialização.`,
      nextStep: 2
    }
  }

  // Gerar sugestões de ferramentas baseadas no perfil
  generateToolSuggestions(profile: UserProfile): string {
    const { profissao, especializacao, objetivo_principal, tipo_ferramenta } = profile
    
    let suggestions = `🎯 Sugestões personalizadas para você:\n\n`
    
    if (profissao?.toLowerCase().includes('nutricionista')) {
      if (especializacao?.toLowerCase().includes('emagrecimento')) {
        suggestions += `✅ **Quiz "Descubra seu Perfil Metabólico"** — ideal para ${objetivo_principal}\n`
        suggestions += `✅ **Calculadora "Seu Déficit Calórico Ideal"** — excelente para gerar leads qualificados\n`
      } else if (especializacao?.toLowerCase().includes('esportiva')) {
        suggestions += `✅ **Quiz "Seu Perfil de Performance"** — ideal para atletas\n`
        suggestions += `✅ **Calculadora "Suas Necessidades Proteicas"** — excelente para conversão\n`
      } else {
        suggestions += `✅ **Quiz "Descubra seu Perfil Nutricional"** — ideal para ${objetivo_principal}\n`
        suggestions += `✅ **Calculadora "Seu Índice de Energia"** — excelente para gerar valor\n`
      }
    } else if (profissao?.toLowerCase().includes('esteticista')) {
      suggestions += `✅ **Simulador "Monte seu Tratamento Ideal"** — ideal para ${objetivo_principal}\n`
      suggestions += `✅ **Catálogo "Transforme sua Pele em 30 Dias"** — excelente para conversão\n`
    } else if (profissao?.toLowerCase().includes('personal trainer')) {
      suggestions += `✅ **Desafio "7 Dias de Foco Total"** — ideal para engajamento\n`
      suggestions += `✅ **Ranking "Seu Nível de Fitness"** — excelente para gamificação\n`
    } else if (profissao?.toLowerCase().includes('coach')) {
      suggestions += `✅ **Diagnóstico "Mapa da Clareza Mental"** — ideal para ${objetivo_principal}\n`
      suggestions += `✅ **E-book "Guia de Transformação"** — excelente para gerar valor\n`
    } else {
      suggestions += `✅ **${tipo_ferramenta || 'Quiz'} "${especializacao || 'Personalizado'}"** — ideal para ${objetivo_principal}\n`
      suggestions += `✅ **Checklist "Guia de Sucesso"** — excelente para gerar valor\n`
    }
    
    suggestions += `\nQuer que eu gere o link e a capa visual da primeira? 🎨`
    
    return suggestions
  }

  // Gerar nome da ferramenta baseado no perfil
  generateToolName(profile: UserProfile): string {
    const { profissao, especializacao, tipo_ferramenta } = profile
    
    if (profissao?.toLowerCase().includes('nutricionista')) {
      if (especializacao?.toLowerCase().includes('emagrecimento')) {
        return 'Descubra seu Perfil Metabólico'
      } else if (especializacao?.toLowerCase().includes('esportiva')) {
        return 'Seu Perfil de Performance'
      } else {
        return 'Descubra seu Perfil Nutricional'
      }
    } else if (profissao?.toLowerCase().includes('esteticista')) {
      return 'Monte seu Tratamento Ideal'
    } else if (profissao?.toLowerCase().includes('personal trainer')) {
      return 'Desafio dos 7 Dias de Foco'
    } else if (profissao?.toLowerCase().includes('coach')) {
      return 'Mapa da Clareza Mental'
    } else {
      return `${tipo_ferramenta || 'Ferramenta'} de ${especializacao || 'Sucesso'}`
    }
  }
}

// Instância singleton
export const yladaAssistant = new YLADAAssistant()
