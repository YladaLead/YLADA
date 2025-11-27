import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// POST - Enviar mensagem (usuário ou bot)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin', 'support'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { message, ticket_id } = body

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    let ticket = null

    // Se já existe ticket, buscar
    if (ticket_id) {
      const { data: ticketData, error: ticketError } = await supabaseAdmin
        .from('support_tickets')
        .select('*')
        .eq('id', ticket_id)
        .eq('user_id', user.id)
        .single()

      if (!ticketError && ticketData) {
        ticket = ticketData
      }
    }

    // Se não existe ticket, tentar responder com bot primeiro
    if (!ticket) {
      // Buscar resposta no FAQ
      const palavras = message.toLowerCase().split(/\s+/).filter(p => p.length > 2)
      
      if (palavras.length > 0) {
        // Buscar FAQs relevantes
        const { data: allFaqs } = await supabaseAdmin
          .from('faq_responses')
          .select('*')
          .eq('area', 'nutri')
          .eq('ativo', true)

        if (allFaqs && allFaqs.length > 0) {
          // Calcular relevância
          const faqsComRelevancia = allFaqs.map(faq => {
            let relevancia = 0
            
            const palavrasChave = (faq.palavras_chave || []).map((p: string) => p.toLowerCase())
            palavras.forEach(palavra => {
              if (palavrasChave.some((pk: string) => pk.includes(palavra) || palavra.includes(pk))) {
                relevancia += 3
              }
            })
            
            const tags = (faq.tags || []).map((t: string) => t.toLowerCase())
            palavras.forEach(palavra => {
              if (tags.some((tag: string) => tag.includes(palavra) || palavra.includes(tag))) {
                relevancia += 1
              }
            })
            
            if (faq.pergunta.toLowerCase().includes(message.toLowerCase())) {
              relevancia += 2
            }
            
            return { ...faq, relevancia }
          })
          
          // Pegar FAQ mais relevante
          const faqMaisRelevante = faqsComRelevancia
            .filter(faq => faq.relevancia > 0)
            .sort((a, b) => {
              if (b.relevancia !== a.relevancia) {
                return b.relevancia - a.relevancia
              }
              return (b.ordem_prioridade || 0) - (a.ordem_prioridade || 0)
            })[0]

          // Se relevância é alta o suficiente (>= 3), responder com bot
          if (faqMaisRelevante && faqMaisRelevante.relevancia >= 3) {
            // Salvar conversa com bot
            const { data: conversationData } = await supabaseAdmin
              .from('support_conversations')
              .insert({
                user_message: message,
                bot_response: faqMaisRelevante.resposta_completa,
                faq_id: faqMaisRelevante.id,
                palavras_buscadas: palavras,
                faqs_sugeridos: [faqMaisRelevante.id]
              })
              .select()
              .single()

            // Incrementar "foi_util" no FAQ
            await supabaseAdmin
              .from('faq_responses')
              .update({ foi_util: (faqMaisRelevante.foi_util || 0) + 1 })
              .eq('id', faqMaisRelevante.id)

            return NextResponse.json({
              success: true,
              bot_response: {
                faq_id: faqMaisRelevante.id,
                resposta: faqMaisRelevante.resposta_completa,
                resposta_resumida: faqMaisRelevante.resposta_resumida,
                video_url: faqMaisRelevante.video_url,
                pdf_url: faqMaisRelevante.pdf_url,
                thumbnail_url: faqMaisRelevante.thumbnail_url,
                relevancia: faqMaisRelevante.relevancia
              },
              ticket_created: false,
              menu_options: [
                '✅ Isso resolveu minha dúvida',
                '❌ Não resolveu, preciso de mais ajuda',
                '📋 Ver outras opções',
                '👤 Falar com atendente humano'
              ]
            })
          }
        }
      }

      // Se bot não encontrou resposta relevante, criar ticket
      const { data: newTicket, error: ticketError } = await supabaseAdmin
        .from('support_tickets')
        .insert({
          area: 'nutri',
          user_id: user.id,
          status: 'aguardando',
          categoria: 'outras',
          assunto: message.substring(0, 100),
          primeira_mensagem: message,
          ultima_mensagem: message,
          ultima_mensagem_em: new Date().toISOString(),
          mensagens_count: 1
        })
        .select()
        .single()

      if (ticketError) {
        console.error('Erro ao criar ticket:', ticketError)
        return NextResponse.json(
          { error: 'Erro ao criar ticket de suporte' },
          { status: 500 }
        )
      }

      // Salvar primeira mensagem
      await supabaseAdmin
        .from('support_messages')
        .insert({
          ticket_id: newTicket.id,
          sender_type: 'user',
          sender_id: user.id,
          sender_name: user.email?.split('@')[0] || 'Usuário',
          message: message,
          is_bot_response: false
        })

      // Salvar conversa (bot não encontrou)
      await supabaseAdmin
        .from('support_conversations')
        .insert({
          ticket_id: newTicket.id,
          user_message: message,
          bot_response: null,
          palavras_buscadas: palavras,
          bot_resolveu: false
        })

      return NextResponse.json({
        success: true,
        bot_response: null,
        ticket_created: true,
        ticket_id: newTicket.id,
        message: 'Não encontrei uma resposta específica. Um atendente entrará em contato em breve.',
        menu_options: [
          '📋 Ver menu de categorias',
          '👤 Falar com atendente humano'
        ]
      })
    } else {
      // Ticket já existe - adicionar mensagem ao ticket
      const { data: messageData, error: messageError } = await supabaseAdmin
        .from('support_messages')
        .insert({
          ticket_id: ticket.id,
          sender_type: 'user',
          sender_id: user.id,
          sender_name: user.email?.split('@')[0] || 'Usuário',
          message: message,
          is_bot_response: false
        })
        .select()
        .single()

      if (messageError) {
        console.error('Erro ao salvar mensagem:', messageError)
        return NextResponse.json(
          { error: 'Erro ao salvar mensagem' },
          { status: 500 }
        )
      }

      // Atualizar ticket
      await supabaseAdmin
        .from('support_tickets')
        .update({
          ultima_mensagem: message,
          ultima_mensagem_em: new Date().toISOString(),
          mensagens_count: (ticket.mensagens_count || 0) + 1
        })
        .eq('id', ticket.id)

      return NextResponse.json({
        success: true,
        message: messageData,
        ticket_id: ticket.id
      })
    }
  } catch (error: any) {
    console.error('Erro ao processar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}

// GET - Buscar histórico de conversa
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin', 'support'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const ticket_id = searchParams.get('ticket_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!ticket_id) {
      return NextResponse.json(
        { error: 'ticket_id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se usuário tem acesso ao ticket
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', ticket_id)
      .eq('user_id', user.id)
      .single()

    if (ticketError || !ticket) {
      // Verificar se é atendente
      const { data: agent } = await supabaseAdmin
        .from('support_agents')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!agent) {
        return NextResponse.json(
          { error: 'Ticket não encontrado ou sem permissão' },
          { status: 403 }
        )
      }
    }

    // Buscar mensagens
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticket_id)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (messagesError) {
      console.error('Erro ao buscar mensagens:', messagesError)
      return NextResponse.json(
        { error: 'Erro ao buscar mensagens' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messages: messages || []
    })
  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico' },
      { status: 500 }
    )
  }
}

