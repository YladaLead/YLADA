/**
 * GET /api/admin/whatsapp/automation/debug
 * Diagnóstico - Verifica por que não há mensagens sendo agendadas
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const trintaDiasAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // 1. Verificar workshop_inscricoes (últimos 7 dias)
    const { data: inscricoes, error: inscError } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('id, nome, telefone, status, created_at')
      .gte('created_at', seteDiasAtras)
      .order('created_at', { ascending: false })
      .limit(10)

    // 1b. Verificar workshop_inscricoes (últimos 30 dias - para comparação)
    const { data: inscricoes30d, error: insc30Error } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('id, nome, telefone, status, created_at')
      .gte('created_at', trintaDiasAtras)
      .order('created_at', { ascending: false })
      .limit(10)

    // 1c. Verificar total de workshop_inscricoes
    const { count: totalInscricoes } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('*', { count: 'exact', head: true })

    // 2. Verificar leads (últimos 7 dias)
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('id, nome, telefone, source, created_at')
      .or('source.eq.workshop_agenda_instavel_landing_page,source.ilike.%workshop%')
      .gte('created_at', seteDiasAtras)
      .order('created_at', { ascending: false })
      .limit(10)

    // 2b. Verificar leads (últimos 30 dias - para comparação)
    const { data: leads30d, error: leads30Error } = await supabaseAdmin
      .from('leads')
      .select('id, nome, telefone, source, created_at')
      .or('source.eq.workshop_agenda_instavel_landing_page,source.ilike.%workshop%')
      .gte('created_at', trintaDiasAtras)
      .order('created_at', { ascending: false })
      .limit(10)

    // 3. Verificar conversas existentes
    const { data: conversations, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, area')
      .eq('area', 'nutri')
      .eq('status', 'active')
      .limit(10)

    // 4. Verificar mensagens agendadas
    const { data: scheduled, error: schedError } = await supabaseAdmin
      .from('whatsapp_scheduled_messages')
      .select('id, message_type, status, scheduled_for, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      success: true,
      diagnostic: {
        workshop_inscricoes: {
          count_7d: inscricoes?.length || 0,
          count_30d: inscricoes30d?.length || 0,
          total: totalInscricoes || 0,
          with_phone: inscricoes?.filter((i: any) => i.telefone).length || 0,
          with_status_inscrito: inscricoes?.filter((i: any) => i.status === 'inscrito').length || 0,
          sample: inscricoes?.slice(0, 3) || [],
          error: inscError?.message,
        },
        leads: {
          count_7d: leads?.length || 0,
          count_30d: leads30d?.length || 0,
          with_phone: leads?.filter((l: any) => l.telefone).length || 0,
          sample: leads?.slice(0, 3) || [],
          error: leadsError?.message,
        },
        conversations: {
          count: conversations?.length || 0,
          sample: conversations?.slice(0, 3) || [],
          error: convError?.message,
        },
        scheduled_messages: {
          count: scheduled?.length || 0,
          pending: scheduled?.filter((s: any) => s.status === 'pending').length || 0,
          sent: scheduled?.filter((s: any) => s.status === 'sent').length || 0,
          sample: scheduled?.slice(0, 5) || [],
          error: schedError?.message,
        },
        date_range: {
          sete_dias_atras: seteDiasAtras,
          agora: new Date().toISOString(),
        },
      },
    })
  } catch (error: any) {
    console.error('[Debug] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer diagnóstico', details: error.message },
      { status: 500 }
    )
  }
}
