#!/usr/bin/env npx tsx
/**
 * Ativa Noel membro para andrefaula@gmail.com no tenant da líder deisefaula@gmail.com
 * (oferta equipe + assinatura pro_lideres_noel_member longa, sem Mercado Pago).
 *
 * Uso: npx tsx scripts/pro-lideres-grant-noel-membro-andre-deise.ts
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })
config({ path: '.env' })

const LEADER_EMAIL = (process.env.PL_LEADER_EMAIL || 'deisefaula@gmail.com').trim().toLowerCase()
const MEMBER_EMAIL = (process.env.PL_MEMBER_EMAIL || 'andrefaula@gmail.com').trim().toLowerCase()

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
const TEAM_AREA = 'pro_lideres_team'
/** ~10 anos — “sem limites” operacional para testes */
const PERIOD_END = new Date()
PERIOD_END.setUTCFullYear(PERIOD_END.getUTCFullYear() + 10)
const PERIOD_END_ISO = PERIOD_END.toISOString()

async function findUserIdByEmail(email: string): Promise<string> {
  const { data: prof } = await admin
    .from('user_profiles')
    .select('user_id, email, nome_completo')
    .ilike('email', email)
    .limit(10)

  const row = (prof ?? []).find((p) => (p.email || '').toLowerCase().trim() === email)
  if (row?.user_id) return row.user_id as string

  const { data: authList } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const authUser = authList?.users?.find((u) => u.email?.toLowerCase().trim() === email)
  if (authUser?.id) return authUser.id

  throw new Error(`Usuário não encontrado: ${email}`)
}

async function upsertSubscription(userId: string, area: string, label: string) {
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
        plan_type: 'annual',
        current_period_start: now,
        current_period_end: PERIOD_END_ISO,
        updated_at: now,
      })
      .eq('id', existing[0].id)
    if (error) throw new Error(`${label} update: ${error.message}`)
    console.log(`  ✓ ${label}: assinatura atualizada até ${PERIOD_END_ISO.slice(0, 10)}`)
    return
  }

  const { error } = await admin.from('subscriptions').insert({
    user_id: userId,
    area,
    status: 'active',
    plan_type: 'annual',
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
  console.log(`  ✓ ${label}: assinatura criada até ${PERIOD_END_ISO.slice(0, 10)}`)
}

async function main() {
  console.log('Pro Líderes — Noel membro (Andre na operação Deise)\n')

  const leaderId = await findUserIdByEmail(LEADER_EMAIL)
  const memberId = await findUserIdByEmail(MEMBER_EMAIL)
  console.log(`Líder ${LEADER_EMAIL}: ${leaderId}`)
  console.log(`Membro ${MEMBER_EMAIL}: ${memberId}`)

  const { data: tenant, error: tErr } = await admin
    .from('leader_tenants')
    .select('id, slug, display_name, team_name, owner_user_id')
    .eq('owner_user_id', leaderId)
    .maybeSingle()

  if (tErr || !tenant) {
    throw new Error(`Tenant da líder não encontrado (${LEADER_EMAIL})`)
  }

  const tenantId = tenant.id as string
  console.log(`Tenant: ${tenant.display_name || tenant.team_name} (${tenant.slug}) — ${tenantId}`)

  const { error: tenantUpdErr } = await admin
    .from('leader_tenants')
    .update({
      noel_member_offer_enabled: true,
      noel_member_offer_scope: 'all_members',
      updated_at: new Date().toISOString(),
    })
    .eq('id', tenantId)

  if (tenantUpdErr) throw new Error(`tenant: ${tenantUpdErr.message}`)
  console.log('  ✓ Noel equipe: oferta ativa para todos os membros')

  const { data: memRow } = await admin
    .from('leader_tenant_members')
    .select('user_id, role, team_access_state, pro_lideres_share_slug')
    .eq('leader_tenant_id', tenantId)
    .eq('user_id', memberId)
    .maybeSingle()

  if (!memRow) {
    throw new Error(
      `${MEMBER_EMAIL} não é membro deste tenant. Convide-o em Pro Líderes → Convites equipe e rode de novo.`
    )
  }

  const { error: memErr } = await admin
    .from('leader_tenant_members')
    .update({
      team_access_state: 'active',
    })
    .eq('leader_tenant_id', tenantId)
    .eq('user_id', memberId)

  if (memErr) throw new Error(`member row: ${memErr.message}`)
  console.log(`  ✓ Membro ativo na equipe (estado: active, slug: ${memRow.pro_lideres_share_slug || '—'})`)

  await upsertSubscription(leaderId, TEAM_AREA, 'pro_lideres_team (líder)')
  await upsertSubscription(memberId, NOEL_MEMBER_AREA, 'pro_lideres_noel_member (Andre)')

  console.log('\n✅ Pronto. Andre pode abrir:')
  console.log('   http://localhost:3000/pro-lideres/membro/noel-membro')
  console.log('   (ou laboratório do líder: /pro-lideres/painel/noel-membro-laboratorio)')
}

main().catch((e) => {
  console.error('\n❌', e instanceof Error ? e.message : e)
  process.exit(1)
})
