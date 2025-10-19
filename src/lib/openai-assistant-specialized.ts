import OpenAI from 'openai'

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
  private specializedAssistantId: string
  private threadId?: string

  constructor() {
    this.specializedAssistantId = process.env.OPENAI_ASSISTANT_SPECIALIZED_ID || 'asst_Jafki3CmiatIkSiFSXxCEvo4'
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

  // Enviar mensagem para a assistant especializada
  async sendMessage(message: string, userProfile?: UserProfile): Promise<AssistantResponse> {
    try {
      if (!this.threadId) {
        await this.createThread()
      }

      console.log('🤖 Usando YLADA Health Specialized para esta mensagem')

      // Verificar se o ID do assistente é válido
      if (this.specializedAssistantId.includes('asst_default_') || !this.specializedAssistantId.startsWith('asst_')) {
        console.warn(`⚠️ ID do assistente inválido: ${this.specializedAssistantId}. Usando fallback local.`)
        throw new Error('Assistente não configurado - usando fallback local')
      }

      // Preparar contexto do usuário
      const contextMessage = this.buildContextMessage(userProfile)
      const fullMessage = contextMessage ? `${contextMessage}\n\n${message}` : message

      // Adicionar mensagem ao thread
      await openai.beta.threads.messages.create(this.threadId!, {
        role: 'user',
        content: fullMessage
      })

      // Executar assistant especializada
      const run = await openai.beta.threads.runs.create(this.threadId!, {
        assistant_id: this.specializedAssistantId
      })

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
          
          return parsedResponse
        }
      }

      throw new Error('Falha ao obter resposta da assistant')

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      // Fallback para resposta local se OpenAI falhar
      return this.getFallbackResponse(message, userProfile)
    }
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
    
    // Detectar profissão e objetivo de uma vez
    let detectedProfession = ''
    let detectedObjective = ''
    
    // Detectar profissões
    if (input.includes('nutricionista') || input.includes('nutrição') || input.includes('nutricao')) {
      detectedProfession = 'nutricionista'
    } else if (input.includes('personal trainer') || input.includes('educador físico') || input.includes('personal')) {
      detectedProfession = 'personal trainer'
    } else if (input.includes('fisioterapeuta') || input.includes('fisio')) {
      detectedProfession = 'fisioterapeuta'
    } else if (input.includes('coach') || input.includes('mentor')) {
      detectedProfession = 'coach'
    } else if (input.includes('esteticista') || input.includes('estética')) {
      detectedProfession = 'esteticista'
    }
    
    // Detectar objetivos
    if (input.includes('atrair') || input.includes('novos clientes') || input.includes('leads') ||
        input.includes('cliente') || input.includes('agenda vazia') || input.includes('mais cliente') ||
        input.includes('ter mais') || input.includes('conseguir cliente') || input.includes('buscar cliente')) {
      detectedObjective = 'atrair novos clientes'
    } else if (input.includes('vender') || input.includes('produtos') || input.includes('vendas')) {
      detectedObjective = 'vender produtos/serviços'
    } else if (input.includes('engajar') || input.includes('fidelizar') || input.includes('manter')) {
      detectedObjective = 'engajar clientes atuais'
    } else if (input.includes('educar') || input.includes('conhecimento') || input.includes('autoridade')) {
      detectedObjective = 'educar e gerar valor'
    }
    
    // Resposta baseada no que foi detectado
    if (detectedProfession && detectedObjective) {
      return {
        message: `Perfeito! Entendi que você é **${detectedProfession}** e quer **${detectedObjective}**.

🎯 **Aqui estão as melhores ferramentas para você:**

${detectedProfession === 'nutricionista' ? `
🧩 **Quiz "Descubra seu Perfil Metabólico"** - ideal para atrair leads qualificados
🧮 **Calculadora "Seu Déficit Calórico Ideal"** - excelente para engajamento
📊 **Diagnóstico "Avalie sua Relação com a Comida"** - perfeito para conversão
` : detectedProfession === 'personal trainer' ? `
🏋️ **Desafio "7 Dias de Foco Total"** - ideal para engajamento
📈 **Ranking "Seu Nível de Fitness"** - excelente para gamificação
🧮 **Calculadora "Seu Treino Ideal"** - perfeito para personalização
` : detectedProfession === 'coach' ? `
🧠 **Diagnóstico "Mapa da Clareza Mental"** - ideal para autoconhecimento
📋 **Checklist "Transformação em 30 Dias"** - excelente para engajamento
🎯 **Quiz "Seu Perfil de Liderança"** - perfeito para desenvolvimento
` : `
🧩 **Quiz Personalizado** - ideal para ${detectedObjective}
📊 **Diagnóstico Especializado** - excelente para engajamento
🧮 **Calculadora Inteligente** - perfeito para conversão
`}

**Qual dessas ferramentas você gostaria de criar primeiro?** 🚀`,
        profile: { 
          profissao: detectedProfession, 
          objetivo_principal: detectedObjective 
        },
        nextStep: 5,
        complete: true
      }
    } else if (detectedProfession) {
      return {
        message: `Ótimo! Vejo que você é **${detectedProfession}**.

Agora me conte: **qual é seu objetivo principal** com essa ferramenta?

• 🎯 **Atrair novos clientes** - pessoas interessadas em seus serviços
• 🤝 **Engajar clientes atuais** - manter relacionamento e fidelidade  
• 🌟 **Gerar indicações** - transformar clientes em promotores
• 🛒 **Vender produtos/serviços** - aumentar vendas e conversão
• 📘 **Educar e gerar valor** - mostrar autoridade e conhecimento

**Qual desses objetivos mais se alinha com o que você quer criar hoje?**`,
        profile: { profissao: detectedProfession },
        nextStep: 3
      }
    } else if (detectedObjective) {
      return {
        message: `Perfeito! Entendi que você quer **${detectedObjective}**.

Agora me conte: **qual é sua profissão ou área de atuação?**

• 🥗 **Nutricionista** - especialista em alimentação e saúde
• 🏋️ **Personal Trainer** - especialista em exercícios e fitness
• 🩺 **Fisioterapeuta** - especialista em reabilitação e movimento
• 🧠 **Coach** - especialista em desenvolvimento pessoal
• 💆 **Esteticista** - especialista em beleza e bem-estar
• ✨ **Outro** - me conte sua profissão específica

**Qual é sua área de atuação?**`,
        profile: { objetivo_principal: detectedObjective },
        nextStep: 2
      }
    }

    // Resposta genérica
    return {
      message: `Entendi! Para criar a ferramenta perfeita para você, preciso saber:

**1. Qual é sua profissão?** (ex: nutricionista, personal trainer, coach...)
**2. Qual seu objetivo principal?** (atrair clientes, vender produtos, gerar leads...)

Pode responder tudo de uma vez! Assim eu crio algo personalizado para suas necessidades específicas. 🎯`,
      nextStep: 1
    }
  }
}

// Instância singleton
export const yladaAssistant = new YLADAAssistant()
