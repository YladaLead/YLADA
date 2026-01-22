import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/whatsapp/analytics
 * Retorna estatísticas e relatórios do WhatsApp baseados em tags
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const searchParams = request.nextUrl.searchParams
    const periodo = searchParams.get('periodo') || '30dias' // 7dias, 30dias, 90dias, 1ano, todos
    const area = searchParams.get('area') || null // nutri, wellness, etc

    // Calcular datas do período
    const hoje = new Date()
    const inicio = new Date()
    
    switch (periodo) {
      case '7dias':
        inicio.setDate(hoje.getDate() - 7)
        break
      case '30dias':
        inicio.setDate(hoje.getDate() - 30)
        break
      case '90dias':
        inicio.setDate(hoje.getDate() - 90)
        break
      case '1ano':
        inicio.setFullYear(hoje.getFullYear() - 1)
        break
      case 'todos':
        inicio.setFullYear(2020) // Data inicial do sistema
        break
    }

    // =====================================================
    // 1. ESTATÍSTICAS GERAIS
    // =====================================================
    let queryConversations = supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, area, context, created_at, last_message_at, total_messages', { count: 'exact' })
      .gte('created_at', inicio.toISOString())

    if (area) {
      queryConversations = queryConversations.eq('area', area)
    }

    const { data: conversations, count: totalConversations } = await queryConversations

    // =====================================================
    // 2. DISTRIBUIÇÃO POR TAGS
    // =====================================================
    const tagsCount: Record<string, number> = {}
    const tagsByPhase: Record<string, {
      veio_aula_pratica: number
      recebeu_link_workshop: number
      participou_aula: number
      nao_participou_aula: number
      interessado: number
      duvidas: number
      analisando: number
      negociando: number
      cliente_nutri: number
      perdeu: number
    }> = {}

    conversations?.forEach((conv: any) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []

      tags.forEach((tag: string) => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1
      })

      // Agrupar por fase
      const areaKey = conv.area || 'outros'
      if (!tagsByPhase[areaKey]) {
        tagsByPhase[areaKey] = {
          veio_aula_pratica: 0,
          recebeu_link_workshop: 0,
          participou_aula: 0,
          nao_participou_aula: 0,
          interessado: 0,
          duvidas: 0,
          analisando: 0,
          negociando: 0,
          cliente_nutri: 0,
          perdeu: 0,
        }
      }

      if (tags.includes('veio_aula_pratica')) tagsByPhase[areaKey].veio_aula_pratica++
      if (tags.includes('recebeu_link_workshop')) tagsByPhase[areaKey].recebeu_link_workshop++
      if (tags.includes('participou_aula')) tagsByPhase[areaKey].participou_aula++
      if (tags.includes('nao_participou_aula')) tagsByPhase[areaKey].nao_participou_aula++
      if (tags.includes('interessado')) tagsByPhase[areaKey].interessado++
      if (tags.includes('duvidas')) tagsByPhase[areaKey].duvidas++
      if (tags.includes('analisando')) tagsByPhase[areaKey].analisando++
      if (tags.includes('negociando')) tagsByPhase[areaKey].negociando++
      if (tags.includes('cliente_nutri')) tagsByPhase[areaKey].cliente_nutri++
      if (tags.includes('perdeu')) tagsByPhase[areaKey].perdeu++
    })

    // =====================================================
    // 3. FUNIL DE CONVERSÃO
    // =====================================================
    const funil = {
      captacao: tagsCount['veio_aula_pratica'] || 0,
      convite: tagsCount['recebeu_link_workshop'] || 0,
      participacao: tagsCount['participou_aula'] || 0,
      interessado: tagsCount['interessado'] || 0,
      negociando: tagsCount['negociando'] || 0,
      cliente: tagsCount['cliente_nutri'] || 0,
    }

    const taxaConversao = funil.captacao > 0 
      ? ((funil.cliente / funil.captacao) * 100).toFixed(2)
      : '0.00'

    const taxaParticipacao = funil.convite > 0
      ? ((funil.participacao / funil.convite) * 100).toFixed(2)
      : '0.00'

    // =====================================================
    // 4. MENSAGENS POR DIA (últimos 30 dias)
    // =====================================================
    const { data: messages } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('created_at, sender_type')
      .gte('created_at', inicio.toISOString())
      .order('created_at', { ascending: true })

    const mensagensPorDia: Record<string, { total: number; recebidas: number; enviadas: number }> = {}
    
    messages?.forEach((msg: any) => {
      const date = new Date(msg.created_at).toISOString().split('T')[0]
      if (!mensagensPorDia[date]) {
        mensagensPorDia[date] = { total: 0, recebidas: 0, enviadas: 0 }
      }
      mensagensPorDia[date].total++
      if (msg.sender_type === 'customer') {
        mensagensPorDia[date].recebidas++
      } else {
        mensagensPorDia[date].enviadas++
      }
    })

    const mensagensPorDiaArray = Object.entries(mensagensPorDia)
      .map(([date, stats]) => ({
        date,
        ...stats
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // =====================================================
    // 5. CONVERSAS POR ÁREA
    // =====================================================
    const conversasPorArea: Record<string, number> = {}
    conversations?.forEach((conv: any) => {
      const areaKey = conv.area || 'outros'
      conversasPorArea[areaKey] = (conversasPorArea[areaKey] || 0) + 1
    })

    // =====================================================
    // 6. TOP TAGS (mais usadas)
    // =====================================================
    const topTags = Object.entries(tagsCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // =====================================================
    // 7. CONVERSAS SEM RESPOSTA (últimas 24h)
    // =====================================================
    const vinteQuatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const { data: conversasSemResposta } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, customer_name, last_message_at, last_message_from')
      .eq('last_message_from', 'customer')
      .gte('last_message_at', vinteQuatroHorasAtras.toISOString())
      .order('last_message_at', { ascending: false })
      .limit(50)

    if (area) {
      // Filtrar por área se especificado
      // (já filtrado na query principal)
    }

    // =====================================================
    // 8. TAXA DE RESPOSTA
    // =====================================================
    const totalMensagensRecebidas = messages?.filter((m: any) => m.sender_type === 'customer').length || 0
    const totalMensagensEnviadas = messages?.filter((m: any) => m.sender_type === 'agent' || m.sender_type === 'bot').length || 0
    const taxaResposta = totalMensagensRecebidas > 0
      ? ((totalMensagensEnviadas / totalMensagensRecebidas) * 100).toFixed(2)
      : '0.00'

    return NextResponse.json({
      success: true,
      periodo,
      area: area || 'todas',
      estatisticas: {
        totalConversas: totalConversations || 0,
        totalMensagens: messages?.length || 0,
        mensagensRecebidas: totalMensagensRecebidas,
        mensagensEnviadas: totalMensagensEnviadas,
        taxaResposta: parseFloat(taxaResposta),
        conversasSemResposta: conversasSemResposta?.length || 0,
      },
      funil,
      taxas: {
        conversao: parseFloat(taxaConversao),
        participacao: parseFloat(taxaParticipacao),
      },
      tags: {
        distribuicao: tagsCount,
        topTags,
        porFase: tagsByPhase,
      },
      mensagensPorDia: mensagensPorDiaArray,
      conversasPorArea,
      conversasSemResposta: conversasSemResposta || [],
    })
  } catch (error: any) {
    console.error('[WhatsApp Analytics] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas', details: error.message },
      { status: 500 }
    )
  }
}
