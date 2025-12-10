/**
 * NOEL Sales Support - API para Suporte na Página de Vendas
 * 
 * Endpoint: POST /api/wellness/noel/sales-support
 * 
 * Versão limitada do NOEL apenas para suporte técnico e vendas
 * - NÃO é mentor
 * - Apenas ajuda com: acesso, pagamento, problemas técnicos
 * - Não requer autenticação (público)
 * - Arquiva perguntas não respondidas para aprendizado
 * - Notifica admin quando não sabe responder
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabase'
import { notifyAdminNoelUnanswered } from '@/lib/noel-sales-support-notifications'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SUPPORT_EMAIL = 'ylada.app@gmail.com'
const SUPPORT_WHATSAPP = 'https://wa.me/5519996049800'

const SALES_SUPPORT_SYSTEM_PROMPT = `
Você é NOEL, assistente de suporte do Wellness System YLADA.

IMPORTANTE: Você está em MODO SUPORTE/VENDAS - NÃO é mentor.

Sua função é APENAS:
- Ajudar com problemas de acesso ao sistema
- Esclarecer dúvidas sobre planos e pagamentos
- Orientar sobre como fazer o pagamento
- Resolver problemas técnicos de login/acesso
- Explicar como acessar após o pagamento

VOCÊ NÃO DEVE:
- Dar mentoria sobre vendas ou negócios
- Sugerir estratégias de marketing
- Falar sobre scripts ou fluxos de vendas
- Dar conselhos sobre como vender ou recrutar
- Discutir métodos de crescimento de equipe

Se alguém perguntar sobre mentoria, vendas ou estratégias, responda:
"Para questões sobre mentoria e estratégias de negócio, você precisa estar logado no sistema. Após fazer seu pagamento e acessar o Wellness System, o NOEL Mentor estará disponível para te ajudar com essas questões."

QUANDO NÃO SOUBER RESPONDER:
Se você não souber responder uma pergunta ou não tiver certeza, SEMPRE inclua no final da sua resposta:
"Se ainda tiver dúvidas, entre em contato com nosso suporte: ${SUPPORT_EMAIL} ou WhatsApp: ${SUPPORT_WHATSAPP}"

Mantenha respostas curtas, diretas e focadas apenas em suporte técnico e vendas.
Seja amigável, mas profissional.
`

/**
 * Detecta se o NOEL não soube responder adequadamente
 */
function detectUnanswered(response: string, question: string): boolean {
  const lowerResponse = response.toLowerCase()
  const lowerQuestion = question.toLowerCase()

  // Palavras-chave que indicam que não soube responder
  const unsureKeywords = [
    'não sei',
    'não tenho certeza',
    'não consigo ajudar',
    'recomendo que você entre em contato',
    'sugiro entrar em contato',
    'entre em contato com nosso suporte',
    'contate nosso suporte',
    'não tenho essa informação',
    'não posso ajudar com isso',
  ]

  // Verificar se resposta contém palavras-chave de incerteza
  const hasUnsureKeyword = unsureKeywords.some(keyword => lowerResponse.includes(keyword))

  // Verificar se resposta é muito genérica
  const genericResponses = [
    'desculpe',
    'não consegui',
    'tente novamente',
    'por favor, tente',
  ]
  const isTooGeneric = genericResponses.some(phrase => lowerResponse.includes(phrase)) && response.length < 100

  // Verificar se menciona contato com suporte (indica que não soube)
  const mentionsSupport = lowerResponse.includes('suporte') || lowerResponse.includes('contato')

  return hasUnsureKeyword || (isTooGeneric && mentionsSupport)
}

interface SalesSupportRequest {
  message: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  userEmail?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SalesSupportRequest = await request.json()
    const { message, conversationHistory = [], userEmail } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Limitar tamanho da mensagem
    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Mensagem muito longa. Por favor, seja mais direto.' },
        { status: 400 }
      )
    }

    // Construir histórico de conversa
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SALES_SUPPORT_SYSTEM_PROMPT,
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
      })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      {
        role: 'user',
        content: message,
      },
    ]

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500, // Limitar resposta para manter foco
    })

    const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem. Por favor, tente novamente.'

    // Detectar se NOEL não soube responder
    const unanswered = detectUnanswered(response, message)

    // Salvar interação no banco (sempre, para aprendizado)
    try {
      if (supabaseAdmin) {
        // Usar tabela específica para sales-support que permite user_id NULL
        const interactionData: any = {
          user_id: null, // Público, sem autenticação
          user_email: userEmail || null,
          user_message: message.substring(0, 5000), // Limitar tamanho
          noel_response: response.substring(0, 10000), // Limitar tamanho
          module: 'sales-support',
          source: 'sales-support',
          needs_learning: unanswered,
          unanswered: unanswered,
          conversation_history: conversationHistory.length > 0 ? conversationHistory : null,
        }

        try {
          await supabaseAdmin
            .from('noel_sales_support_interactions')
            .insert(interactionData)
          
          console.log('[NOEL Sales Support] ✅ Interação salva no banco')
        } catch (insertError: any) {
          // Se tabela não existir ainda, apenas logar (não crítico)
          console.warn('[NOEL Sales Support] Tabela noel_sales_support_interactions não existe ainda:', insertError.message)
        }
      }
    } catch (saveError) {
      console.error('[NOEL Sales Support] Erro ao salvar interação:', saveError)
      // Não falhar a requisição se não conseguir salvar
    }

    // Se não soube responder, notificar admin
    if (unanswered) {
      try {
        await notifyAdminNoelUnanswered({
          question: message,
          response: response,
          userEmail: userEmail,
          timestamp: new Date(),
          conversationHistory: conversationHistory,
        })
      } catch (notifyError) {
        console.error('[NOEL Sales Support] Erro ao notificar admin:', notifyError)
        // Não falhar a requisição se não conseguir notificar
      }
    }

    return NextResponse.json({
      success: true,
      response,
      mode: 'sales-support',
      unanswered: unanswered,
      supportContact: {
        email: SUPPORT_EMAIL,
        whatsapp: SUPPORT_WHATSAPP,
      },
    })
  } catch (error: any) {
    console.error('Erro no suporte de vendas:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar sua mensagem. Por favor, tente novamente.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
