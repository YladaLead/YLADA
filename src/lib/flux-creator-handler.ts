/**
 * Flux Creator Handler
 * 
 * Gerencia a integração com OpenAI Assistants API para criação de fluxos/diagnósticos.
 * Baseado na experiência do sistema (3 tipos principais de diagnósticos).
 * 
 * FLUXO:
 * 1. Recebe comando do admin (tema, segmento, arquitetura)
 * 2. Envia para Assistants API (agente criador)
 * 3. Agente gera estrutura completa do fluxo
 * 4. Valida estrutura
 * 5. Salva na biblioteca automaticamente
 */

import OpenAI from 'openai'

/** Lazy init: evita falha no `next build` quando OPENAI_API_KEY não existe no ambiente de build. */
let openaiClient: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

// ID do Assistant criador (pode vir de env ou ser criado automaticamente)
let ASSISTANT_CREATOR_ID: string | undefined = process.env.OPENAI_ASSISTANT_FLUX_CREATOR_ID
let assistantCreated = false

export interface GerarFluxoInput {
  tema?: string
  segmento: string
  arquitetura: 'RISK_DIAGNOSIS' | 'BLOCKER_DIAGNOSIS' | 'PROFILE_TYPE'
  comando?: string
}

export interface FluxoGerado {
  titulo: string
  description: string
  questions: Array<{
    id: string
    label: string
    type: 'single' | 'multiple'
    options?: string[]
  }>
  architecture: string
  segment_code: string
  tema: string
  meta: Record<string, any>
  flow_id: string
}

/**
 * Obtém ou cria o Assistant criador via API
 */
async function getOrCreateAssistant(): Promise<{ success: boolean; assistantId?: string; message: string }> {
  // Se já temos ID e já foi criado, usar
  if (ASSISTANT_CREATOR_ID && assistantCreated) {
    return { success: true, assistantId: ASSISTANT_CREATOR_ID }
  }

  // Se temos ID na env, verificar se existe
  if (ASSISTANT_CREATOR_ID) {
    try {
      await getOpenAI().beta.assistants.retrieve(ASSISTANT_CREATOR_ID)
      assistantCreated = true
      return { success: true, assistantId: ASSISTANT_CREATOR_ID }
    } catch (error) {
      // Assistant não existe, criar novo
      console.log('Assistant não encontrado, criando novo...')
    }
  }

  // Criar Assistant via API
  // Modelo configurável via env (padrão: gpt-4o-mini para economia)
  // Opções: gpt-4o-mini, gpt-4o, gpt-4-turbo, gpt-4.1-mini (se disponível)
  const model = process.env.OPENAI_ASSISTANT_FLUX_CREATOR_MODEL || 'gpt-4o-mini'
  
  try {
    const assistant = await getOpenAI().beta.assistants.create({
      name: 'YLADA Flux Creator',
      instructions: getAssistantInstructions(),
      model: model,
      description: 'Assistente especializado em criar fluxos e diagnósticos para a biblioteca YLADA',
    })

    ASSISTANT_CREATOR_ID = assistant.id
    assistantCreated = true

    console.log(`✅ Assistant criado automaticamente: ${assistant.id}`)
    console.log(`📊 Modelo usado: ${model}`)
    console.log(`💡 Adicione no .env: OPENAI_ASSISTANT_FLUX_CREATOR_ID=${assistant.id}`)
    console.log(`💡 Modelo configurado: ${model} (altere via OPENAI_ASSISTANT_FLUX_CREATOR_MODEL)`)

    return { success: true, assistantId: assistant.id }
  } catch (error: any) {
    console.error('Erro ao criar Assistant:', error)
    return {
      success: false,
      message: `Erro ao criar Assistant: ${error.message}`,
    }
  }
}

/**
 * Retorna as instruções do Assistant
 */
