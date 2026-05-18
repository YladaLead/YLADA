/**
 * GET /api/admin/pro-lideres/tenants — lista espaços Pro Líderes (h-lider) para vincular membros no admin.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const vertical = request.nextUrl.searchParams.get('vertical')?.trim() || 'h-lider'

  const { data, error } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, display_name, team_name, contact_email, owner_user_id, vertical_code')
    .eq('vertical_code', vertical)
    .order('display_name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Erro ao listar espaços Pro Líderes.' }, { status: 500 })
  }

  const tenants = (data ?? []).map((t) => ({
    id: t.id as string,
    displayName:
      (t.display_name as string | null)?.trim() ||
      (t.team_name as string | null)?.trim() ||
      (t.contact_email as string | null)?.trim() ||
      'Sem nome',
    contactEmail: (t.contact_email as string | null)?.trim() || null,
    ownerUserId: t.owner_user_id as string,
  }))

  return NextResponse.json({ success: true, tenants })
}
