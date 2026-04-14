import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveEsteticaCorporalTenantContext } from '@/lib/pro-estetica-corporal-server'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  const { id } = await context.params
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Só é possível apagar fluxos personalizados (UUID).' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o profissional pode remover fluxos personalizados.' }, { status: 403 })
  }

  const { data: removed, error } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .delete()
    .eq('id', id)
    .eq('leader_tenant_id', ctx.tenant.id)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[pro-estetica-corporal/flows DELETE]', error)
    return NextResponse.json({ error: 'Erro ao apagar' }, { status: 500 })
  }

  if (!removed) {
    return NextResponse.json({ error: 'Entrada não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