function getAssistantInstructions(): string {
  return `Você é um especialista em criar fluxos de diagnóstico para profissionais de saúde e bem-estar da plataforma YLADA.

Sua função é criar fluxos completos de diagnóstico que serão adicionados automaticamente à biblioteca do sistema.

REGRAS IMPORTANTES:
1. Sempre retorne APENAS JSON válido, sem markdown ou texto adicional
2. Use português brasileiro
3. Seja específico para o segmento solicitado
4. Perguntas devem ser práticas e acionáveis
5. Cada pergunta deve ter 3-5 opções de resposta

ESTRUTURA OBRIGATÓRIA DO JSON:
{
  "titulo": "Título atrativo e claro",
  "description": "Descrição breve (1-2 linhas)",
  "questions": [
    {
      "id": "q1",
      "label": "Texto da pergunta",
      "type": "single",
      "options": ["Opção 1", "Opção 2", "Opção 3"]
    }
  ],
  "architecture": "RISK_DIAGNOSIS" ou "BLOCKER_DIAGNOSIS" ou "PROFILE_TYPE",
  "segment_code": "código do segmento",
  "tema": "tema do diagnóstico",
  "flow_id": "diagnostico_risco" ou "diagnostico_bloqueio" ou "perfil_comportamental",
  "meta": {}
}

ARQUITETURAS:

RISK_DIAGNOSIS:
- Perguntas devem avaliar sinais, sintomas, histórico e impacto
- Resultado será nível de risco: baixo, médio ou alto
- Foco em saúde, prevenção e consequências
- flow_id: "diagnostico_risco"

BLOCKER_DIAGNOSIS:
- Perguntas devem identificar bloqueios (rotina, emocional, processo, hábitos, expectativa)
- Resultado será o principal bloqueio identificado
- Foco em destravar e primeiro passo
- flow_id: "diagnostico_bloqueio"

PROFILE_TYPE:
- Perguntas devem identificar perfil comportamental
- Resultado será um perfil (consistente, 8ou80, ansioso, analítico, improvisador)
- Foco em autoconhecimento e caminho personalizado
- flow_id: "perfil_comportamental"

SEGMENTOS DISPONÍVEIS:
- nutrition: Nutrição
- nutrition_vendedor: Vendedores Nutracêuticos
- medicine: Médicos
- psychology: Psicólogos
- dentistry: Odontologia
- aesthetics: Estética
- fitness: Fitness
- perfumaria: Perfumaria
- joias: Joias e bijuterias

IMPORTANTE:
- Sempre retorne JSON válido
- Não use markdown code blocks
- Não adicione texto explicativo antes ou depois do JSON
- Valide que o JSON está correto antes de retornar`
}

/**
 * Gera um fluxo completo usando o agente criador
 */
