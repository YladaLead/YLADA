/**
 * Corrige migração incorreta: conta ANTIGA volta para Wellness;
 * conta NOVA (e-mail gmail) criada em Coach do bem-estar com mesmos dados e vencimento.
 *
 * Uso: npx tsx scripts/corrigir-duas-contas-wellness-e-coach-bem-estar.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

type Caso = {
  nome: string
  emailWellness: string
  emailCoach: string
  vencimentoYmd: string
  /** Conta que foi alterada na migração anterior (opcional). */
  userIdWellnessLegado?: string
}

const CASOS: Caso[] = [
  {
    nome: 'Adenilson Martins da Silva',
    emailWellness: 'adenilson_kalore@hotmail.com',
    emailCoach: 'adenilsonkalore@gmail.com',
    vencimentoYmd: '2027-02-27',
    userIdWellnessLegado: '777644b3-1616-4644-9476-0564e8f52e2d',
  },
  {
    nome: 'Paulo Eduardo de Freitas',
    emailWellness: 'pauloedufribe@gmail.com',
    emailCoach: 'pauloeribe@gmail.com',
    vencimentoYmd: '2027-01-08',
    userIdWellnessLegado: 'c9cca90c-43d9-4aed-bcd2-0adf1d03bd3c',
  },
]

function endOfDayUtc(ymd: string): string {
  return `${ymd}T23:59:59.999Z`
}

function tempPassword(): string {
  return (
    Math.random().toString(36).slice(-10) +
    Math.random().toString(36).slice(-10).toUpperCase() +
    '!@#1'
  )
}

async function findAuthUserByEmail(email: string) {
  const q = email.trim().toLowerCase()
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const hit = data.users.find((u) => u.email?.toLowerCase() === q)
    if (hit) return hit
    if (data.users.length < 200) break
  }
  return null
}

async function loadProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('nome_completo, whatsapp, email, perfil, nome_presidente')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

async function restoreWellnessAccount(
  userId: string,
  emailWellness: string,
  snapshot: Awaited<ReturnType<typeof loadProfile>>
) {
  const email = emailWellness.trim().toLowerCase()

  const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    email,
    email_confirm: true,
  })
  if (authErr) throw new Error(`Restaurar Auth wellness: ${authErr.message}`)

  const { error: profErr } = await supabaseAdmin
    .from('user_profiles')
    .update({
      email,
      perfil: 'wellness',
      nome_completo: snapshot?.nome_completo ?? undefined,
      whatsapp: snapshot?.whatsapp ?? undefined,
      nome_presidente: snapshot?.nome_presidente ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
  if (profErr) throw profErr

  console.log(`✅ Wellness restaurado: ${email} (user_id ${userId})`)
}

async function ensureWellnessSubscription(userId: string, periodEnd: string, planType: 'annual' | 'monthly' = 'annual') {
  const { data: subs, error } = await supabaseAdmin
    .from('subscriptions')
    .select('id, status, plan_type, current_period_end')
    .eq('user_id', userId)
    .eq('area', 'wellness')
    .order('current_period_end', { ascending: false })

  if (error) throw error

  const ativa = (subs ?? []).find((s) => String(s.status).toLowerCase() === 'active')
  const alvo = ativa ?? subs?.[0]

  if (alvo) {
    const { error: upd } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_end: periodEnd,
        plan_type: planType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', alvo.id)
    if (upd) throw upd
    return
  }

  const now = new Date().toISOString()
  const { error: ins } = await supabaseAdmin.from('subscriptions').insert({
    user_id: userId,
    area: 'wellness',
    plan_type: planType,
    features: planType === 'annual' ? ['completo'] : ['gestao', 'ferramentas'],
    status: 'active',
    current_period_start: now,
    current_period_end: periodEnd,
    stripe_subscription_id: `manual_wellness_dup_${userId}_${Date.now()}`,
    stripe_customer_id: `manual_${userId}`,
    stripe_price_id: `manual_${planType}`,
    amount: planType === 'annual' ? 97000 : 9700,
    currency: 'brl',
    updated_at: now,
  })
  if (ins) throw ins
}

async function ensureCoachAccount(
  c: Caso,
  snapshot: Awaited<ReturnType<typeof loadProfile>>,
  periodEnd: string
) {
  const emailCoach = c.emailCoach.trim().toLowerCase()
  let user = await findAuthUserByEmail(emailCoach)
  let senhaProvisoria: string | null = null

  if (user) {
    const prof = await loadProfile(user.id)
    if (prof?.perfil === 'wellness' && c.userIdWellnessLegado && user.id === c.userIdWellnessLegado) {
      throw new Error(
        'E-mail coach ainda está na mesma conta wellness — restauração incompleta; rode de novo.'
      )
    }
    console.log(`ℹ️ Conta coach já existe (${user.id}); atualizando perfil e assinatura.`)
  } else {
    senhaProvisoria = tempPassword()
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: emailCoach,
      email_confirm: true,
      password: senhaProvisoria,
      user_metadata: { full_name: snapshot?.nome_completo ?? c.nome },
    })
    if (createErr || !created.user) throw new Error(`Criar Auth coach: ${createErr?.message}`)
    user = created.user
    console.log(`✅ Conta coach criada: ${emailCoach}`)
    console.log(`   Senha provisória (definir outra no 1º acesso): ${senhaProvisoria}`)
  }

  const { data: existingProf } = await supabaseAdmin
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  const profileRow = {
    user_id: user.id,
    email: emailCoach,
    perfil: 'coach-bem-estar',
    nome_completo: snapshot?.nome_completo ?? c.nome,
    whatsapp: snapshot?.whatsapp ?? null,
    nome_presidente: snapshot?.nome_presidente ?? null,
    updated_at: new Date().toISOString(),
  }

  if (existingProf) {
    const { error } = await supabaseAdmin.from('user_profiles').update(profileRow).eq('user_id', user.id)
    if (error) throw error
  } else {
    const { error } = await supabaseAdmin.from('user_profiles').insert(profileRow)
    if (error) throw error
  }

  await ensureWellnessSubscription(user.id, periodEnd, 'annual')
  console.log(`✅ Coach do bem-estar: ${emailCoach} até ${c.vencimentoYmd}`)
  console.log(`   Login: https://www.ylada.com/pt/coach-bem-estar/login`)
  console.log(`   user_id: ${user.id}`)
}

