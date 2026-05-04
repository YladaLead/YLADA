/**
 * GET /api/pro-lideres/equipe/links-diagnostics?days=30&member_user_id=optional
 * Só o líder do tenant. Lista ferramentas do catálogo (quiz, calculadora, diagnóstico, triagem) com:
 * - Sem member_user_id: totais de aberturas, início do fluxo, conclusão/resultado e WhatsApp no período.
 * - Com member_user_id: mesmas métricas só para eventos rastreados àquele membro (utm pl_member + pl_tenant).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { fetchProLideresCatalogLinkDiagnosticRows } from '@/lib/pro-lideres-catalog-link-diagnostics'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder vê o diagnóstico das ferramentas.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  const tenantId = ctx.tenant.id
  const ownerId = ctx.tenant.owner_user_id

  const daysRaw = request.nextUrl.searchParams.get('days')?.trim()
  const days = Math.min(365, Math.max(1, parseInt(daysRaw || '30', 10) || 30))

  const memberParam = request.nextUrl.searchParams.get('member_user_id')?.trim() || null
  let memberUserId: string | null = null
  if (memberParam) {
    if (memberParam === ownerId) {
      return NextResponse.json({ error: 'Use o painel geral para o líder.' }, { status: 400 })
    }
    const { data: memRow } = await supabaseAdmin
      .from('leader_tenant_members')
      .select('user_id')
      .eq('leader_tenant_id', tenantId)
      .eq('user_id', memberParam)
      .maybeSingle()
    if (!memRow?.user_id) {
      return NextResponse.json({ error: 'Membro não encontrado neste espaço.' }, { status: 404 })
    }
    memberUserId = memberParam
  }

  try {
    const { sinceIso, truncated, rows } = await fetchProLideresCatalogLinkDiagnosticRows(supabaseAdmin, {
      tenantId,
      ownerUserId: ownerId,
      memberUserId,
      days,
    })
    return NextResponse.json({
      days,
      sinceIso,
      memberUserId,
      truncated,
      rows,
    })
  } catch (e) {
    console.error('[links-diagnostics]', e)
    return NextResponse.json({ error: 'Erro ao carregar diagnóstico.' }, { status: 500 })
  }
}
