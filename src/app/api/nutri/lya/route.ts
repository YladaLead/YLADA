/**
 * LYA NUTRI - API Principal
 * 
 * Endpoint: POST /api/nutri/lya
 * 
 * Processa mensagens do usuário e retorna resposta da LYA
 * 
 * IMPORTANTE: A LYA usa APENAS Assistants API (OpenAI)
 * Baseado no DOSSIÊ LYA v1.0 como fonte única de verdade
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { processMessageWithLya } from '@/lib/lya-assistant-handler'
import type { NutriProfile, NutriState, LyaFlow, LyaCycle } from '@/types/nutri-lya'

interface LyaRequest {
  message: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  userId?: string
  threadId?: string
}

interface LyaResponse {
  response: string
  profile_detected?: NutriProfile
  state_detected?: NutriState
  flow_used?: LyaFlow
  cycle_used?: LyaCycle
  threadId?: string
  functionCalls?: Array<{ name: string; arguments: any; result: any }>
  modelUsed?: string
}

/**
 * POST /api/nutri/lya
 */
export async function POST(request: NextRequest) {
  console.log('🚀 [LYA] ==========================================')
  console.log('🚀 [LYA] ENDPOINT /api/nutri/lya CHAMADO')
  console.log('🚀 [LYA] ==========================================')
  console.log('🕐 [LYA] Timestamp:', new Date().toISOString())
  
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      console.log('❌ [LYA] Autenticação falhou')
      return authResult
    }
    const { user } = authResult
    console.log('✅ [LYA] Autenticação OK - User ID:', user.id)

    const body: LyaRequest = await request.json()
    const { message, conversationHistory = [], threadId } = body

    console.log('📥 [LYA] Body recebido:', {
      messageLength: message?.length || 0,
      hasThreadId: !!threadId,
      historyLength: conversationHistory?.length || 0
    })

    if (!message || message.trim().length === 0) {
      console.log('❌ [LYA] Mensagem vazia')
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // ============================================
    // PRIORIDADE 1: Assistants API com function calling
    // ============================================
    const assistantId = process.env.OPENAI_ASSISTANT_LYA_ID || process.env.OPENAI_ASSISTANT_ID
    
    console.log('🔍 [LYA] Verificando configuração Assistants API...')
    console.log('🔍 [LYA] OPENAI_ASSISTANT_LYA_ID:', assistantId ? '✅ Configurado' : '❌ NÃO CONFIGURADO')
    console.log('🔍 [LYA] OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Configurado' : '❌ NÃO CONFIGURADO')
    
    if (assistantId) {
      try {
        console.log('🤖 [LYA] ==========================================')
        console.log('🤖 [LYA] INICIANDO ASSISTANTS API')
        console.log('🤖 [LYA] ==========================================')
        console.log('📝 [LYA] Mensagem recebida:', message.substring(0, 100))
        console.log('👤 [LYA] User ID:', user.id)
        console.log('🧵 [LYA] Thread ID:', threadId || 'novo (será criado)')
        console.log('🆔 [LYA] Assistant ID:', assistantId)
        
        const { processMessageWithLya } = await import('@/lib/lya-assistant-handler')
        
        let assistantResult
        try {
          assistantResult = await processMessageWithLya(
            message,
            user.id,
            threadId
          )
        } catch (functionError: any) {
          console.error('❌ [LYA] Erro ao processar mensagem:', functionError)
          
          // Tentar retry
          console.warn('⚠️ [LYA] Tentando retry após erro...')
          try {
            assistantResult = await processMessageWithLya(
              message,
              user.id,
              threadId
            )
            console.log('✅ [LYA] Retry bem-sucedido após erro')
          } catch (retryError: any) {
            console.error('❌ [LYA] Retry também falhou:', retryError)
            
            let helpfulResponse = `Desculpe, tive um problema técnico ao processar sua mensagem. Mas posso te ajudar!`
            
            if (message.toLowerCase().includes('organização') || message.toLowerCase().includes('rotina')) {
              helpfulResponse = `Desculpe, tive um problema técnico. Mas posso te ajudar com organização e rotina! Você pode:\n\n- Me fazer outra pergunta sobre organização\n- Recarregar a página e tentar novamente\n\nO que você precisa agora?`
            } else {
              helpfulResponse = `Desculpe, tive um problema técnico ao processar sua mensagem. Tente novamente em alguns instantes ou reformule sua pergunta.\n\nSe o problema persistir, você pode acessar diretamente os recursos da plataforma.`
            }
            
            return NextResponse.json({
              response: helpfulResponse,
              threadId: threadId || 'new',
              modelUsed: 'gpt-4-assistant',
              error: true,
              errorMessage: retryError.message || functionError.message || 'Erro ao processar mensagem'
            })
          }
        }

        console.log('✅ [LYA] ==========================================')
        console.log('✅ [LYA] ASSISTANTS API RETORNOU RESPOSTA')
        console.log('✅ [LYA] ==========================================')
        console.log('📝 [LYA] Resposta length:', assistantResult.response.length)
        if (assistantResult.functionCalls && assistantResult.functionCalls.length > 0) {
          console.log(`🔧 [LYA] ${assistantResult.functionCalls.length} function(s) executada(s):`, 
            assistantResult.functionCalls.map(f => f.name).join(', '))
        }
        console.log('🧵 [LYA] Novo Thread ID:', assistantResult.newThreadId)

        // Salvar interação automaticamente no Supabase
        try {
          const interactionData: any = {
            user_id: user.id,
            message: message,
            response: assistantResult.response,
            thread_id: assistantResult.newThreadId,
            // Estrutura compatível
            user_message: message,
            lya_response: assistantResult.response,
          }
          
          const { error: insertError } = await supabaseAdmin
            .from('lya_interactions')
            .insert(interactionData)
          
          if (insertError) {
            console.warn('⚠️ [LYA] Erro ao salvar interação:', insertError.message)
            // Tentar estrutura alternativa
            try {
              await supabaseAdmin.from('lya_interactions').insert({
                user_id: user.id,
                user_message: message,
                lya_response: assistantResult.response,
                thread_id: assistantResult.newThreadId,
              })
            } catch (fallbackError: any) {
              console.warn('⚠️ [LYA] Erro no fallback também:', fallbackError.message)
            }
          }
          
          console.log('💾 [LYA] Interação salva no Supabase')
        } catch (logError: any) {
          console.warn('⚠️ [LYA] Erro ao salvar interação (não crítico):', logError.message)
        }

        return NextResponse.json({
          response: assistantResult.response,
          threadId: assistantResult.newThreadId,
          functionCalls: assistantResult.functionCalls,
          modelUsed: 'gpt-4-assistant',
        })
      } catch (assistantError: any) {
        console.error('❌ [LYA] ==========================================')
        console.error('❌ [LYA] ASSISTANTS API FALHOU')
        console.error('❌ [LYA] ==========================================')
        console.error('❌ [LYA] Erro:', assistantError.message)
        
        let errorMessage = 'Erro ao processar sua mensagem.'
        let errorDetails = 'A LYA não conseguiu processar sua solicitação no momento.'
        
        if (assistantError.message?.includes('timeout')) {
          errorMessage = 'A requisição demorou muito para processar.'
          errorDetails = 'Tente novamente em alguns instantes.'
        } else if (assistantError.message?.includes('rate limit')) {
          errorMessage = 'Limite de requisições atingido.'
          errorDetails = 'Aguarde alguns minutos e tente novamente.'
        } else if (assistantError.message?.includes('invalid') || assistantError.message?.includes('not found')) {
          errorMessage = 'Configuração da LYA inválida.'
          errorDetails = 'Entre em contato com o suporte técnico.'
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
      console.error('❌ [LYA] ==========================================')
      console.error('❌ [LYA] OPENAI_ASSISTANT_LYA_ID NÃO CONFIGURADO')
      console.error('❌ [LYA] ==========================================')
      
      return NextResponse.json(
        {
          error: 'LYA (Assistants API) não configurado',
          message: 'OPENAI_ASSISTANT_LYA_ID não está configurado. Configure a variável de ambiente.',
          details: 'A LYA usa apenas Assistants API. Configure OPENAI_ASSISTANT_LYA_ID corretamente.',
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ [LYA] Erro geral no endpoint:', error)
    console.error('❌ [LYA] Stack completo:', error.stack)
    
    return NextResponse.json({
      response: `Desculpe, tive um problema técnico ao processar sua mensagem. 

Mas posso te ajudar! Você pode:
- Me fazer outra pergunta e eu tento ajudar de outra forma
- Recarregar a página e tentar novamente

O que você precisa agora?`,
      threadId: 'error',
      modelUsed: 'gpt-4-assistant',
      error: true,
      errorMessage: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao processar mensagem'
    })
  }
}
