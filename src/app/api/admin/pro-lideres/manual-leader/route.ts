import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { requireApiAuth } from '@/lib/api-auth'
import {
  applyCompletedLeaderOnboardingForEmail,
  normalizeLeaderOnboardingEmail,
} from '@/lib/pro-lideres-leader-onboarding'
import { newLeaderTenantInsertPayload, resolvedUserEmail } from '@/lib/pro-lideres-server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateAvailableUserSlug } from '@/lib/user-slug-generator'

function requestOrigin(request: NextRequest): string {
  try {
    return new URL(request.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://www.ylada.com'
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidPassword(p: string): boolean {
  return p.length >= 8 && p.length <= 128
}

/** Procura utilizador por e-mail (várias páginas; uso interno admin). */
async function findAuthUserByEmail(admin: SupabaseClient, emailLower: string): Promise<User | null> {
  const target = emailLower.toLowerCase()
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error || !data?.users?.length) break
    const u = data.users.find((x) => x.email?.toLowerCase() === target)
    if (u) return u
    if (data.users.length < 1000) break
  }
  return null
}

/**
 * Admin: cria ou atualiza utilizador Auth, perfil YLADA, tenant Pro Líderes (dono) e devolve URL + credenciais para repassar ao líder.
 */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: { email?: string; password?: string; leaderName?: string; segmentCode?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const emailRaw = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')
  const leaderName = String(body.leaderName ?? '').trim().slice(0, 160)
  const segmentCode = String(body.segmentCode ?? 'h-lider').trim() || 'h-lider'

  if (!EMAIL_RE.test(emailRaw) || emailRaw.length < 5) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }
  if (!isValidPassword(password)) {
    return NextResponse.json({ error: 'Senha: mínimo 8 caracteres.' }, { status: 400 })
  }
  if (leaderName.length < 2) {
    return NextResponse.json({ error: 'Nome do líder (mínimo 2 caracteres).' }, { status: 400 })
  }

  const normalizedEmail = normalizeLeaderOnboardingEmail(emailRaw)

  let user: User
  let createdNewAuthUser = false

  const existingUser = await findAuthUserByEmail(supabaseAdmin, normalizedEmail)
  if (existingUser) {
    user = existingUser
    const { error: upErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...(user.user_metadata ?? {}),
        full_name: leaderName,
        name: leaderName,
        perfil: 'ylada',
      },
    })
    if (upErr) {
      console.error('[admin/pro-lideres/manual-leader] updateUser', upErr)
      return NextResponse.json({ error: upErr.message || 'Erro ao atualizar senha.' }, { status: 400 })
    }
    const refreshed = await supabaseAdmin.auth.admin.getUserById(user.id)
    if (refreshed.data?.user) user = refreshed.data.user
  } else {
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: leaderName,
        name: leaderName,
        perfil: 'ylada',
      },
    })
    if (createError || !newUser.user) {
      console.error('[admin/pro-lideres/manual-leader] createUser', createError)
      const em = (createError?.message ?? '').toLowerCase()
      if (em.includes('already') || em.includes('registered') || createError?.status === 422) {
        return NextResponse.json({ error: 'Este e-mail já está registado. Tente outro fluxo ou use outro e-mail.' }, { status: 409 })
      }
      return NextResponse.json({ error: createError?.message || 'Erro ao criar utilizador.' }, { status: 500 })
    }
    user = newUser.user
    createdNewAuthUser = true
  }

  const userId = user.id
  const userSlug = await generateAvailableUserSlug(leaderName)

  const { error: profileError } = await supabaseAdmin.from('user_profiles').upsert(
    {
      user_id: userId,
      email: normalizedEmail,
      nome_completo: leaderName,
      perfil: 'ylada',
      user_slug: userSlug || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (profileError) {
    console.error('[admin/pro-lideres/manual-leader] user_profiles', profileError)
    if (createdNewAuthUser) {
      await supabaseAdmin.auth.admin.deleteUser(userId)
    }
    return NextResponse.json({ error: 'Erro ao guardar perfil YLADA.' }, { status: 500 })
  }

  const { data: existingTenant, error: tenantFetchErr } = await supabaseAdmin
    .from('leader_tenants')
    .select('id')
    .eq('owner_user_id', userId)
    .maybeSingle()

  if (tenantFetchErr) {
    console.error('[admin/pro-lideres/manual-leader] tenant fetch', tenantFetchErr)
    return NextResponse.json({ error: 'Erro ao verificar tenant.' }, { status: 500 })
  }

  let tenantId: string
  let tenantExisted = false

  if (existingTenant?.id) {
    tenantId = existingTenant.id
    tenantExisted = true
    await supabaseAdmin
      .from('leader_tenants')
      .update({
        display_name: leaderName,
        contact_email: normalizedEmail,
        vertical_code: segmentCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
      .eq('owner_user_id', userId)
  } else {
    const base = newLeaderTenantInsertPayload(user)
    const insertPayload = {
      ...base,
      display_name: leaderName,
      contact_email: resolvedUserEmail(user) ?? normalizedEmail,
      vertical_code: segmentCode,
    }
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from('leader_tenants')
      .insert(insertPayload)
      .select('id')
      .single()

    if (insErr || !inserted) {
      console.error('[admin/pro-lideres/manual-leader] leader_tenants insert', insErr)
      if (createdNewAuthUser) {
        await supabaseAdmin.auth.admin.deleteUser(userId)
      }
      return NextResponse.json({ error: insErr?.message || 'Erro ao criar espaço Pro Líderes.' }, { status: 500 })
    }
    tenantId = inserted.id as string
  }

  await applyCompletedLeaderOnboardingForEmail({
    supabase: supabaseAdmin,
    email: normalizedEmail,
    ownerUserId: userId,
    tenantId,
  })

  const origin = requestOrigin(request)
  const loginUrl = `${origin}/pro-lideres/entrar`

  return NextResponse.json({
    ok: true,
    created_new_auth_user: createdNewAuthUser,
    tenant_existed: tenantExisted,
    user_id: userId,
    email: normalizedEmail,
    password,
    login_url: loginUrl,
    message:
      'Conta e espaço Pro Líderes prontos. Envie ao líder o link de entrada, o e-mail e a senha (recomende trocar a senha após o primeiro login).',
  })
}
