import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/trials/list
 * Lista todos os trials ativos e expirados
 * 
 * Query params:
 * - status: 'active' | 'expired' | 'all' (default: 'all')
 * - trial_group: 'geral' | 'presidentes' | 'all' (default: 'all')
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação (apenas admin)
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { profile } = authResult

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Apenas administradores podem ver trials' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') || 'all' // 'active', 'expired', 'all'
    const groupFilter = searchParams.get('trial_group') || 'all' // 'geral', 'presidentes', 'all'

    // Buscar todas as subscriptions de trial
    // Compatível com bancos que ainda não aceitam plan_type='trial':
    // também considera registros com stripe_subscription_id começando com 'trial_' (mesmo que plan_type seja 'free').
    let query = supabaseAdmin
      .from('subscriptions')
      .select('id, user_id, area, plan_type, status, current_period_start, current_period_end, created_at, stripe_subscription_id')
      .or("plan_type.eq.trial,stripe_subscription_id.like.trial_%")
      .eq('area', 'wellness')
      .order('created_at', { ascending: false })

    // Aplicar filtro de status
    if (statusFilter === 'active') {
      query = query
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
    } else if (statusFilter === 'expired') {
      query = query.or('status.neq.active,current_period_end.lt.' + new Date().toISOString())
    }

    const { data: subscriptions, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar trials:', error)
      throw error
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        trials: [],
        stats: {
          total: 0,
          ativos: 0,
          expirados: 0,
          gerais: 0,
          presidentes: 0,
        },
      })
    }

    // Buscar perfis dos usuários
    const userIds = subscriptions.map((s: any) => s.user_id)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, email, nome_completo, whatsapp')
      .in('user_id', userIds)

    if (profilesError) {
      console.error('❌ Erro ao buscar perfis:', profilesError)
      throw profilesError
    }

    // Criar mapa de user_id -> profile
    const profileMap = new Map<string, any>()
    ;(profiles || []).forEach((profile: any) => {
      profileMap.set(profile.user_id, profile)
    })

    // Buscar trial_invites para obter trial_group e nome do presidente
    const { data: invites } = await supabaseAdmin
      .from('trial_invites')
      .select('used_by_user_id, trial_group, nome_presidente')
      .in('used_by_user_id', userIds)
      .eq('status', 'used')

    // Criar mapas
    const trialGroupMap = new Map<string, string>()
    const presidenteMap = new Map<string, string>()
    ;(invites || []).forEach((invite: any) => {
      if (invite.used_by_user_id) {
        if (invite.trial_group) {
          trialGroupMap.set(invite.used_by_user_id, invite.trial_group)
        }
        if (invite.nome_presidente) {
          presidenteMap.set(invite.used_by_user_id, invite.nome_presidente)
        }
      }
    })

    // Processar dados e calcular dias restantes
    const trials = subscriptions.map((sub: any) => {
      const profile = profileMap.get(sub.user_id)
      const periodEnd = new Date(sub.current_period_end)
      const now = new Date()
      const diasRestantes = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const isActive = sub.status === 'active' && periodEnd > now

      // Buscar trial_group e nome do presidente do mapa
      const trialGroup = trialGroupMap.get(sub.user_id) || 'geral'
      const nomePresidente = presidenteMap.get(sub.user_id) || null

      return {
        id: sub.id,
        user_id: sub.user_id,
        nome_completo: profile?.nome_completo || 'N/A',
        email: profile?.email || 'N/A',
        whatsapp: profile?.whatsapp || 'N/A',
        status: isActive ? 'active' : 'expired',
        dias_restantes: isActive ? Math.max(0, diasRestantes) : 0,
        data_inicio: sub.current_period_start,
        data_fim: sub.current_period_end,
        data_criacao: sub.created_at,
        trial_group: trialGroup as 'geral' | 'presidentes',
        nome_presidente: nomePresidente,
      }
    })

    // Aplicar filtro de grupo (se necessário)
    let filteredTrials = trials
    if (groupFilter !== 'all') {
      filteredTrials = trials.filter(t => t.trial_group === groupFilter)
    }

    // Estatísticas
    const stats = {
      total: filteredTrials.length,
      ativos: filteredTrials.filter(t => t.status === 'active').length,
      expirados: filteredTrials.filter(t => t.status === 'expired').length,
      gerais: filteredTrials.filter(t => t.trial_group === 'geral').length,
      presidentes: filteredTrials.filter(t => t.trial_group === 'presidentes').length,
    }

    return NextResponse.json({
      success: true,
      trials: filteredTrials,
      stats,
    })
  } catch (error: any) {
    console.error('❌ Erro ao listar trials:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao listar trials' },
      { status: 500 }
    )
  }
}
