/**
 * LYA Assistant Handler
 * 
 * Gerencia a integração com OpenAI Assistants API para a LYA
 * Processa function calls e executa as functions localmente
 * 
 * FLUXO:
 * 1. Recebe mensagem do usuário
 * 2. Envia para Assistants API
 * 3. Detecta function_call
 * 4. Executa function no backend (/api/nutri/lya/[function])
 * 5. Retorna resultado para Assistants API
 * 6. Recebe resposta final
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Assistant ID padrão (mentoria interna)
// Aceita tanto OPENAI_ASSISTANT_LYA_ID quanto LYA_PROMPT_ID (para compatibilidade)
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_LYA_ID || process.env.OPENAI_ASSISTANT_ID || process.env.LYA_PROMPT_ID

// Assistant ID para vendas (landing page)
const ASSISTANT_SALES_ID = process.env.OPENAI_ASSISTANT_LYA_SALES_ID

/**
 * Executa uma function da LYA localmente
 */
async function executeLyaFunction(functionName: string, arguments_: any, userId: string): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const secret = process.env.OPENAI_FUNCTION_SECRET

  try {
    let url = ''
    let body: any = {}

    switch (functionName) {
      case 'getUserProfile':
        url = `${baseUrl}/api/nutri/lya/getUserProfile`
        body = { user_id: userId }
        break

      case 'saveInteraction':
        url = `${baseUrl}/api/nutri/lya/saveInteraction`
        body = {
          user_id: userId,
          user_message: arguments_.user_message,
          lya_response: arguments_.lya_response,
        }
        break

      case 'getNutriContext':
        url = `${baseUrl}/api/nutri/lya/getNutriContext`
        body = { user_id: userId }
        break

      case 'getFlowInfo':
        url = `${baseUrl}/api/nutri/lya/getFlowInfo`
        body = {
          flow_id: arguments_.flow_id || null,
          flow_name: arguments_.flow_name || null
        }
        break

      case 'getResourceInfo':
        url = `${baseUrl}/api/nutri/lya/getResourceInfo`
        body = {
          resource_type: arguments_.resource_type || null,
          resource_id: arguments_.resource_id || null
        }
        break

      // 🆕 FUNÇÕES DE FORMULÁRIOS
      case 'criarFormulario':
        url = `${baseUrl}/api/nutri/lya/criarFormulario`
        body = {
          user_id: userId,
          descricao_solicitada: arguments_.descricao_solicitada
        }
        break

      case 'resumirRespostas':
        url = `${baseUrl}/api/nutri/lya/resumirRespostas`
        body = {
          user_id: userId,
          response_id: arguments_.response_id || null,
          form_id: arguments_.form_id || null,
          client_id: arguments_.client_id || null
        }
        break

      case 'identificarPadroes':
        url = `${baseUrl}/api/nutri/lya/identificarPadroes`
        body = {
          user_id: userId,
          form_id: arguments_.form_id || null,
          form_type: arguments_.form_type || null,
          period_days: arguments_.period_days || 30
        }
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
      console.error(`❌ [executeLyaFunction] Erro HTTP ${response.status} para ${functionName}:`, errorData)
      
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
export async function processMessageWithLya(
  message: string,
  userId: string,
  threadId?: string,
  useSalesMode: boolean = false
): Promise<{
  response: string
  newThreadId: string
  functionCalls?: Array<{ name: string; arguments: any; result: any }>
}> {
  // Escolher Assistant ID baseado no modo
  // Se estiver em modo vendas e tiver ID específico, usa ele. Senão, usa fallback para ID geral
  const currentAssistantId = useSalesMode && ASSISTANT_SALES_ID 
    ? ASSISTANT_SALES_ID 
    : ASSISTANT_ID

  console.log('🔍 [LYA Handler] Verificando ASSISTANT_ID...')
  console.log('🔍 [LYA Handler] Modo solicitado:', useSalesMode ? 'VENDAS' : 'MENTORIA')
  console.log('🔍 [LYA Handler] ASSISTANT_SALES_ID disponível:', ASSISTANT_SALES_ID ? '✅ Sim' : '❌ Não')
  console.log('🔍 [LYA Handler] ASSISTANT_ID disponível:', ASSISTANT_ID ? '✅ Sim' : '❌ Não')
  console.log('🔍 [LYA Handler] ASSISTANT_ID escolhido:', currentAssistantId ? '✅ Configurado' : '❌ NÃO CONFIGURADO')
  
  if (!currentAssistantId) {
    const errorMsg = 'Nenhum Assistant ID configurado. Configure OPENAI_ASSISTANT_LYA_SALES_ID ou OPENAI_ASSISTANT_LYA_ID.'
    console.error('❌ [LYA Handler]', errorMsg)
    throw new Error(errorMsg)
  }
  
  console.log('✅ [LYA Handler] ASSISTANT_ID válido:', currentAssistantId.substring(0, 20) + '...')

  let currentThreadId: string | undefined = threadId

  // Criar thread se não existir
  if (!currentThreadId) {
    console.log('🆕 [LYA Handler] Criando novo thread...')
    try {
      const thread = await openai.beta.threads.create()
      currentThreadId = thread.id
      console.log('✅ [LYA Handler] Thread criado:', currentThreadId)
      
      if (!currentThreadId) {
        throw new Error('Thread criado mas sem ID válido')
      }
    } catch (threadError: any) {
      console.error('❌ [LYA Handler] Erro ao criar thread:', threadError.message)
      throw threadError
    }
  } else {
    console.log('♻️ [LYA Handler] Usando thread existente:', currentThreadId)
  }

  // Adicionar mensagem do usuário
  console.log('📝 [LYA Handler] Adicionando mensagem do usuário ao thread...')
  try {
    await openai.beta.threads.messages.create(currentThreadId, {
      role: 'user',
      content: message,
    })
    console.log('✅ [LYA Handler] Mensagem adicionada ao thread')
  } catch (messageError: any) {
    console.error('❌ [LYA Handler] Erro ao adicionar mensagem:', messageError.message)
    throw messageError
  }

  // Executar run do assistant
  console.log('🚀 [LYA Handler] Criando run do assistant...')
  console.log('🚀 [LYA Handler] Thread ID:', currentThreadId)
  console.log('🚀 [LYA Handler] Assistant ID:', currentAssistantId)
  
  let run
  try {
    if (!currentThreadId || typeof currentThreadId !== 'string') {
      throw new Error(`Thread ID inválido antes de criar run: ${currentThreadId}`)
    }
    
    run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: currentAssistantId,
    })
    
    console.log('✅ [LYA Handler] Run criado com sucesso')
    console.log('✅ [LYA Handler] Run ID:', run?.id)
    
    if (!run || !run.id) {
      throw new Error('Run criado mas sem ID válido')
    }
    
    if (run.thread_id && run.thread_id !== currentThreadId) {
      console.warn('⚠️ [LYA Handler] Run thread_id diferente do currentThreadId!')
      currentThreadId = run.thread_id
    }
  } catch (createError: any) {
    console.error('❌ [LYA Handler] Erro ao criar run:', createError.message)
    throw createError
  }

  // Polling para aguardar conclusão (com suporte a function calls)
  if (!currentThreadId) {
    throw new Error('Thread ID está undefined após criar run')
  }
  
  if (!run || !run.id) {
    throw new Error('Run ID está undefined após criar run')
  }
  
  console.log('🔍 [LYA Handler] Buscando status do run...')
  
  let runStatus
  try {
    const threadIdStr = String(currentThreadId).trim()
    const runIdStr = String(run.id).trim()
    
    if (!threadIdStr || threadIdStr === 'undefined' || threadIdStr === 'null') {
      throw new Error(`Thread ID inválido após conversão: "${threadIdStr}"`)
    }
    
    if (!runIdStr || runIdStr === 'undefined' || runIdStr === 'null') {
      throw new Error(`Run ID inválido após conversão: "${runIdStr}"`)
    }
    
    runStatus = await openai.beta.threads.runs.retrieve(runIdStr, {
      thread_id: threadIdStr
    })
    console.log('✅ [LYA Handler] Status do run obtido:', runStatus.status)
  } catch (retrieveError: any) {
    console.error('❌ [LYA Handler] Erro ao buscar status do run:', retrieveError.message)
    throw retrieveError
  }
  
  const functionCalls: Array<{ name: string; arguments: any; result: any }> = []
  const maxIterations = 30
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

          try {
            const result = await executeLyaFunction(functionName, functionArgs, userId)

            functionCalls.push({
              name: functionName,
              arguments: functionArgs,
              result,
            })

            console.log(`✅ [LYA Handler] Function ${functionName} executada com sucesso`)
            
            const successOutput = { success: true, data: result }
            const outputJson = JSON.stringify(successOutput)
            
            return {
              tool_call_id: toolCall.id,
              output: outputJson,
            }
          } catch (error: any) {
            console.error(`❌ Erro ao executar ${functionName}:`, error)
            
            const errorMessage = error.message || 'Erro desconhecido'
            const errorResponse = error.response?.data || {}
            
            const errorOutput = {
              success: false, 
              error: errorMessage,
              details: errorResponse,
              function: functionName,
              message: errorResponse.message || `Não foi possível buscar ${functionName}. ${errorMessage}.`
            }
            
            return {
              tool_call_id: toolCall.id,
              output: JSON.stringify(errorOutput),
            }
          }
        })
      )

      // Submeter resultados das functions para o Assistants API
      console.log(`📤 Enviando ${toolOutputs.length} resultado(s) para Assistants API`)
      
      if (!currentThreadId || typeof currentThreadId !== 'string') {
        throw new Error(`Thread ID inválido antes de submitToolOutputs: ${currentThreadId}`)
      }
      
      await openai.beta.threads.runs.submitToolOutputs(run.id, {
        thread_id: currentThreadId,
        tool_outputs: toolOutputs,
      })

      await new Promise(resolve => setTimeout(resolve, 1500))
    } else if (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Verificar status novamente
    if (!currentThreadId) {
      throw new Error('Thread ID perdido durante polling')
    }
    
    if (!run || !run.id) {
      throw new Error('Run ID perdido durante polling')
    }
    
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
      console.error('❌ [LYA Handler]', errorMsg)
      throw new Error(errorMsg)
    }
    
    const lastError = (runStatus as any).last_error
    let errorMsg = lastError?.message || `Run falhou com status: ${runStatus.status}`
    
    if (runStatus.status === 'failed' && lastError) {
      if (lastError.code === 'rate_limit_exceeded') {
        errorMsg = 'Limite de requisições atingido. Aguarde alguns minutos.'
      } else if (lastError.code === 'invalid_request_error') {
        errorMsg = 'Erro na requisição. Tente reformular sua pergunta.'
      } else if (lastError.message?.includes('timeout')) {
        errorMsg = 'A requisição demorou muito. Tente novamente.'
      }
    }
    
    console.error('❌ [LYA Handler] Run falhou:', {
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
