/**
 * GET /api/pro-lideres/post-login-destination?next=/pro-lideres/painel/...
 * Após login: devolve o URL correto para líder (`/painel`) vs equipa (`/membro`), mapeando `next` quando necessário.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  getProLideresPainelLeaderCapabilities,
  resolveProLideresTenantContext,
} from '@/lib/pro-lideres-server'
import {
  PRO_LIDERES_BASE_PATH,
  PRO_LIDERES_MEMBER_BASE_PATH,
  mapProLideresPathToLeaderArea,
  mapProLideresPathToMemberArea,
} from '@/config/pro-lideres-menu'

function isProLideresWorkspacePath(p: string): boolean {
  const n = p.replace(/\/+$/, '') || '/'
  return (
    n === PRO_LIDERES_BASE_PATH ||
    n.startsWith(`${PRO_LIDERES_BASE_PATH}/`) ||
    n === PRO_LIDERES_MEMBER_BASE_PATH ||
    n.startsWith(`${PRO_LIDERES_MEMBER_BASE_PATH}/`)
  )
}

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

  const caps = await getProLideresPainelLeaderCapabilities(
    supabaseAdmin,
    user.id,
    ctx.tenant,
    ctx.role
  )

  const nextRaw = request.nextUrl.searchParams.get('next')?.trim() || ''
  const defaultLeader = PRO_LIDERES_BASE_PATH
  const defaultMember = PRO_LIDERES_MEMBER_BASE_PATH

  let redirectTo: string
  if (nextRaw.startsWith('/pro-lideres') && isProLideresWorkspacePath(nextRaw)) {
    if (caps.canManageAsLeader) {
      redirectTo = nextRaw.startsWith(PRO_LIDERES_MEMBER_BASE_PATH)
        ? mapProLideresPathToLeaderArea(nextRaw)
        : nextRaw
    } else {
      redirectTo = nextRaw.startsWith(PRO_LIDERES_BASE_PATH)
        ? mapProLideresPathToMemberArea(nextRaw)
        : nextRaw
    }
  } else {
    redirectTo = caps.canManageAsLeader ? defaultLeader : defaultMember
  }

  return NextResponse.json({
    redirectTo,
    canManageAsLeader: caps.canManageAsLeader,
  })
}
