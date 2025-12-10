/**
 * NOEL Sales Support - API para Suporte na Página de Vendas
 * 
 * Endpoint: POST /api/wellness/noel/sales-support
 * 
 * Versão limitada do NOEL apenas para suporte técnico e vendas
 * - NÃO é mentor
 * - Apenas ajuda com: acesso, pagamento, problemas técnicos
 * - Não requer autenticação (público)
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

Mantenha respostas curtas, diretas e focadas apenas em suporte técnico e vendas.
Seja amigável, mas profissional.
`

interface SalesSupportRequest {
  message: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

export async function POST(request: NextRequest) {
  try {
    const body: SalesSupportRequest = await request.json()
    const { message, conversationHistory = [] } = body

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

    return NextResponse.json({
      success: true,
      response,
      mode: 'sales-support',
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
