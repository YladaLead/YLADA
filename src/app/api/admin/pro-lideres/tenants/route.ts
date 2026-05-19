/**
 * GET /api/admin/pro-lideres/tenants — líderes Pro Líderes com assinatura equipe ativa (para vincular membros).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { fetchPaidProLideresLeaderTenants } from '@/lib/admin-pro-lideres-leader-tenants'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const vertical = request.nextUrl.searchParams.get('vertical')?.trim() || 'h-lider'
  const tenants = await fetchPaidProLideresLeaderTenants(supabaseAdmin, vertical)

  return NextResponse.json({ success: true, tenants })
}
