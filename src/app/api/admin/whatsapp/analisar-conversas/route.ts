import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/whatsapp/analisar-conversas
 * Analisa todas as conversas e retorna resumo por status/tags
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const area = searchParams.get('area') || 'nutri'

    // Buscar todas as conversas ativas
    const { data: conversations, error } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, created_at, last_message_at')
      .eq('area', area)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar conversas: ${error.message}` },
        { status: 500 }
      )
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({
        total: 0,
        resumo: {},
        detalhes: []
      })
    }

    // Análise detalhada
    const resumo: Record<string, number> = {
      total: conversations.length,
      sem_tags: 0,
      sem_mensagem_carol: 0,
      participou_aula: 0,
      nao_participou_aula: 0,
      agendou_aula: 0,
      nao_agendou: 0,
      veio_aula_pratica: 0,
      recebeu_link_workshop: 0,
      interessado: 0,
      duvidas: 0,
      cliente_nutri: 0,
      carol_ativa: 0,
    }

    const detalhes: Array<{
      phone: string
      name: string
      tags: string[]
      tem_mensagem_carol: boolean
      status: string
      precisa_acao: string
    }> = []

    // Verificar cada conversa
    for (const conv of conversations) {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []

      // Verificar se tem mensagem da Carol
      const { data: carolMessages } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('id')
        .eq('conversation_id', conv.id)
        .eq('sender_type', 'bot')
        .eq('sender_name', 'Carol - Secretária')
        .limit(1)
        .maybeSingle()

      const temMensagemCarol = carolMessages !== null

      // Contar tags
      if (tags.length === 0) resumo.sem_tags++
      if (!temMensagemCarol) resumo.sem_mensagem_carol++
      if (tags.includes('participou_aula')) resumo.participou_aula++
      if (tags.includes('nao_participou_aula')) resumo.nao_participou_aula++
      if (tags.includes('agendou_aula') || tags.includes('recebeu_link_workshop')) resumo.agendou_aula++
      if (tags.includes('veio_aula_pratica')) resumo.veio_aula_pratica++
      if (tags.includes('recebeu_link_workshop')) resumo.recebeu_link_workshop++
      if (tags.includes('interessado')) resumo.interessado++
      if (tags.includes('duvidas')) resumo.duvidas++
      if (tags.includes('cliente_nutri')) resumo.cliente_nutri++
      if (tags.includes('carol_ativa')) resumo.carol_ativa++

      // Determinar status e ação necessária
      const hasScheduled = tags.includes('agendou_aula') || tags.includes('recebeu_link_workshop')
      const participated = tags.includes('participou_aula')
      const naoParticipou = tags.includes('nao_participou_aula')
      const veioAulaPratica = tags.includes('veio_aula_pratica')

      let status = 'indefinido'
      let precisaAcao = ''

      if (participated) {
        status = 'participou_aula'
        // Verificar se já fechou ou foi direcionado
        const jaFechou = tags.includes('cliente_nutri')
        const jaRecebeuPosAula = tags.includes('recebeu_link_cadastro') || context.post_class_message_sent
        const jaDirecionado = context.redirected_to_support === true
        
        if (jaFechou || jaDirecionado) {
          precisaAcao = 'OK - já fechou/direcionado'
        } else if (jaRecebeuPosAula) {
          precisaAcao = 'OK - já recebeu pós-aula'
        } else {
          // Verificar se tem mensagens recentes (se você já conversou)
          const { data: recentMessages } = await supabaseAdmin
            .from('whatsapp_messages')
            .select('created_at, sender_type')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(5)
          
          const temMensagensRecentes = recentMessages && recentMessages.length > 0
          const ultimaMensagem = recentMessages?.[0]
          const ultimaMensagemEhBot = ultimaMensagem?.sender_type === 'bot'
          const diasDesdeUltimaMensagem = ultimaMensagem 
            ? (Date.now() - new Date(ultimaMensagem.created_at).getTime()) / (1000 * 60 * 60 * 24)
            : 999
          
          // Se você já conversou recentemente (última mensagem não é bot ou tem menos de 7 dias), não precisa de pós-aula
          if (temMensagensRecentes && (!ultimaMensagemEhBot || diasDesdeUltimaMensagem < 7)) {
            precisaAcao = 'OK - já conversou recentemente'
          } else {
            precisaAcao = 'Enviar mensagem pós-aula'
          }
        }
      } else if (naoParticipou) {
        status = 'nao_participou'
        // Verificar se já fechou ou foi direcionado
        const jaFechou = tags.includes('cliente_nutri')
        const jaDirecionado = context.redirected_to_support === true
        
        if (jaFechou || jaDirecionado) {
          precisaAcao = 'OK - já fechou/direcionado'
        } else {
          // Verificar se já recebeu segundo link
          const jaRecebeuSegundoLink = tags.includes('recebeu_segundo_link')
          if (jaRecebeuSegundoLink) {
            precisaAcao = 'OK - já recebeu remarketing'
          } else {
            precisaAcao = 'Enviar remarketing'
          }
        }
      } else if (hasScheduled) {
        status = 'agendou'
        precisaAcao = 'OK - aguardando aula'
      } else if (veioAulaPratica) {
        status = 'veio_mas_nao_agendou'
        if (!temMensagemCarol) {
          precisaAcao = 'Enviar boas-vindas'
        } else {
          precisaAcao = 'OK - já recebeu mensagem'
        }
      } else {
        status = 'sem_contexto'
        if (!temMensagemCarol) {
          precisaAcao = 'Enviar primeira mensagem'
        } else {
          precisaAcao = 'Revisar tags'
        }
      }

      // Contar não agendou
      if (veioAulaPratica && !hasScheduled && !participated) {
        resumo.nao_agendou++
      }

      detalhes.push({
        phone: conv.phone,
        name: conv.name || 'Sem nome',
        tags,
        tem_mensagem_carol: temMensagemCarol,
        status,
        precisa_acao: precisaAcao
      })
    }

    return NextResponse.json({
      total: conversations.length,
      resumo,
      detalhes: detalhes.slice(0, 100) // Limitar a 100 primeiras para não sobrecarregar
    })

  } catch (error: any) {
    console.error('[Analisar Conversas] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao analisar conversas' },
      { status: 500 }
    )
  }
}
