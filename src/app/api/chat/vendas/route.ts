import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Threads por sessão (poderia usar Redis em produção)
const threads: Map<string, string> = new Map()

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Verificar se OpenAI está configurado
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        message: 'Olá! Sou a Ana, atendente da YLADA Nutri. 😊\n\nEstou aqui para te ajudar a entender como nossa plataforma pode transformar seu negócio como nutricionista.\n\n**O que você gostaria de saber?**\n\n• 📊 Como funciona a plataforma\n• 💰 Planos e preços\n• 🎯 Ferramentas de captação\n• 📈 Gestão profissional\n• 🎓 Formação Empresarial Nutri\n• ✅ Garantia e suporte\n\nPergunte-me qualquer coisa! Estou aqui para te ajudar a crescer! 🚀'
      })
    }

    // Obter ou criar thread para esta sessão
    let threadId = sessionId ? threads.get(sessionId) : undefined
    
    if (!threadId) {
      const thread = await openai.beta.threads.create()
      threadId = thread.id
      if (sessionId) {
        threads.set(sessionId, threadId)
      }
    }

    // Prompt do sistema para atendente vendedora
    const systemPrompt = `Você é a Ana, uma atendente vendedora especializada e empática da YLADA Nutri. Seu objetivo é ajudar nutricionistas a entenderem como a plataforma pode transformar seus negócios e convertê-las em clientes.

CONTEXTO DA PLATAFORMA:
- YLADA Nutri é uma plataforma completa para nutricionistas
- Oferece: Ferramentas de Captação, Gestão Profissional, Comunidade, Mentoria Semanal e Formação Empresarial Nutri
- Plano anual: R$ 2.364 (12× de R$ 197) por 1 ano completo
- Plano mensal: R$ 297/mês

SEU ESTILO:
- Empática, calorosa e profissional
- Focada em entender as dores da nutricionista
- Apresenta soluções de forma clara e objetiva
- Usa emojis moderadamente (1-2 por mensagem)
- Sempre oferece o próximo passo (CTA natural)
- Não é agressiva, mas é persuasiva

OBJETIVO:
- Identificar dores e necessidades
- Apresentar soluções relevantes
- Remover objeções
- Conduzir para o checkout (/pt/nutri/checkout)

INFORMAÇÕES IMPORTANTES:
- Plano anual: R$ 2.364 (12× de R$ 197) - inclui Formação Empresarial Nutri
- Plano mensal: R$ 297/mês
- Garantia: 7 dias incondicional
- Formação Empresarial Nutri: incluída no plano anual
- Link para checkout: /pt/nutri/checkout

RESPONDA DE FORMA:
- Conversacional e natural
- Focada em valor, não apenas em preço
- Sempre pergunte se há mais alguma dúvida
- Quando apropriado, sugira o próximo passo (ver planos, fazer checkout, etc.)

IMPORTANTE: Seja honesta, empática e focada em ajudar a nutricionista a tomar a melhor decisão para seu negócio.`

    // Adicionar mensagem do usuário
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message
    })

    // Usar assistente de vendas ou chat completion direto
    let assistantId = process.env.OPENAI_ASSISTANT_VENDAS_ID
    
    if (assistantId) {
      // Usar assistente configurado
      try {
        const run = await openai.beta.threads.runs.create(threadId, {
          assistant_id: assistantId
        })

        // Aguardar resposta
        let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
        let attempts = 0
        const maxAttempts = 30

        while ((runStatus.status === 'queued' || runStatus.status === 'in_progress') && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
          attempts++
        }

        if (runStatus.status === 'completed') {
          const messages = await openai.beta.threads.messages.list(threadId)
          const lastMessage = messages.data[0]
          
          if (lastMessage.role === 'assistant' && lastMessage.content[0].type === 'text') {
            return NextResponse.json({
              message: lastMessage.content[0].text.value,
              threadId
            })
          }
        }
      } catch (error) {
        console.error('Erro ao usar assistente:', error)
        // Continuar para fallback
      }
    }

    // Fallback: usar chat completion direto (mais simples e eficiente)
    try {
      // Buscar histórico de mensagens do thread
      const threadMessages = await openai.beta.threads.messages.list(threadId)
      const historico = threadMessages.data
        .slice(0, 10) // Últimas 10 mensagens
        .reverse()
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content[0].type === 'text' ? msg.content[0].text.value : ''
        }))
        .filter((msg: any) => msg.content)

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...historico
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const resposta = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'

      // Adicionar resposta ao thread para manter histórico
      await openai.beta.threads.messages.create(threadId, {
        role: 'assistant',
        content: resposta
      })

      return NextResponse.json({
        message: resposta,
        threadId
      })
    } catch (error) {
      console.error('Erro no chat completion:', error)
      throw error
    }

    // Fallback se houver erro
    return NextResponse.json({
      message: 'Olá! Sou a Ana, atendente da YLADA Nutri. 😊\n\nEstou aqui para te ajudar! Como posso te ajudar hoje?',
      threadId
    })

  } catch (error: any) {
    console.error('Erro no chat de vendas:', error)
    
    // Fallback amigável
    return NextResponse.json({
      message: 'Olá! Sou a Ana, atendente da YLADA Nutri. 😊\n\nEstou aqui para te ajudar a entender como nossa plataforma pode transformar seu negócio como nutricionista.\n\n**O que você gostaria de saber?**\n\n• 📊 Como funciona a plataforma\n• 💰 Planos e preços\n• 🎯 Ferramentas de captação\n• 📈 Gestão profissional\n• 🎓 Formação Empresarial Nutri\n• ✅ Garantia e suporte\n\nPergunte-me qualquer coisa! Estou aqui para te ajudar a crescer! 🚀',
      error: error.message
    })
  }
}

