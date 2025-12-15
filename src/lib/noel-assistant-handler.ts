/**
 * NOEL Assistant Handler
 * 
 * Gerencia a integração com OpenAI Assistants API
 * Processa function calls e executa as functions localmente
 * 
 * FLUXO:
 * 1. Recebe mensagem do usuário
 * 2. Envia para Assistants API
 * 3. Detecta function_call
 * 4. Executa function no backend (/api/noel/[function])
 * 5. Retorna resultado para Assistants API
 * 6. Recebe resposta final
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_NOEL_ID || process.env.OPENAI_ASSISTANT_ID

/**
 * Executa uma function do NOEL localmente
 */
async function executeNoelFunction(functionName: string, arguments_: any, userId: string): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const secret = process.env.OPENAI_FUNCTION_SECRET

  try {
    let url = ''
    let body: any = {}

    switch (functionName) {
      case 'getUserProfile':
        url = `${baseUrl}/api/noel/getUserProfile`
        // SEMPRE usar userId real (ignorar arguments_.user_id que pode vir como 'user-1')
        body = { user_id: userId }
        break

      case 'saveInteraction':
        url = `${baseUrl}/api/noel/saveInteraction`
        body = {
          user_id: userId, // SEMPRE usar userId real
          user_message: arguments_.user_message,
          noel_response: arguments_.noel_response,
        }
        break

      case 'getPlanDay':
        url = `${baseUrl}/api/noel/getPlanDay`
        body = { user_id: userId } // SEMPRE usar userId real
        break

      case 'updatePlanDay':
        url = `${baseUrl}/api/noel/updatePlanDay`
        body = {
          user_id: userId, // SEMPRE usar userId real
          new_day: arguments_.new_day,
        }
        break

      case 'registerLead':
        url = `${baseUrl}/api/noel/registerLead`
        body = {
          user_id: userId, // SEMPRE usar userId real
          lead_name: arguments_.lead_name,
          lead_phone: arguments_.lead_phone || null,
          lead_source: arguments_.lead_source || null,
        }
        break

      case 'getClientData':
        url = `${baseUrl}/api/noel/getClientData`
        body = { client_id: arguments_.client_id }
        break

      case 'buscarBiblioteca':
        url = `${baseUrl}/api/noel/buscarBiblioteca`
        body = {
          busca: arguments_.busca || '',
          tipo: arguments_.tipo || 'todos'
        }
        break

      case 'recomendarFluxo':
        url = `${baseUrl}/api/noel/recomendarFluxo`
        body = {
          contexto: arguments_.contexto || '',
          situacao: arguments_.situacao || ''
        }
        break

      case 'recomendarLinkWellness':
        url = `${baseUrl}/api/noel/recomendarLinkWellness`
        body = {
          tipo_lead: arguments_.tipo_lead || null,
          necessidade: arguments_.necessidade || null,
          palavras_chave: arguments_.palavras_chave || null,
          objetivo: arguments_.objetivo || null
        }
        break

      case 'buscarTreino':
        url = `${baseUrl}/api/noel/buscarTreino`
        body = {
          tipo: arguments_.tipo || null,
          gatilho: arguments_.gatilho || null
        }
        break

      case 'getFluxoInfo':
        url = `${baseUrl}/api/noel/getFluxoInfo`
        body = {
          fluxo_codigo: arguments_.fluxo_codigo || null,
          fluxo_id: arguments_.fluxo_id || null
        }
        break

      case 'getFerramentaInfo':
        url = `${baseUrl}/api/noel/getFerramentaInfo`
        body = {
          ferramenta_slug: arguments_.ferramenta_slug || arguments_.slug || null,
          user_id: userId // Sempre incluir user_id para gerar link personalizado
        }
        break

      case 'getQuizInfo':
        url = `${baseUrl}/api/noel/getQuizInfo`
        body = {
          quiz_slug: arguments_.quiz_slug || arguments_.slug || null,
          user_id: userId // Sempre incluir user_id para gerar link personalizado
        }
        break

      case 'getLinkInfo':
        url = `${baseUrl}/api/noel/getLinkInfo`
        body = {
          link_codigo: arguments_.link_codigo || arguments_.codigo || null
        }
        break

      case 'getMaterialInfo':
        url = `${baseUrl}/api/noel/getMaterialInfo`
        body = {
          busca: arguments_.busca || arguments_.nome || arguments_.titulo || null,
          link_atalho: arguments_.link_atalho || null,
          tipo: arguments_.tipo || null,
          categoria: arguments_.categoria || null
        }
        break

      case 'calcularObjetivosCompletos':
        url = `${baseUrl}/api/wellness/noel/calcular-objetivos`
        body = {} // Não precisa de parâmetros, usa o userId da sessão
        break

      default:
        throw new Error(`Function desconhecida: ${functionName}`)
    }

    // Fazer requisição para a rota local
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Adicionar autenticação se configurada
    if (secret) {
      headers['Authorization'] = `Bearer ${secret}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
      console.error(`❌ [executeNoelFunction] Erro HTTP ${response.status} para ${functionName}:`, errorData)
      
      // Criar erro com mais informações
      const error = new Error(errorData.error || errorData.message || `Erro ao executar ${functionName}`)
      ;(error as any).response = { data: errorData, status: response.status }
      throw error
    }

    const data = await response.json()
    return data.success ? data.data : null
  } catch (error: any) {
    console.error(`❌ Erro ao executar function ${functionName}:`, error)
    throw error
  }
}

/**
 * Processa uma mensagem usando Assistants API com function calling
 */
export async function processMessageWithAssistant(
  message: string,
  userId: string,
  threadId?: string
): Promise<{
  response: string
  newThreadId: string
  functionCalls?: Array<{ name: string; arguments: any; result: any }>
}> {
  console.log('🔍 [NOEL Handler] Verificando ASSISTANT_ID...')
  console.log('🔍 [NOEL Handler] ASSISTANT_ID:', ASSISTANT_ID || '❌ NÃO CONFIGURADO')
  
  if (!ASSISTANT_ID) {
    const errorMsg = 'OPENAI_ASSISTANT_NOEL_ID não configurado. Configure a variável de ambiente OPENAI_ASSISTANT_NOEL_ID ou OPENAI_ASSISTANT_ID'
    console.error('❌ [NOEL Handler]', errorMsg)
    throw new Error(errorMsg)
  }
  
  console.log('✅ [NOEL Handler] ASSISTANT_ID válido:', ASSISTANT_ID.substring(0, 20) + '...')

  // Usar const para garantir que não seja sobrescrito acidentalmente
  let currentThreadId: string | undefined = threadId

  // Criar thread se não existir
  if (!currentThreadId) {
    console.log('🆕 [NOEL Handler] Criando novo thread...')
    try {
      const thread = await openai.beta.threads.create()
      currentThreadId = thread.id
      console.log('✅ [NOEL Handler] Thread criado:', currentThreadId)
      
      if (!currentThreadId) {
        throw new Error('Thread criado mas sem ID válido')
      }
    } catch (threadError: any) {
      console.error('❌ [NOEL Handler] Erro ao criar thread:', threadError.message)
      throw threadError
    }
  } else {
    console.log('♻️ [NOEL Handler] Usando thread existente:', currentThreadId)
  }

  // Adicionar mensagem do usuário
  console.log('📝 [NOEL Handler] Adicionando mensagem do usuário ao thread...')
  try {
    await openai.beta.threads.messages.create(currentThreadId, {
      role: 'user',
      content: message,
    })
    console.log('✅ [NOEL Handler] Mensagem adicionada ao thread')
  } catch (messageError: any) {
    console.error('❌ [NOEL Handler] Erro ao adicionar mensagem:', messageError.message)
    throw messageError
  }

  // Executar run do assistant
  console.log('🚀 [NOEL Handler] Criando run do assistant...')
  console.log('🚀 [NOEL Handler] Thread ID:', currentThreadId)
  console.log('🚀 [NOEL Handler] Assistant ID:', ASSISTANT_ID)
  
  let run
  try {
    // Garantir que currentThreadId é string antes de criar run
    if (!currentThreadId || typeof currentThreadId !== 'string') {
      throw new Error(`Thread ID inválido antes de criar run: ${currentThreadId} (tipo: ${typeof currentThreadId})`)
    }
    
    console.log('🚀 [NOEL Handler] Criando run com threadId:', currentThreadId, '(tipo:', typeof currentThreadId, ')')
    
    run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: ASSISTANT_ID,
    })
    
    console.log('✅ [NOEL Handler] Run criado com sucesso')
    console.log('✅ [NOEL Handler] Run ID:', run?.id)
    console.log('✅ [NOEL Handler] Run ID tipo:', typeof run?.id)
    console.log('✅ [NOEL Handler] Run thread_id:', run?.thread_id)
    
    if (!run || !run.id) {
      throw new Error('Run criado mas sem ID válido')
    }
    
    // Verificar se o run tem thread_id e se corresponde
    if (run.thread_id && run.thread_id !== currentThreadId) {
      console.warn('⚠️ [NOEL Handler] Run thread_id diferente do currentThreadId!')
      console.warn('⚠️ [NOEL Handler] Run thread_id:', run.thread_id)
      console.warn('⚠️ [NOEL Handler] currentThreadId:', currentThreadId)
      // Usar o thread_id do run se disponível
      currentThreadId = run.thread_id
    }
  } catch (createError: any) {
    console.error('❌ [NOEL Handler] Erro ao criar run:', createError.message)
    console.error('❌ [NOEL Handler] Tipo do erro:', createError.constructor.name)
    console.error('❌ [NOEL Handler] Status code:', createError.status)
    console.error('❌ [NOEL Handler] Assistant ID usado:', ASSISTANT_ID)
    console.error('❌ [NOEL Handler] Thread ID usado:', currentThreadId)
    throw createError
  }

  // Polling para aguardar conclusão (com suporte a function calls)
  // VALIDAÇÃO CRÍTICA: Garantir que currentThreadId e run.id existem
  if (!currentThreadId) {
    const errorMsg = 'Thread ID está undefined após criar run'
    console.error('❌ [NOEL Handler]', errorMsg)
    console.error('❌ [NOEL Handler] Run criado:', run ? 'Sim' : 'Não')
    console.error('❌ [NOEL Handler] Run ID:', run?.id || 'undefined')
    throw new Error(errorMsg)
  }
  
  if (!run || !run.id) {
    const errorMsg = 'Run ID está undefined após criar run'
    console.error('❌ [NOEL Handler]', errorMsg)
    console.error('❌ [NOEL Handler] Thread ID:', currentThreadId)
    throw new Error(errorMsg)
  }
  
  console.log('🔍 [NOEL Handler] Buscando status do run...')
  console.log('🔍 [NOEL Handler] Thread ID:', currentThreadId)
  console.log('🔍 [NOEL Handler] Run ID:', run.id)
  
  let runStatus
  try {
    // A API espera: runs.retrieve(threadId, runId)
    // IMPORTANTE: A SDK do OpenAI pode estar esperando os parâmetros de forma diferente
    // Verificar se currentThreadId ainda está definido (pode ter sido perdido)
    if (!currentThreadId) {
      throw new Error(`Thread ID está undefined! Valor anterior: ${threadId}`)
    }
    
    // Garantir que ambos são strings válidas e não undefined
    const threadIdStr = String(currentThreadId).trim()
    const runIdStr = String(run.id).trim()
    
    if (!threadIdStr || threadIdStr === 'undefined' || threadIdStr === 'null') {
      throw new Error(`Thread ID inválido após conversão: "${threadIdStr}"`)
    }
    
    if (!runIdStr || runIdStr === 'undefined' || runIdStr === 'null') {
      throw new Error(`Run ID inválido após conversão: "${runIdStr}"`)
    }
    
    console.log('🔍 [NOEL Handler] Chamando runs.retrieve com:')
    console.log('🔍 [NOEL Handler] - threadId:', threadIdStr, '(tipo:', typeof threadIdStr, ', length:', threadIdStr.length, ')')
    console.log('🔍 [NOEL Handler] - runId:', runIdStr, '(tipo:', typeof runIdStr, ', length:', runIdStr.length, ')')
    console.log('🔍 [NOEL Handler] - currentThreadId original:', currentThreadId, '(tipo:', typeof currentThreadId, ')')
    console.log('🔍 [NOEL Handler] - run.id original:', run.id, '(tipo:', typeof run.id, ')')
    
    // Chamar API
    // IMPORTANTE: A SDK do OpenAI v6 espera: runs.retrieve(runId, { thread_id: threadId })
    // NÃO: runs.retrieve(threadId, runId)
    console.log('🚀 [NOEL Handler] Executando: openai.beta.threads.runs.retrieve')
    console.log('🚀 [NOEL Handler] runId:', runIdStr)
    console.log('🚀 [NOEL Handler] thread_id (no params):', threadIdStr)
    
    runStatus = await openai.beta.threads.runs.retrieve(runIdStr, {
      thread_id: threadIdStr
    })
    console.log('✅ [NOEL Handler] Status do run obtido:', runStatus.status)
  } catch (retrieveError: any) {
    console.error('❌ [NOEL Handler] Erro ao buscar status do run:', retrieveError.message)
    console.error('❌ [NOEL Handler] Thread ID usado:', currentThreadId)
    console.error('❌ [NOEL Handler] Run ID usado:', run.id)
    console.error('❌ [NOEL Handler] Thread ID tipo:', typeof currentThreadId)
    console.error('❌ [NOEL Handler] Run ID tipo:', typeof run.id)
    throw retrieveError
  }
  const functionCalls: Array<{ name: string; arguments: any; result: any }> = []
  const maxIterations = 30 // Limite de segurança (30 segundos)
  let iterations = 0

  while ((runStatus.status === 'queued' || runStatus.status === 'in_progress' || runStatus.status === 'requires_action') && iterations < maxIterations) {
    iterations++

    // Se precisa executar functions
    if (runStatus.status === 'requires_action' && runStatus.required_action) {
      const toolCalls = runStatus.required_action.submit_tool_outputs?.tool_calls || []

      if (toolCalls.length === 0) {
        console.warn('⚠️ requires_action mas sem tool_calls')
        break
      }

      console.log(`🔧 Detectadas ${toolCalls.length} function call(s) para executar`)

      // Executar cada function
      const toolOutputs = await Promise.all(
        toolCalls.map(async (toolCall: any) => {
          const functionName = toolCall.function.name
          let functionArgs: any = {}

          try {
            functionArgs = JSON.parse(toolCall.function.arguments)
          } catch (parseError) {
            console.error(`❌ Erro ao fazer parse dos arguments:`, toolCall.function.arguments)
            functionArgs = {}
          }

          console.log(`🔧 Executando function: ${functionName}`, functionArgs)
          console.log(`🔧 Function arguments recebidos:`, JSON.stringify(functionArgs, null, 2))

          try {
            // Executar function localmente (chama /api/noel/[function])
            const result = await executeNoelFunction(functionName, functionArgs, userId)

            // Salvar para retorno
            functionCalls.push({
              name: functionName,
              arguments: functionArgs,
              result,
            })

            console.log(`✅ [NOEL Handler] Function ${functionName} executada com sucesso`)
            console.log(`✅ [NOEL Handler] Resultado:`, JSON.stringify(result, null, 2).substring(0, 500))
            
            const successOutput = { success: true, data: result }
            const outputJson = JSON.stringify(successOutput)
            
            console.log(`✅ [NOEL Handler] Output JSON (${outputJson.length} chars):`, outputJson.substring(0, 200))

            return {
              tool_call_id: toolCall.id,
              output: outputJson,
            }
          } catch (error: any) {
            console.error(`❌ Erro ao executar ${functionName}:`, error)
            console.error(`❌ Erro completo:`, JSON.stringify(error, null, 2))
            
            // Retornar erro estruturado para o Assistants API processar
            // Incluir mensagem mais detalhada se disponível
            const errorMessage = error.message || 'Erro desconhecido'
            const errorResponse = error.response?.data || {}
            
            const errorOutput = {
              success: false, 
              error: errorMessage,
              details: errorResponse,
              function: functionName,
              message: errorResponse.message || `Não foi possível buscar ${functionName}. ${errorMessage}. Tente especificar melhor o que você precisa.`
            }
            
            console.error(`❌ [NOEL Handler] Erro ao executar ${functionName}, retornando erro estruturado:`, JSON.stringify(errorOutput, null, 2))
            
            return {
              tool_call_id: toolCall.id,
              output: JSON.stringify(errorOutput),
            }
          }
        })
      )

      // Submeter resultados das functions para o Assistants API
      // IMPORTANTE: A SDK espera: submitToolOutputs(runId, { thread_id: threadId, tool_outputs: [...] })
      console.log(`📤 Enviando ${toolOutputs.length} resultado(s) para Assistants API`)
      console.log('📤 [NOEL Handler] submitToolOutputs - runId:', run.id)
      console.log('📤 [NOEL Handler] submitToolOutputs - threadId:', currentThreadId)
      
      if (!currentThreadId || typeof currentThreadId !== 'string') {
        throw new Error(`Thread ID inválido antes de submitToolOutputs: ${currentThreadId}`)
      }
      
      await openai.beta.threads.runs.submitToolOutputs(run.id, {
        thread_id: currentThreadId,
        tool_outputs: toolOutputs,
      })

      // Aguardar próxima iteração (Assistants API vai processar e continuar)
      await new Promise(resolve => setTimeout(resolve, 1500))
    } else if (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      // Aguardar um pouco antes de verificar novamente
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Verificar status novamente
    // VALIDAÇÃO: Garantir que currentThreadId ainda está definido
    if (!currentThreadId) {
      console.error('❌ [NOEL Handler] Thread ID perdido durante polling!')
      console.error('❌ [NOEL Handler] Iteração:', iterations)
      throw new Error('Thread ID perdido durante polling')
    }
    
    if (!run || !run.id) {
      console.error('❌ [NOEL Handler] Run ID perdido durante polling!')
      throw new Error('Run ID perdido durante polling')
    }
    
    // Converter para string para garantir tipo correto
    // IMPORTANTE: A SDK espera: runs.retrieve(runId, { thread_id: threadId })
    const threadIdStr = String(currentThreadId)
    const runIdStr = String(run.id)
    runStatus = await openai.beta.threads.runs.retrieve(runIdStr, {
      thread_id: threadIdStr
    })
    console.log(`📊 Status do run: ${runStatus.status}`)
  }

  // Verificar se completou com sucesso
  if (runStatus.status !== 'completed') {
    if (iterations >= maxIterations) {
      const errorMsg = `Run excedeu limite de iterações (${maxIterations}). Status final: ${runStatus.status}`
      console.error('❌ [NOEL Handler]', errorMsg)
      throw new Error(errorMsg)
    }
    
    const lastError = (runStatus as any).last_error
    let errorMsg = lastError?.message || `Run falhou com status: ${runStatus.status}`
    
    // Melhorar mensagem de erro para casos comuns
    if (runStatus.status === 'failed' && lastError) {
      if (lastError.code === 'rate_limit_exceeded') {
        errorMsg = 'Limite de requisições atingido. Aguarde alguns minutos.'
      } else if (lastError.code === 'invalid_request_error') {
        errorMsg = 'Erro na requisição. Tente reformular sua pergunta.'
      } else if (lastError.message?.includes('timeout')) {
        errorMsg = 'A requisição demorou muito. Tente novamente.'
      }
    }
    
    console.error('❌ [NOEL Handler] Run falhou:', {
      status: runStatus.status,
      error: lastError,
      message: errorMsg
    })
    throw new Error(errorMsg)
  }

  // Buscar mensagens do thread
  const messages = await openai.beta.threads.messages.list(currentThreadId, {
    limit: 1,
    order: 'desc',
  })

  const lastMessage = messages.data[0]
  const responseText = lastMessage.content
    .filter((item: any) => item.type === 'text')
    .map((item: any) => item.text.value)
    .join('\n')

  return {
    response: responseText || 'Desculpe, não consegui gerar uma resposta.',
    newThreadId: currentThreadId,
    functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
  }
}