async function processar(c: Caso) {
  console.log(`\n======== ${c.nome} ========`)
  const periodEnd = endOfDayUtc(c.vencimentoYmd)

  let wellnessUserId = c.userIdWellnessLegado
  let snapshot: Awaited<ReturnType<typeof loadProfile>> = null

  const byCoach = await findAuthUserByEmail(c.emailCoach)
  const byWellness = await findAuthUserByEmail(c.emailWellness)

  if (byCoach && (!wellnessUserId || byCoach.id === wellnessUserId)) {
    wellnessUserId = byCoach.id
    snapshot = await loadProfile(wellnessUserId)
    await restoreWellnessAccount(wellnessUserId, c.emailWellness, snapshot)
    await ensureWellnessSubscription(wellnessUserId, periodEnd, 'annual')
  } else if (byWellness) {
    wellnessUserId = byWellness.id
    snapshot = await loadProfile(wellnessUserId)
    const prof = snapshot
    if (prof?.perfil !== 'wellness') {
      await restoreWellnessAccount(wellnessUserId, c.emailWellness, snapshot)
    } else {
      console.log(`✅ Wellness já ok: ${c.emailWellness}`)
    }
    await ensureWellnessSubscription(wellnessUserId, periodEnd, 'annual')
  } else if (wellnessUserId) {
    snapshot = await loadProfile(wellnessUserId)
    await restoreWellnessAccount(wellnessUserId, c.emailWellness, snapshot)
    await ensureWellnessSubscription(wellnessUserId, periodEnd, 'annual')
  } else {
    throw new Error(`Conta wellness não encontrada para ${c.emailWellness}`)
  }

  if (!snapshot) snapshot = await loadProfile(wellnessUserId!)
  await ensureCoachAccount(c, snapshot, periodEnd)
}

async function main() {
  console.log('Corrigindo: Wellness (e-mail antigo) + Coach bem-estar (e-mail novo)…\n')
  for (const c of CASOS) {
    try {
      await processar(c)
    } catch (e) {
      console.error(`❌ ${c.nome}:`, e instanceof Error ? e.message : e)
      process.exitCode = 1
    }
  }
  console.log('\nConcluído.')
}

main()
