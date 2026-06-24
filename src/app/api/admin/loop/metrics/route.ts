/**
 * GET /api/admin/loop/metrics?days=30 — métricas do loop / k-factor (Fase B).
 * Só admin. Lê user_referrals + ylada_behavioral_events + ylada_links (via service role).
 * Espelha o Loop_KFactor_FaseB_Queries.sql em chamadas supabase-js (sem RPC novo).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

type LeaderRow = { referrer_user_id: string; indicados: number; ativados: number; via_diagnostico: number; via_conteudo: number }

function sinceIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0
  return Math.round((numerator / denominator) * 1000) / 1000
}

async function countReferrals(field: 'signed_up_at' | 'activated_at', since: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('user_referrals')
    .select('id', { count: 'exact', head: true })
    .gte(field, since)
  return count ?? 0
}

async function countEvent(eventType: string, since: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('ylada_behavioral_events')
    .select('id', { count: 'exact', head: true })
    .eq('event_type', eventType)
    .gte('created_at', since)
  return count ?? 0
}

/** Usuários ativos no período = distintos que criaram >=1 link (proxy de atividade). */
async function countActiveUsers(since: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('ylada_links')
    .select('user_id')
    .gte('created_at', since)
    .limit(10000)
  const ids = new Set((data ?? []).map((r) => (r as { user_id?: string }).user_id).filter(Boolean))
  return ids.size
}

async function buildLeaderboard(since: string): Promise<LeaderRow[]> {
  const { data } = await supabaseAdmin
    .from('user_referrals')
    .select('referrer_user_id, activated_at, source')
    .gte('created_at', since)
    .limit(10000)
  const byReferrer = new Map<string, LeaderRow>()
  for (const raw of data ?? []) {
    const row = raw as { referrer_user_id: string; activated_at: string | null; source: string | null }
    const acc = byReferrer.get(row.referrer_user_id) ?? {
      referrer_user_id: row.referrer_user_id,
      indicados: 0,
      ativados: 0,
      via_diagnostico: 0,
      via_conteudo: 0,
    }
    acc.indicados += 1
    if (row.activated_at) acc.ativados += 1
    if (row.source === 'diagnostico') acc.via_diagnostico += 1
    if (row.source === 'conteudo') acc.via_conteudo += 1
    byReferrer.set(row.referrer_user_id, acc)
  }
  return [...byReferrer.values()]
    .sort((a, b) => b.ativados - a.ativados || b.indicados - a.indicados)
    .slice(0, 20)
}

async function countTotal(filter?: 'activated'): Promise<number> {
  let q = supabaseAdmin.from('user_referrals').select('id', { count: 'exact', head: true })
  if (filter === 'activated') q = q.not('activated_at', 'is', null)
  const { count } = await q
  return count ?? 0
}

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  if (!auth.profile?.is_admin) {
    return NextResponse.json({ error: 'Apenas administradores' }, { status: 403 })
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Backend não configurado' }, { status: 503 })
  }

  const daysRaw = Number(new URL(request.url).searchParams.get('days'))
  const days = Number.isFinite(daysRaw) && daysRaw > 0 && daysRaw <= 365 ? Math.floor(daysRaw) : 30
  const since = sinceIso(days)

  try {
    const [activeUsers, signups, activated, landingViews, signupEvents, activatedEvents, leaderboard, codesTotal, referralsTotal, activatedTotal] =
      await Promise.all([
        countActiveUsers(since),
        countReferrals('signed_up_at', since),
        countReferrals('activated_at', since),
        countEvent('referral_landing_view', since),
        countEvent('referral_signup', since),
        countEvent('referral_activated', since),
        buildLeaderboard(since),
        supabaseAdmin.from('referral_codes').select('user_id', { count: 'exact', head: true }).then((r) => r.count ?? 0),
        countTotal(),
        countTotal('activated'),
      ])

    return NextResponse.json({
      window_days: days,
      kfactor: {
        usuarios_ativos: activeUsers,
        indicados_cadastrados: signups,
        indicados_ativados: activated,
        k_cadastro: ratio(signups, activeUsers),
        k_honesto: ratio(activated, activeUsers),
      },
      funil: {
        landing_views: landingViews,
        signups: signupEvents,
        ativacoes: activatedEvents,
        landing_para_cadastro: ratio(signupEvents, landingViews),
        cadastro_para_ativacao: ratio(activatedEvents, signupEvents),
      },
      leaderboard,
      saude: { codigos_gerados: codesTotal, indicacoes_total: referralsTotal, indicacoes_ativadas: activatedTotal },
    })
  } catch (e) {
    console.error('[admin/loop/metrics]', e)
    return NextResponse.json({ error: 'Erro ao calcular métricas' }, { status: 500 })
  }
}
