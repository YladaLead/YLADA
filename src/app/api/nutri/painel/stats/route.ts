import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar indicadores do dia para o painel diário
 * Retorna: leads do dia, conversas ativas, atendimentos agendados
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const authenticatedUserId = user.id

    // Data de hoje (início e fim do dia)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const inicioDia = hoje.toISOString()
    
    const fimDia = new Date(hoje)
    fimDia.setHours(23, 59, 59, 999)
    const fimDiaISO = fimDia.toISOString()

    // Início e fim do mês (para conversas este mês)
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0, 0, 0, 0).toISOString()
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()

    // Buscar leads do dia
    const { data: leadsHoje, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('user_id', authenticatedUserId)
      .gte('created_at', inicioDia)
      .lte('created_at', fimDiaISO)

    if (leadsError) {
      console.error('Erro ao buscar leads do dia:', leadsError)
    }

    // Buscar clientes com status que indicam conversas ativas (lead, pre_consulta, ativa)
    const { data: conversasAtivas, error: conversasError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('user_id', authenticatedUserId)
      .in('status', ['lead', 'pre_consulta', 'ativa'])

    if (conversasError) {
      console.error('Erro ao buscar conversas ativas:', conversasError)
    }

    // Buscar atendimentos agendados (clientes com next_appointment no futuro)
    const { data: atendimentosAgendados, error: atendimentosError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('user_id', authenticatedUserId)
      .not('next_appointment', 'is', null)
      .gte('next_appointment', inicioDia)

    if (atendimentosError) {
      console.error('Erro ao buscar atendimentos agendados:', atendimentosError)
    }

    // Leads criados este mês (fallback quando link_events não existir)
    const { data: leadsEsteMes, error: leadsMesError } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('user_id', authenticatedUserId)
      .gte('created_at', inicioMes)
      .lte('created_at', fimMes)

    if (leadsMesError) {
      console.error('Erro ao buscar leads do mês:', leadsMesError)
    }

    // Conversas este mês: priorizar contagem unificada (whatsapp_click + lead_capture em link_events)
    let conversasEsteMes = leadsEsteMes?.length ?? 0
    const { data: linkEventsMes, error: linkEventsMesError } = await supabaseAdmin
      .from('link_events')
      .select('id')
      .eq('user_id', authenticatedUserId)
      .eq('area', 'nutri')
      .in('event_type', ['whatsapp_click', 'lead_capture'])
      .gte('created_at', inicioMes)
      .lte('created_at', fimMes)

    if (!linkEventsMesError && linkEventsMes) {
      conversasEsteMes = linkEventsMes.length
    }

    // Conversas esta semana (para Noel e meta semanal: X/meta)
    const diasDesdeSegunda = (hoje.getDay() + 6) % 7
    const inicioSemana = new Date(hoje)
    inicioSemana.setDate(hoje.getDate() - diasDesdeSegunda)
    inicioSemana.setHours(0, 0, 0, 0)
    const fimSemana = new Date(inicioSemana)
    fimSemana.setDate(inicioSemana.getDate() + 6)
    fimSemana.setHours(23, 59, 59, 999)
    const inicioSemanaISO = inicioSemana.toISOString()
    const fimSemanaISO = fimSemana.toISOString()

    let conversasEstaSemana = 0
    const { data: linkEventsSemana, error: linkEventsSemanaError } = await supabaseAdmin
      .from('link_events')
      .select('id')
      .eq('user_id', authenticatedUserId)
      .eq('area', 'nutri')
      .in('event_type', ['whatsapp_click', 'lead_capture'])
      .gte('created_at', inicioSemanaISO)
      .lte('created_at', fimSemanaISO)

    if (!linkEventsSemanaError && linkEventsSemana) {
      conversasEstaSemana = linkEventsSemana.length
    } else {
      // Fallback: leads criados na semana (quando link_events não existir ou falhar)
      const { data: leadsEstaSemana } = await supabaseAdmin
        .from('leads')
        .select('id')
        .eq('user_id', authenticatedUserId)
        .gte('created_at', inicioSemanaISO)
        .lte('created_at', fimSemanaISO)
      conversasEstaSemana = leadsEstaSemana?.length ?? 0
    }

    // Meta semanal configurável (user_profiles.meta_conversas_semana); default 5
    let metaSemanal = 5
    try {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('meta_conversas_semana')
        .eq('user_id', authenticatedUserId)
        .maybeSingle()
      if (profile?.meta_conversas_semana != null && profile.meta_conversas_semana >= 1 && profile.meta_conversas_semana <= 50) {
        metaSemanal = profile.meta_conversas_semana
      }
    } catch {
      // Coluna pode não existir ainda (migration não aplicada)
    }

    return NextResponse.json({
      success: true,
      data: {
        leadsHoje: leadsHoje?.length || 0,
        conversasAtivas: conversasAtivas?.length || 0,
        atendimentosAgendados: atendimentosAgendados?.length || 0,
        conversasEsteMes,
        conversasEstaSemana,
        metaSemanal
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar stats do painel:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar indicadores',
        ...(process.env.NODE_ENV === 'development' && {
          technical: error.message
        })
      },
      { status: 500 }
    )
  }
}










