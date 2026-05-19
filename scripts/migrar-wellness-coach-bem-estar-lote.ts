/**
 * Migra clientes Wellness (Elvis) → Coach do bem-estar:
 * - Atualiza e-mail no Auth + user_profiles
 * - perfil = coach-bem-estar
 * - Mantém assinatura area=wellness com current_period_end informado
 *
 * Uso: npx tsx scripts/migrar-wellness-coach-bem-estar-lote.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

type Migracao = {
  nome: string
  emailAntigo: string
  emailNovo: string
  vencimentoYmd: string // YYYY-MM-DD
}

const MIGRACOES: Migracao[] = [
  {
    nome: 'Adenilson Martins da Silva',
    emailAntigo: 'adenilson_kalore@hotmail.com',
    emailNovo: 'adenilsonkalore@gmail.com',
    vencimentoYmd: '2027-02-27',
  },
  {
    nome: 'Paulo Eduardo de Freitas',
    emailAntigo: 'pauloedufribe@gmail.com',
    emailNovo: 'pauloeribe@gmail.com',
    vencimentoYmd: '2027-01-08',
  },
]

function endOfDayUtc(ymd: string): string {
  return `${ymd}T23:59:59.999Z`
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

async function migrateOne(m: Migracao) {
  const novo = m.emailNovo.trim().toLowerCase()
  const antigo = m.emailAntigo.trim().toLowerCase()
  const periodEnd = endOfDayUtc(m.vencimentoYmd)

  console.log(`\n—— ${m.nome} ——`)

  let user = await findAuthUserByEmail(antigo)
  if (!user) {
    user = await findAuthUserByEmail(novo)
    if (user) console.log('ℹ️ Conta já usa o e-mail novo; seguindo atualização de perfil/assinatura.')
  }
  if (!user) {
    throw new Error(`Usuário não encontrado (${antigo} nem ${novo})`)
  }

  const novoOcupado = await findAuthUserByEmail(novo)
  if (novoOcupado && novoOcupado.id !== user.id) {
    throw new Error(`E-mail novo ${novo} já pertence a outro user_id (${novoOcupado.id})`)
  }

  if (user.email?.toLowerCase() !== novo) {
    const { error: emailErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      email: novo,
      email_confirm: true,
    })
    if (emailErr) throw new Error(`Auth email: ${emailErr.message}`)
    console.log(`✅ Auth e-mail: ${antigo} → ${novo}`)
  } else {
    console.log(`✅ Auth e-mail já é ${novo}`)
  }

  const { data: prof, error: profReadErr } = await supabaseAdmin
    .from('user_profiles')
    .select('id, perfil, email')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profReadErr) throw profReadErr

  const profilePatch = {
    email: novo,
    perfil: 'coach-bem-estar',
    updated_at: new Date().toISOString(),
  }

  if (prof) {
    const { error: profUpdErr } = await supabaseAdmin
      .from('user_profiles')
      .update(profilePatch)
      .eq('user_id', user.id)
    if (profUpdErr) throw profUpdErr
    console.log(`✅ Perfil: ${prof.perfil} → coach-bem-estar`)
  } else {
    const { error: profInsErr } = await supabaseAdmin.from('user_profiles').insert({
      user_id: user.id,
      nome_completo: m.nome,
      ...profilePatch,
    })
    if (profInsErr) throw profInsErr
    console.log('✅ Perfil criado (coach-bem-estar)')
  }

  const { data: subs, error: subErr } = await supabaseAdmin
    .from('subscriptions')
    .select('id, area, plan_type, status, current_period_end')
    .eq('user_id', user.id)
    .eq('area', 'wellness')
    .order('current_period_end', { ascending: false })

  if (subErr) throw subErr

  const ativa = (subs ?? []).find(
    (s) =>
      String(s.status).toLowerCase() === 'active' &&
      s.current_period_end &&
      new Date(s.current_period_end).getTime() > Date.now()
  )
  const alvo = ativa ?? subs?.[0]

  if (!alvo) {
    const { error: insSubErr } = await supabaseAdmin.from('subscriptions').insert({
      user_id: user.id,
      area: 'wellness',
      plan_type: 'annual',
      features: ['completo'],
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd,
      stripe_subscription_id: `manual_coach_bem_estar_${user.id}_${Date.now()}`,
      stripe_customer_id: `manual_${user.id}`,
      stripe_price_id: 'manual_annual',
      amount: 97000,
      currency: 'brl',
      updated_at: new Date().toISOString(),
    })
    if (insSubErr) throw insSubErr
    console.log(`✅ Assinatura wellness criada até ${m.vencimentoYmd}`)
  } else {
    const { error: subUpdErr } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_end: periodEnd,
        plan_type: alvo.plan_type === 'monthly' ? 'monthly' : 'annual',
        updated_at: new Date().toISOString(),
      })
      .eq('id', alvo.id)
    if (subUpdErr) throw subUpdErr
    console.log(
      `✅ Assinatura wellness (${alvo.id}) vigente até ${m.vencimentoYmd} (era ${String(alvo.current_period_end).slice(0, 10)})`
    )
  }

  console.log(`   Login: https://www.ylada.com/pt/coach-bem-estar/login`)
  console.log(`   user_id: ${user.id}`)
}

async function main() {
  console.log('Migrando', MIGRACOES.length, 'usuários para Coach do bem-estar…')
  for (const m of MIGRACOES) {
    try {
      await migrateOne(m)
    } catch (e) {
      console.error(`❌ ${m.nome}:`, e instanceof Error ? e.message : e)
      process.exitCode = 1
    }
  }
  console.log('\nConcluído.')
}

main()