export async function gerarFluxoComAgente(
  input: GerarFluxoInput
): Promise<{ success: boolean; fluxo?: FluxoGerado; message: string }> {
  // Obter ou criar Assistant
  console.log('🔍 [Flux Creator] Obtendo ou criando Assistant...')
  const assistantResult = await getOrCreateAssistant()
  
  if (!assistantResult.success) {
    console.error('❌ [Flux Creator] Falha ao obter Assistant:', assistantResult.message)
    return {
      success: false,
      message: assistantResult.message,
    }
  }
  
  if (!assistantResult.assistantId) {
    console.error('❌ [Flux Creator] Assistant ID não retornado')
    return {
      success: false,
      message: 'Assistant ID não foi retornado. Verifique a configuração.',
    }
  }

  const assistantId = assistantResult.assistantId
  console.log('✅ [Flux Creator] Assistant ID obtido:', assistantId)

  try {
    // Criar thread
    console.log('🔄 [Flux Creator] Criando thread...')
    let thread
    try {
      thread = await getOpenAI().beta.threads.create()
    } catch (threadError: any) {
      console.error('❌ [Flux Creator] Erro ao criar thread:', threadError)
      return {
        success: false,
        message: `Erro ao criar thread: ${threadError.message || 'Erro desconhecido'}`,
      }
    }
    
    if (!thread) {
      console.error('❌ [Flux Creator] Thread é null/undefined')
      return {
        success: false,
        message: 'Erro ao criar thread: resposta vazia da API.',
      }
    }
    
    if (!thread.id) {
      console.error('❌ [Flux Creator] Thread criado mas sem ID:', thread)
      return {
        success: false,
        message: 'Erro ao criar thread: thread criado mas sem ID válido.',
      }
    }
    
    const threadId = thread.id
    console.log('✅ [Flux Creator] Thread criado com sucesso:', threadId)

    // Montar prompt para o agente
    const prompt = construirPrompt(input)

    // Adicionar mensagem
    console.log('📨 [Flux Creator] Adicionando mensagem ao thread...')
    try {
      await getOpenAI().beta.threads.messages.create(threadId, {
        role: 'user',
        content: prompt,
      })
      console.log('✅ [Flux Creator] Mensagem adicionada ao thread')
    } catch (messageError: any) {
      console.error('❌ [Flux Creator] Erro ao adicionar mensagem:', messageError)
      return {
        success: false,
        message: `Erro ao adicionar mensagem: ${messageError.message}`,
      }
    }

    // Executar run
    if (!assistantId) {
      console.error('❌ [Flux Creator] Assistant ID não disponível')
      return {
        success: false,
        message: 'Assistant ID não está disponível.',
      }
    }
    
    console.log('🚀 [Flux Creator] Criando run com assistant:', assistantId, 'thread:', threadId)
    let run
    try {
      run = await getOpenAI().beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      })
    } catch (runError: any) {
      console.error('❌ [Flux Creator] Erro ao criar run:', runError)
      console.error('❌ [Flux Creator] ThreadId:', threadId, 'AssistantId:', assistantId)
      return {
        success: false,
        message: `Erro ao criar run: ${runError.message || 'Erro desconhecido'}`,
      }
    }
    
    if (!run) {
      console.error('❌ [Flux Creator] Run é null/undefined')
      return {
        success: false,
        message: 'Erro ao criar run: resposta vazia da API.',
      }
    }
    
    if (!run.id) {
      console.error('❌ [Flux Creator] Run criado mas sem ID:', run)
      return {
        success: false,
        message: 'Erro ao criar run: run criado mas sem ID válido.',
      }
    }
    
    console.log('✅ [Flux Creator] Run criado com sucesso:', run.id)
    console.log('🔍 [Flux Creator] Valores antes de retrieve - threadId:', threadId, 'runId:', run.id)

    // Validar valores antes de usar
    if (!threadId || typeof threadId !== 'string') {
      console.error('❌ [Flux Creator] threadId inválido:', threadId, typeof threadId)
      return {
        success: false,
        message: `Erro: threadId inválido (${threadId}). Verifique os logs.`,
      }
    }
    
    if (!run.id || typeof run.id !== 'string') {
      console.error('❌ [Flux Creator] run.id inválido:', run.id, typeof run.id)
      return {
        success: false,
        message: `Erro: run.id inválido (${run.id}). Verifique os logs.`,
      }
    }

    // Aguardar conclusão
    // IMPORTANTE: A SDK do OpenAI v6 espera: runs.retrieve(runId, { thread_id: threadId })
    // NÃO: runs.retrieve(threadId, runId)
    console.log('🔄 [Flux Creator] Buscando status do run...')
    let runStatus
    try {
      runStatus = await getOpenAI().beta.threads.runs.retrieve(run.id, {
        thread_id: threadId
      })
    } catch (retrieveError: any) {
      console.error('❌ [Flux Creator] Erro ao buscar run status:', retrieveError)
      console.error('❌ [Flux Creator] threadId usado:', threadId)
      console.error('❌ [Flux Creator] run.id usado:', run.id)
      return {
        success: false,
        message: `Erro ao buscar status do run: ${retrieveError.message}`,
      }
    }
    let attempts = 0
    const maxAttempts = 60 // 60 tentativas = ~2 minutos

    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      if (attempts >= maxAttempts) {
        return {
          success: false,
          message: 'Timeout: o agente demorou muito para responder.',
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)) // 2 segundos
      
      // Validar threadId antes de cada chamada
      if (!threadId || !run.id) {
        console.error('❌ [Flux Creator] threadId ou run.id perdido durante loop')
        return {
          success: false,
          message: 'Erro: threadId ou run.id perdido durante o processamento.',
        }
      }
      
      try {
        // IMPORTANTE: A SDK espera: runs.retrieve(runId, { thread_id: threadId })
        runStatus = await getOpenAI().beta.threads.runs.retrieve(run.id, {
          thread_id: threadId
        })
      } catch (retrieveError: any) {
        console.error('❌ [Flux Creator] Erro ao buscar run status no loop:', retrieveError)
        return {
          success: false,
          message: `Erro ao buscar status: ${retrieveError.message}`,
        }
      }
      attempts++
    }

    if (runStatus.status === 'completed') {
      // Buscar mensagens
      const messages = await getOpenAI().beta.threads.messages.list(threadId)
      const assistantMessage = messages.data.find((m) => m.role === 'assistant')

      if (!assistantMessage) {
        return {
          success: false,
          message: 'Agente não retornou resposta.',
        }
      }

      // Extrair conteúdo (pode ser texto ou function call)
      const content = assistantMessage.content[0]
      if (content.type === 'text') {
        // Tentar parsear JSON da resposta
        const texto = content.text.value
        const fluxo = parsearRespostaAgente(texto, input)
        
        if (fluxo) {
          return {
            success: true,
            fluxo,
            message: 'Fluxo gerado com sucesso!',
          }
        }
      }

      // Se houver function calls, processar
      if (runStatus.required_action?.type === 'submit_tool_outputs') {
        // Processar function calls se necessário
        // Por enquanto, retornar erro pedindo para configurar functions
        return {
          success: false,
          message: 'Agente retornou function calls. Configure as functions no Assistant.',
        }
      }

      return {
        success: false,
        message: 'Não foi possível extrair o fluxo da resposta do agente.',
      }
    }

    return {
      success: false,
      message: `Status do agente: ${runStatus.status}`,
    }
  } catch (error: any) {
    console.error('❌ [Flux Creator] Erro geral ao gerar fluxo:', error)
    console.error('❌ [Flux Creator] Stack:', error.stack)
    return {
      success: false,
      message: `Erro: ${error.message || 'Erro desconhecido'}. Verifique os logs do servidor para mais detalhes.`,
    }
  }
}

