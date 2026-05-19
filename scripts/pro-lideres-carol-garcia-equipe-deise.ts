/**
 * Carol Garcia (Wellness) → membro Pro Líderes da Deise Faula + Noel membro.
 * Mantém assinatura wellness; vencimento equipe/Noel alinhado ao wellness.
 *
 * Uso: npx tsx scripts/pro-lideres-carol-garcia-equipe-deise.ts
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const LEADER_EMAIL = 'deisefaula@gmail.com'
const MEMBER_EMAIL = 'carolina.landim.garcia@gmail.com'
/** Mesmo vencimento do admin (print 19/05/2026) */
const ACCESS_END_YMD = '2026-12-12'

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

async function findUserIdByEmail(email: string): Promise<string> {
  const q = email.toLowerCase().trim()
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const hit = data.users.find((u) => u.email?.toLowerCase().trim() === q)
    if (hit?.id) return hit.id
    if (data.users.length < 200) break
  }
  throw new Error(`Usuário não encontrado: ${email}`)
}

async function upsertSubscription(
  userId: string,
  area: string,
  label: string,
  planType: 'monthly' | 'annual' = 'monthly'
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

async function cancelWellnessSubscription(userId: string) {
  const now = new Date().toISOString()
  const { data: subs, error } = await admin
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', userId)
    .eq('area', 'wellness')

  if (error) throw error
  if (!subs?.length) {
    console.log('  ✓ Wellness: nenhuma assinatura (já sem acesso)')
    return
  }

  for (const s of subs) {
    if (String(s.status).toLowerCase() === 'cancelled') continue
    const { error: upd } = await admin
      .from('subscriptions')
      .update({ status: 'cancelled', updated_at: now })
      .eq('id', s.id)
    if (upd) throw upd
  }
  console.log('  ✓ Wellness: acesso encerrado (só Pro Líderes)')
}

async function main() {
  console.log('Pro Líderes — Carol Garcia na equipe Deise Faula\n')

  const leaderId = await findUserIdByEmail(LEADER_EMAIL)
  const memberId = await findUserIdByEmail(MEMBER_EMAIL)
  console.log(`Líder ${LEADER_EMAIL}: ${leaderId}`)
  console.log(`Membro ${MEMBER_EMAIL}: ${memberId}`)

  const { data: prof } = await admin
    .from('user_profiles')
    .select('nome_completo, perfil')
    .eq('user_id', memberId)
    .maybeSingle()

  if (prof?.perfil && prof.perfil !== 'wellness') {
    console.log(`  ℹ️ Perfil atual: ${prof.perfil} (mantido; Wellness via assinatura)`)
  }

  await cancelWellnessSubscription(memberId)

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

  const shareSlug = slugFromName(prof?.nome_completo ?? 'carol-garcia')

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

  await upsertSubscription(memberId, NOEL_MEMBER_AREA, 'pro_lideres_noel_member (Carol)', 'monthly')

  console.log('\n✅ Pronto.')
  console.log('   Wellness: https://www.ylada.com/pt/wellness/login')
  console.log('   Pro Líderes (membro): https://www.ylada.com/pro-lideres/membro')
  console.log('   Noel membro: https://www.ylada.com/pro-lideres/membro/noel-membro')
}

main().catch((e) => {
  console.error('\n❌', e instanceof Error ? e.message : e)
  process.exit(1)
})
