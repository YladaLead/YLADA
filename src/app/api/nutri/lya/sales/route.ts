/**
 * LYA NUTRI - API de Vendas (Landing Page)
 * 
 * Endpoint: POST /api/nutri/lya/sales
 * 
 * Processa mensagens na landing page com foco em vendas e conversão
 * 
 * IMPORTANTE: Esta é a versão de VENDAS da LYA
 * Foco: Argumentações, objeções, conversão
 * Diferente da versão interna que foca em mentoria empresarial
 */

import { NextRequest, NextResponse } from 'next/server'
import { processMessageWithLya } from '@/lib/lya-assistant-handler'

interface LyaSalesRequest {
  message: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  threadId?: string
}

interface LyaSalesResponse {
  response: string
  threadId?: string
  functionCalls?: Array<{ name: string; arguments: any; result: any }>
  modelUsed?: string
}

/**
 * POST /api/nutri/lya/sales
 */
export async function POST(request: NextRequest) {
  console.log('🚀 [LYA Sales] ==========================================')
  console.log('🚀 [LYA Sales] ENDPOINT /api/nutri/lya/sales CHAMADO')
  console.log('🚀 [LYA Sales] ==========================================')
  
  try {
    // Para landing page, não requer autenticação obrigatória
    // Mas pode usar se disponível
    const body: LyaSalesRequest = await request.json()
    const { message, conversationHistory = [], threadId } = body

    console.log('📥 [LYA Sales] Body recebido:', {
      messageLength: message?.length || 0,
      hasThreadId: !!threadId,
      historyLength: conversationHistory?.length || 0
    })

    if (!message || message.trim().length === 0) {
      console.log('❌ [LYA Sales] Mensagem vazia')
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // ============================================
    // Assistants API com System Prompt de VENDAS
    // ============================================
    const assistantId = process.env.OPENAI_ASSISTANT_LYA_SALES_ID || process.env.OPENAI_ASSISTANT_LYA_ID || process.env.OPENAI_ASSISTANT_ID
    
    console.log('🔍 [LYA Sales] Verificando configuração Assistants API...')
    console.log('🔍 [LYA Sales] OPENAI_ASSISTANT_LYA_SALES_ID:', assistantId ? '✅ Configurado' : '❌ NÃO CONFIGURADO')
    
    if (assistantId) {
      try {
        console.log('🤖 [LYA Sales] INICIANDO ASSISTANTS API (MODO VENDAS)')
        console.log('📝 [LYA Sales] Mensagem recebida:', message.substring(0, 100))
        console.log('🧵 [LYA Sales] Thread ID:', threadId || 'novo (será criado)')
        
        // Usar handler padrão mas com contexto de vendas
        // O System Prompt do Assistant deve estar configurado para vendas
        const { processMessageWithLya } = await import('@/lib/lya-assistant-handler')
        
        // Criar userId temporário para visitantes (ou usar session se disponível)
        const tempUserId = 'sales-visitor-' + (threadId || Date.now().toString())
        
        let assistantResult
        try {
          assistantResult = await processMessageWithLya(
            message,
            tempUserId, // Usar ID temporário para visitantes
            threadId,
            true // useSalesMode = true para usar Assistant de vendas
          )
        } catch (functionError: any) {
          console.error('❌ [LYA Sales] Erro ao processar mensagem:', functionError)
          
          // Retry
          console.warn('⚠️ [LYA Sales] Tentando retry após erro...')
          try {
            assistantResult = await processMessageWithLya(
              message,
              tempUserId,
              threadId
            )
            console.log('✅ [LYA Sales] Retry bem-sucedido')
          } catch (retryError: any) {
            console.error('❌ [LYA Sales] Retry também falhou:', retryError)
            
            return NextResponse.json({
              response: `Desculpe, tive um problema técnico. Mas posso te ajudar! 

A YLADA Nutri é a plataforma completa para nutricionistas que querem crescer como Nutri-Empresárias. 

Você pode:
- Ver mais informações na página
- Entrar em contato via WhatsApp
- Tentar novamente em alguns instantes

O que você gostaria de saber sobre a plataforma?`,
              threadId: threadId || 'new',
              modelUsed: 'gpt-4-assistant',
              error: true,
              errorMessage: retryError.message || 'Erro ao processar mensagem'
            })
          }
        }

        console.log('✅ [LYA Sales] ASSISTANTS API RETORNOU RESPOSTA')
        console.log('📝 [LYA Sales] Resposta length:', assistantResult.response.length)
        console.log('🧵 [LYA Sales] Novo Thread ID:', assistantResult.newThreadId)

        // Não salvar interações de visitantes no banco (opcional)
        // Ou salvar em tabela separada para analytics

        return NextResponse.json({
          response: assistantResult.response,
          threadId: assistantResult.newThreadId,
          functionCalls: assistantResult.functionCalls,
          modelUsed: 'gpt-4-assistant',
        })
      } catch (assistantError: any) {
        console.error('❌ [LYA Sales] ASSISTANTS API FALHOU')
        console.error('❌ [LYA Sales] Erro:', assistantError.message)
        
        let errorMessage = 'Erro ao processar sua mensagem.'
        let errorDetails = 'A LYA não conseguiu processar sua solicitação no momento.'
        
        if (assistantError.message?.includes('timeout')) {
          errorMessage = 'A requisição demorou muito para processar.'
          errorDetails = 'Tente novamente em alguns instantes.'
        } else if (assistantError.message?.includes('rate limit')) {
          errorMessage = 'Limite de requisições atingido.'
          errorDetails = 'Aguarde alguns minutos e tente novamente.'
        }
        
        return NextResponse.json(
          {
            error: errorMessage,
            message: assistantError.message,
            details: errorDetails,
          },
          { status: 500 }
        )
      }
    } else {
      console.error('❌ [LYA Sales] OPENAI_ASSISTANT_LYA_SALES_ID NÃO CONFIGURADO')
      
      return NextResponse.json(
        {
          error: 'LYA Sales não configurado',
          message: 'OPENAI_ASSISTANT_LYA_SALES_ID não está configurado.',
          details: 'Configure a variável de ambiente ou use OPENAI_ASSISTANT_LYA_ID.',
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ [LYA Sales] Erro geral no endpoint:', error)
    
    return NextResponse.json({
      response: `Desculpe, tive um problema técnico. 

Mas posso te ajudar! A YLADA Nutri é a plataforma completa para nutricionistas que querem crescer como Nutri-Empresárias.

Você pode:
- Ver mais informações na página
- Entrar em contato via WhatsApp
- Tentar novamente em alguns instantes

O que você gostaria de saber?`,
      threadId: 'error',
      modelUsed: 'gpt-4-assistant',
      error: true,
      errorMessage: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao processar mensagem'
    })
  }
}
