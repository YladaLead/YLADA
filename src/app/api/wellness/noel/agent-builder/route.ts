/**
 * NOEL WELLNESS - Agent Builder Integration
 * 
 * Endpoint: POST /api/wellness/noel/agent-builder
 * 
 * Usa o Agent Builder da OpenAI para processar mensagens do NOEL
 * 
 * NOTA: A API de Agents pode não estar disponível em todas as contas ainda.
 * Se não funcionar, use ChatKit (Opção A) ou o fallback híbrido.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface AgentBuilderRequest {
  message: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

interface AgentBuilderResponse {
  response: string
  workflowId?: string
  runId?: string
  source: 'agent_builder'
  error?: string
}

/**
 * Processa mensagem usando Agent Builder (Workflow)
 * 
 * Tenta diferentes métodos dependendo da disponibilidade da API
 */
export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) return authResult

    const body: AgentBuilderRequest = await request.json()
    const { message } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Verificar se Workflow ID está configurado
    const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID || 
                       process.env.OPENAI_WORKFLOW_ID

    if (!workflowId) {
      console.error('❌ Workflow ID não configurado')
      return NextResponse.json(
        { 
          error: 'Agent Builder não configurado',
          details: 'NEXT_PUBLIC_CHATKIT_WORKFLOW_ID ou OPENAI_WORKFLOW_ID não encontrado',
          solution: 'Adicione o Workflow ID no .env.local'
        },
        { status: 500 }
      )
    }

    console.log('🤖 NOEL Agent Builder - Processando mensagem:', {
      workflowId,
      messageLength: message.length,
    })

    // Tentar diferentes métodos de chamada da API
    let response = ''
    let runId: string | undefined

    try {
      // MÉTODO 1: Tentar Agents SDK (se disponível)
      // Nota: A API pode variar dependendo da versão do SDK
      if ((openai as any).agents?.workflowRuns) {
        console.log('📡 Tentando Agents SDK...')
        const run = await (openai as any).agents.workflowRuns.createAndPoll(
          workflowId,
          {
            input: message,
          }
        )

        runId = run.id

        if (run.status === 'completed' && run.output) {
          if (typeof run.output === 'string') {
            response = run.output
          } else if (run.output && typeof run.output === 'object') {
            response = (run.output as any).response || 
                      (run.output as any).message || 
                      (run.output as any).text ||
                      JSON.stringify(run.output)
          }
        } else if (run.status === 'failed') {
          throw new Error(`Workflow falhou: ${JSON.stringify(run)}`)
        }
      } 
      // MÉTODO 2: Tentar via Chat Completions com system prompt do Agent
      // (Fallback se Agents SDK não estiver disponível)
      else {
        console.log('📡 Agents SDK não disponível, usando Chat Completions com prompt do Agent...')
        
        // Nota: Este é um fallback - o ideal é usar Agents SDK ou ChatKit
        // Por enquanto, retornamos erro para forçar uso do ChatKit ou fallback híbrido
        throw new Error('Agents SDK não disponível. Use ChatKit ou configure o Agent Builder corretamente.')
      }

      if (!response || response.trim().length === 0) {
        throw new Error('Workflow não retornou resposta válida')
      }

      console.log('✅ NOEL Agent Builder - Resposta recebida:', {
        runId,
        responseLength: response.length,
      })

      const result: AgentBuilderResponse = {
        response,
        workflowId,
        runId,
        source: 'agent_builder',
      }

      return NextResponse.json(result)

    } catch (agentError: any) {
      console.error('❌ Erro ao chamar Agent Builder:', agentError)
      
      // Retornar erro claro para o frontend
      return NextResponse.json(
        {
          error: 'Agent Builder não disponível',
          details: agentError.message || 'A API de Agents pode não estar disponível na sua conta OpenAI.',
          solution: 'Use ChatKit (Opção A) ou configure o Agent Builder corretamente.',
          workflowId,
          fallback: 'Use a rota /api/wellness/noel para fallback híbrido'
        },
        { status: 503 }
      )
    }

  } catch (error: any) {
    console.error('❌ Erro no NOEL Agent Builder:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar mensagem',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
