/**
 * Vinícius Miguel → membro Pro Líderes da Deise Faula + Noel membro (1 ano).
 *
 * Uso: npx tsx scripts/pro-lideres-vinicius-miguel-equipe-deise.ts
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const LEADER_EMAIL = 'deisefaula@gmail.com'
const MEMBER_EMAIL = 'hello@viniciusmiguel.me'
const MEMBER_NAME = 'Vinícius Miguel'
const SENHA_FIXA = 'Vinícius123'

function accessEndYmdOneYear(): string {
  const d = new Date()
  d.setUTCFullYear(d.getUTCFullYear() + 1)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const ACCESS_END_YMD = accessEndYmdOneYear()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const NOEL_MEMBER_AREA = 'pro_lideres_noel_member'
const PERIOD_END_ISO = `${ACCESS_END_YMD}T23:59:59.999Z`

function slugFromName(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return base.slice(0, 40) || 'membro'
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const q = email.toLowerCase().trim()
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const hit = data.users.find((u) => u.email?.toLowerCase().trim() === q)
    if (hit?.id) return hit.id
    if (data.users.length < 200) break
  }
  return null
}

async function ensureUser(): Promise<{ userId: string; created: boolean }> {
  const existingId = await findUserIdByEmail(MEMBER_EMAIL)
  if (existingId) {
    const { error } = await admin.auth.admin.updateUserById(existingId, {
      password: SENHA_FIXA,
    })
    if (error) console.warn(`  ⚠️ Não foi possível atualizar senha: ${error.message}`)
    else console.log('  ✓ Conta existente — senha atualizada')
    return { userId: existingId, created: false }
  }

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: MEMBER_EMAIL.toLowerCase(),
    password: SENHA_FIXA,
    email_confirm: true,
    user_metadata: {
      name: MEMBER_NAME,
      full_name: MEMBER_NAME,
      perfil: 'ylada',
    },
  })

  if (createError || !newUser.user) {
    throw new Error(`Criar usuário: ${createError?.message ?? 'falhou'}`)
  }

  const userId = newUser.user.id
  const { error: profileError } = await admin.from('user_profiles').upsert(
    {
      user_id: userId,
      email: MEMBER_EMAIL.toLowerCase(),
      nome_completo: MEMBER_NAME,
      perfil: 'ylada',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (profileError) {
    await admin.auth.admin.deleteUser(userId)
    throw new Error(`Perfil: ${profileError.message}`)
  }

  console.log(`  ✓ Conta criada: ${userId}`)
  return { userId, created: true }
}

async function upsertSubscription(
  userId: string,
  area: string,
  label: string,
  planType: 'monthly' | 'annual' = 'annual'
) {
  const { data: existing } = await admin
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', userId)
    .eq('area', area)
    .order('updated_at', { ascending: false })
    .limit(1)

  const now = new Date().toISOString()
  const stripeSubId = `manual_${area}_${userId.replace(/-/g, '')}_${Date.now()}`

  if (existing?.[0]?.id) {
    const { error } = await admin
      .from('subscriptions')
      .update({
        status: 'active',
        plan_type: planType,
        current_period_start: now,
        current_period_end: PERIOD_END_ISO,
        updated_at: now,
      })
      .eq('id', existing[0].id)
    if (error) throw new Error(`${label} update: ${error.message}`)
    console.log(`  ✓ ${label}: assinatura atualizada até ${ACCESS_END_YMD}`)
    return
  }

  const { error } = await admin.from('subscriptions').insert({
    user_id: userId,
    area,
    status: 'active',
    plan_type: planType,
    features: [] as string[],
    stripe_account: 'br',
    stripe_subscription_id: stripeSubId,
    stripe_customer_id: `manual_cus_${userId.replace(/-/g, '')}`,
    stripe_price_id: `manual_${area}_courtesy`,
    amount: 0,
    currency: 'brl',
    current_period_start: now,
    current_period_end: PERIOD_END_ISO,
    created_at: now,
    updated_at: now,
  })
  if (error) throw new Error(`${label} insert: ${error.message}`)
  console.log(`  ✓ ${label}: assinatura criada até ${ACCESS_END_YMD}`)
}

async function main() {
  console.log('Pro Líderes — Vinícius Miguel na equipe Deise Faula\n')
  console.log(`Acesso até: ${ACCESS_END_YMD}\n`)

  const leaderId = await findUserIdByEmail(LEADER_EMAIL)
  if (!leaderId) throw new Error(`Líder não encontrado: ${LEADER_EMAIL}`)
  console.log(`Líder ${LEADER_EMAIL}: ${leaderId}`)

  const { userId: memberId, created } = await ensureUser()
  console.log(`Membro ${MEMBER_EMAIL}: ${memberId}${created ? ' (novo)' : ''}`)

  const { data: prof } = await admin
    .from('user_profiles')
    .select('nome_completo')
    .eq('user_id', memberId)
    .maybeSingle()

  const { data: tenant, error: tErr } = await admin
    .from('leader_tenants')
    .select('id, slug, display_name, team_name, owner_user_id, noel_member_offer_enabled')
    .eq('owner_user_id', leaderId)
    .maybeSingle()

  if (tErr || !tenant) {
    throw new Error(`Tenant da líder não encontrado (${LEADER_EMAIL})`)
  }

  const tenantId = tenant.id as string
  console.log(`Tenant: ${tenant.display_name || tenant.team_name} (${tenant.slug})`)

  if (!tenant.noel_member_offer_enabled) {
    const { error } = await admin
      .from('leader_tenants')
      .update({
        noel_member_offer_enabled: true,
        noel_member_offer_scope: 'all_members',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
    if (error) throw error
    console.log('  ✓ Noel equipe: oferta ativada (all_members)')
  } else {
    console.log('  ✓ Noel equipe: oferta já ativa')
  }

  const shareSlug = slugFromName(prof?.nome_completo ?? 'vinicius-miguel')

  const { data: memRow } = await admin
    .from('leader_tenant_members')
    .select('id, team_access_state, pro_lideres_share_slug')
    .eq('leader_tenant_id', tenantId)
    .eq('user_id', memberId)
    .maybeSingle()

  if (memRow?.id) {
    const { error: memErr } = await admin
      .from('leader_tenant_members')
      .update({
        team_access_state: 'active',
        team_access_expires_at: PERIOD_END_ISO,
        pro_lideres_share_slug: memRow.pro_lideres_share_slug ?? shareSlug,
      })
      .eq('id', memRow.id)
    if (memErr) throw new Error(`member update: ${memErr.message}`)
    console.log(`  ✓ Membro já na equipe — reativado até ${ACCESS_END_YMD}`)
  } else {
    const { error: insErr } = await admin.from('leader_tenant_members').insert({
      leader_tenant_id: tenantId,
      user_id: memberId,
      role: 'member',
      team_access_state: 'active',
      team_access_expires_at: PERIOD_END_ISO,
      pro_lideres_share_slug: shareSlug,
    })
    if (insErr) throw new Error(`member insert: ${insErr.message}`)
    console.log(`  ✓ Membro adicionado à equipe (slug: ${shareSlug}) até ${ACCESS_END_YMD}`)
  }

  await upsertSubscription(memberId, NOEL_MEMBER_AREA, 'pro_lideres_noel_member (Vinícius)', 'annual')

  console.log('\n✅ Pronto.')
  console.log(`   E-mail: ${MEMBER_EMAIL}`)
  console.log(`   Senha: ${SENHA_FIXA}`)
  console.log('   Pro Líderes (membro): https://www.ylada.com/pro-lideres/membro')
  console.log('   Noel membro: https://www.ylada.com/pro-lideres/membro/noel-membro')
}

main().catch((e) => {
  console.error('\n❌', e instanceof Error ? e.message : e)
  process.exit(1)
})