/**
 * Constrói o prompt para o agente criador
 */
function construirPrompt(input: GerarFluxoInput): string {
  const { tema, segmento, arquitetura, comando } = input

  let prompt = `Você é um especialista em criar fluxos de diagnóstico para profissionais de saúde e bem-estar.

TAREFA: Criar um fluxo completo de diagnóstico que será adicionado à biblioteca do sistema YLADA.

CONTEXTO:
- Segmento: ${segmento}
- Arquitetura: ${arquitetura}
${tema ? `- Tema: ${tema}` : ''}
${comando ? `- Comando específico: ${comando}` : ''}

REQUISITOS:
1. Criar título atrativo e claro
2. Criar descrição breve (1-2 linhas)
3. Criar 4-6 perguntas relevantes para o tema e segmento
4. Cada pergunta deve ter opções de resposta (3-5 opções)
5. Estrutura deve ser compatível com a arquitetura ${arquitetura}

${arquitetura === 'RISK_DIAGNOSIS' ? `
ARQUITETURA RISK_DIAGNOSIS:
- Perguntas devem avaliar sinais, sintomas, histórico e impacto
- Resultado será nível de risco: baixo, médio ou alto
- Foco em saúde, prevenção e consequências
` : ''}

${arquitetura === 'BLOCKER_DIAGNOSIS' ? `
ARQUITETURA BLOCKER_DIAGNOSIS:
- Perguntas devem identificar bloqueios (rotina, emocional, processo, hábitos, expectativa)
- Resultado será o principal bloqueio identificado
- Foco em destravar e primeiro passo
` : ''}

${arquitetura === 'PROFILE_TYPE' ? `
ARQUITETURA PROFILE_TYPE:
- Perguntas devem identificar perfil comportamental
- Resultado será um perfil (consistente, 8ou80, ansioso, analítico, improvisador)
- Foco em autoconhecimento e caminho personalizado
` : ''}

FORMATO DE RESPOSTA (JSON):
{
  "titulo": "Título do diagnóstico",
  "description": "Descrição breve",
  "questions": [
    {
      "id": "q1",
      "label": "Texto da pergunta",
      "type": "single",
      "options": ["Opção 1", "Opção 2", "Opção 3"]
    }
  ],
  "architecture": "${arquitetura}",
  "segment_code": "${segmento}",
  "tema": "${tema || 'geral'}",
  "flow_id": "diagnostico_risco" ou "diagnostico_bloqueio" ou "perfil_comportamental",
  "meta": {}
}

IMPORTANTE:
- Retorne APENAS JSON válido, sem markdown
- Use português brasileiro
- Seja específico para o segmento ${segmento}
- Perguntas devem ser práticas e acionáveis
`

  return prompt
}

/**
 * Parseia a resposta do agente e extrai o fluxo
 */
function parsearRespostaAgente(
  texto: string,
  input: GerarFluxoInput
): FluxoGerado | null {
  try {
    // Tentar extrair JSON do texto (pode estar em markdown code block)
    let jsonStr = texto.trim()

    // Remover markdown code blocks se houver
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    }

    const parsed = JSON.parse(jsonStr) as Partial<FluxoGerado>

    // Validar estrutura mínima
    if (!parsed.titulo || !parsed.questions || !Array.isArray(parsed.questions)) {
      return null
    }

    // Mapear flow_id baseado na arquitetura
    let flowId = 'diagnostico_risco'
    if (input.arquitetura === 'BLOCKER_DIAGNOSIS') {
      flowId = 'diagnostico_bloqueio'
    } else if (input.arquitetura === 'PROFILE_TYPE') {
      flowId = 'perfil_comportamental'
    }

    return {
      titulo: parsed.titulo,
      description: parsed.description || '',
      questions: parsed.questions,
      architecture: input.arquitetura,
      segment_code: input.segmento,
      tema: input.tema || 'geral',
      meta: parsed.meta || {},
      flow_id: flowId,
    }
  } catch (error) {
    console.error('Erro ao parsear resposta do agente:', error)
    return null
  }
}
