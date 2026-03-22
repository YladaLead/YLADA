import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { PERFIS_MATRIZ_YLADA } from '@/lib/admin-matriz-constants'
import {
  createYladaFreeMatrizSubscription,
  hasActiveYladaFree,
  subscriptionIsActivePaid,
} from '@/lib/admin-ylada-free-matriz'

/**
 * POST /api/admin/subscriptions/bulk-ylada-migration
 * Cria plano free matriz (migração) para perfis da matriz YLADA que ainda não têm free ylada ativo
 * e não têm mensal/anual ativo. **Não inclui Wellness** (perfil wellness não está em PERFIS_MATRIZ_YLADA).
 *
 * Body: { expires_in_days?: number (default 3650), dry_run?: boolean }
 */
export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  let body: { expires_in_days?: number; dry_run?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const dryRun = !!body.dry_run
  const days = Math.min(3650, Math.max(1, Math.floor(Number(body.expires_in_days)) || 3650))

  const { data: profiles, error: pErr } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id')
    .in('perfil', [...PERFIS_MATRIZ_YLADA])

  if (pErr) {
    console.error('bulk-ylada-migration profiles:', pErr)
    return NextResponse.json({ error: 'Erro ao listar perfis' }, { status: 500 })
  }

  const userIds = [...new Set((profiles || []).map((p) => p.user_id).filter(Boolean))] as string[]
  if (userIds.length === 0) {
    return NextResponse.json({
      success: true,
      dry_run: dryRun,
      eligible: 0,
      created: 0,
      skipped: 0,
      errors: [] as string[],
      message: 'Nenhum usuário com perfil de matriz YLADA.',
    })
  }

  type SubRow = {
    user_id: string
    area: string
    plan_type: string
    status: string
    current_period_end: string | null
  }

  const subsByUser = new Map<string, SubRow[]>()
  const chunkSize = 120
  for (let i = 0; i < userIds.length; i += chunkSize) {
    const chunk = userIds.slice(i, i + chunkSize)
    const { data: subs, error: sErr } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id, area, plan_type, status, current_period_end')
      .in('user_id', chunk)

    if (sErr) {
      console.error('bulk-ylada-migration subs:', sErr)
      return NextResponse.json({ error: 'Erro ao listar assinaturas' }, { status: 500 })
    }
    for (const s of subs || []) {
      const list = subsByUser.get(s.user_id) || []
      list.push(s as SubRow)
      subsByUser.set(s.user_id, list)
    }
  }

  const eligible: string[] = []
  for (const uid of userIds) {
    const subs = subsByUser.get(uid) || []
    if (subs.some((s) => hasActiveYladaFree(s))) continue
    if (subs.some((s) => subscriptionIsActivePaid(s))) continue
    eligible.push(uid)
  }

  if (dryRun) {
    return NextResponse.json({
      success: true,
      dry_run: true,
      expires_in_days: days,
      total_matriz_profiles: userIds.length,
      eligible: eligible.length,
      sample_user_ids: eligible.slice(0, 25),
    })
  }

  const errors: string[] = []
  let created = 0
  const parallel = 8

  for (let i = 0; i < eligible.length; i += parallel) {
    const slice = eligible.slice(i, i + parallel)
    const results = await Promise.all(
      slice.map(async (uid) => {
        const r = await createYladaFreeMatrizSubscription(uid, days, 'migration')
        if (r.error) {
          return { uid, err: r.error }
        }
        return { uid, err: null as string | null }
      })
    )
    for (const row of results) {
      if (row.err) {
        errors.push(`${row.uid}: ${row.err}`)
      } else {
        created += 1
      }
    }
  }

  return NextResponse.json({
    success: true,
    dry_run: false,
    expires_in_days: days,
    total_matriz_profiles: userIds.length,
    eligible: eligible.length,
    created,
    failed: errors.length,
    errors: errors.slice(0, 50),
  })
}
