/**
 * Donarosa59 + Rosana Sperandio (Wellness) → Pro Líderes equipe Deise Faula + Noel membro.
 * Mantém o vencimento atual de cada uma (wellness).
 *
 * Uso: npx tsx scripts/pro-lideres-transfer-donarosa-rosana-equipe-deise.ts
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const LEADER_EMAIL = 'deisefaula@gmail.com'

const MEMBERS: Array<{ email: string; accessEndYmd: string; slugFallback: string }> = [
  { email: 'donarosa59@hotmail.com', accessEndYmd: '2026-12-11', slugFallback: 'donarosa59' },
  { email: 'sperandio.rosanaelisa@gmail.com', accessEndYmd: '2026-11-03', slugFallback: 'rosana-sperandio' },
]

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const NOEL_MEMBER_AREA = 'pro_lideres_noel_member'

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

async function upsertSubscription(userId: string, periodEndIso: string, label: string) {
  const { data: existing } = await admin
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', userId)
    .eq('area', NOEL_MEMBER_AREA)
    .order('updated_at', { ascending: false })
    .limit(1)

  const now = new Date().toISOString()
  const stripeSubId = `manual_${NOEL_MEMBER_AREA}_${userId.replace(/-/g, '')}_${Date.now()}`

  if (existing?.[0]?.id) {
    const { error } = await admin
      .from('subscriptions')
      .update({
        status: 'active',
        plan_type: 'monthly',
        current_period_start: now,
        current_period_end: periodEndIso,
        updated_at: now,
      })
      .eq('id', existing[0].id)
    if (error) throw new Error(`${label} update: ${error.message}`)
    console.log(`  ✓ ${label}: atualizado`)
    return
  }

  const { error } = await admin.from('subscriptions').insert({
    user_id: userId,
    area: NOEL_MEMBER_AREA,
    status: 'active',
    plan_type: 'monthly',
    features: [] as string[],
    stripe_account: 'br',
    stripe_subscription_id: stripeSubId,
    stripe_customer_id: `manual_cus_${userId.replace(/-/g, '')}`,
    stripe_price_id: `manual_${NOEL_MEMBER_AREA}_courtesy`,
    amount: 0,
    currency: 'brl',
    current_period_start: now,
    current_period_end: periodEndIso,
    created_at: now,
    updated_at: now,
  })
  if (error) throw new Error(`${label} insert: ${error.message}`)
  console.log(`  ✓ ${label}: criado`)
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
    console.log('  ✓ Wellness: nenhuma ativa')
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
  console.log('  ✓ Wellness: encerrado')
}

async function processMember(tenantId: string, member: (typeof MEMBERS)[number]) {
  const periodEndIso = `${member.accessEndYmd}T23:59:59.999Z`
  console.log(`\n--- ${member.email} (até ${member.accessEndYmd}) ---`)

  const memberId = await findUserIdByEmail(member.email)
  const { data: prof } = await admin
    .from('user_profiles')
    .select('nome_completo')
    .eq('user_id', memberId)
    .maybeSingle()

  await cancelWellnessSubscription(memberId)
  const shareSlug = slugFromName(prof?.nome_completo ?? member.slugFallback)

  const { data: memRow } = await admin
    .from('leader_tenant_members')
    .select('id, pro_lideres_share_slug')
    .eq('leader_tenant_id', tenantId)
    .eq('user_id', memberId)
    .maybeSingle()

  if (memRow?.id) {
    const { error } = await admin
      .from('leader_tenant_members')
      .update({
        team_access_state: 'active',
        team_access_expires_at: periodEndIso,
        pro_lideres_share_slug: memRow.pro_lideres_share_slug ?? shareSlug,
      })
      .eq('id', memRow.id)
    if (error) throw error
    console.log(`  ✓ Equipe: reativada até ${member.accessEndYmd}`)
  } else {
    const { error } = await admin.from('leader_tenant_members').insert({
      leader_tenant_id: tenantId,
      user_id: memberId,
      role: 'member',
      team_access_state: 'active',
      team_access_expires_at: periodEndIso,
      pro_lideres_share_slug: shareSlug,
    })
    if (error) throw error
    console.log(`  ✓ Equipe: adicionada (slug: ${shareSlug})`)
  }

  await upsertSubscription(memberId, periodEndIso, 'Noel membro')
}

async function main() {
  console.log('Pro Líderes — Donarosa59 + Rosana na equipe Deise Faula\n')
  const leaderId = await findUserIdByEmail(LEADER_EMAIL)
  const { data: tenant, error: tErr } = await admin
    .from('leader_tenants')
    .select('id, display_name, slug')
    .eq('owner_user_id', leaderId)
    .maybeSingle()
  if (tErr || !tenant) throw new Error('Tenant Deise não encontrado')
  console.log(`Tenant: ${tenant.display_name} (${tenant.slug})`)

  for (const m of MEMBERS) {
    await processMember(tenant.id as string, m)
  }
  console.log('\n✅ Pronto.')
}

main().catch((e) => {
  console.error('\n❌', e instanceof Error ? e.message : e)
  process.exit(1)
})
