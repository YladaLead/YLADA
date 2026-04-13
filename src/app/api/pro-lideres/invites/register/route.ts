import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { loadValidPendingProLideresInvite } from '@/lib/pro-lideres-invite-server'
import { normalizeInviteEmail } from '@/lib/pro-lideres-invite-helpers'
import { generateAvailableUserSlug } from '@/lib/user-slug-generator'
import type { LeaderTenantInviteRow } from '@/types/leader-tenant'

/**
 * Público: cria conta com o e-mail do convite, grava nome/WhatsApp no perfil, entra na equipe e marca o convite como usado.
 */
export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: { token?: string; nome_completo?: string; whatsapp?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const token = body.token?.trim()
  const nomeCompleto = body.nome_completo?.trim() ?? ''
  const whatsapp = body.whatsapp?.trim() ?? ''
  const password = body.password ?? ''

  if (!token) {
    return NextResponse.json({ error: 'Token é obrigatório' }, { status: 400 })
  }
  if (nomeCompleto.length < 2) {
    return NextResponse.json({ error: 'Indique o nome completo.' }, { status: 400 })
  }
  if (whatsapp.length < 8) {
    return NextResponse.json({ error: 'Indique um WhatsApp válido (mín. 8 caracteres).' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
  }

  const loaded = await loadValidPendingProLideresInvite(supabaseAdmin, token)
  if (!loaded.ok) {
    const msg =
      loaded.reason === 'used'
        ? 'Este convite já foi utilizado.'
        : loaded.reason === 'expired'
          ? 'Este convite expirou.'
          : loaded.reason === 'revoked'
            ? 'Este convite foi revogado.'
            : 'Convite inválido.'
    return NextResponse.json({ error: msg }, { status: loaded.status === 404 ? 404 : 400 })
  }

  const inv = loaded.invite as LeaderTenantInviteRow
  const email = normalizeInviteEmail(inv.invited_email)

  const { data: tenant } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, owner_user_id')
    .eq('id', inv.leader_tenant_id)
    .maybeSingle()

  if (!tenant) {
    return NextResponse.json({ error: 'Espaço não encontrado.' }, { status: 404 })
  }

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: nomeCompleto,
      full_name: nomeCompleto,
      perfil: 'ylada',
    },
  })

  if (createError || !newUser.user) {
    console.error('[pro-lideres/invites/register createUser]', createError)
    const em = (createError?.message ?? '').toLowerCase()
    const dup =
      em.includes('already') ||
      em.includes('registered') ||
      em.includes('exists') ||
      createError?.status === 422
    if (dup) {
      return NextResponse.json(
        {
          error:
            'Já existe uma conta com este e-mail. Use «Entrar para aceitar» e depois confirme o convite com a sua senha.',
        },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Não foi possível criar a conta. Tente novamente.' }, { status: 500 })
  }

  const userId = newUser.user.id
  const userSlug = await generateAvailableUserSlug(nomeCompleto)

  const { error: profileError } = await supabaseAdmin.from('user_profiles').upsert(
    {
      user_id: userId,
      email,
      nome_completo: nomeCompleto,
      whatsapp: whatsapp || null,
      perfil: 'ylada',
      user_slug: userSlug || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (profileError) {
    console.error('[pro-lideres/invites/register profile]', profileError)
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: 'Não foi possível concluir o perfil. Tente novamente.' }, { status: 500 })
  }

  const { error: insErr } = await supabaseAdmin.from('leader_tenant_members').insert({
    leader_tenant_id: inv.leader_tenant_id,
    user_id: userId,
    role: 'member',
  })

  if (insErr) {
    console.error('[pro-lideres/invites/register member]', insErr)
    await supabaseAdmin.auth.admin.deleteUser(userId)
    if (insErr.code === '23505') {
      return NextResponse.json({ error: 'Este utilizador já pertence à equipe.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Não foi possível adicionar à equipe.' }, { status: 500 })
  }

  const now = new Date().toISOString()
  const { error: updErr } = await supabaseAdmin
    .from('leader_tenant_invites')
    .update({
      status: 'used',
      used_at: now,
      used_by_user_id: userId,
    })
    .eq('id', inv.id)
    .eq('status', 'pending')

  if (updErr) {
    console.error('[pro-lideres/invites/register mark used]', updErr)
  }

  return NextResponse.json({ ok: true, email })
}
