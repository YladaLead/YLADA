/**
 * Gera link Mercado Pago (Preapproval) para uma conta Pro Estética capilar — sem login no site.
 *
 * Uso:
 *   npx tsx scripts/pro-estetica-capilar-gerar-link-mp.ts studioalexialima@gmail.com monthly
 *   npx tsx scripts/pro-estetica-capilar-gerar-link-mp.ts studioalexialima@gmail.com annual
 *   npx tsx scripts/pro-estetica-capilar-gerar-link-mp.ts studioalexialima@gmail.com monthly --sandbox
 */
import { createClient } from '@supabase/supabase-js'
import { createRecurringSubscription } from '../src/lib/mercado-pago-subscriptions'
import {
  PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA,
  proEsteticaCapilarCheckoutAmountBrl,
  type ProEsteticaCapilarPlanType,
} from '../src/lib/pro-estetica-capilar-subscription'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function resolveUserId(admin: ReturnType<typeof createClient>, email: string): Promise<string> {
  const { data: profile } = await admin
    .from('user_profiles')
    .select('user_id')
    .ilike('email', email)
    .maybeSingle()
  if (profile?.user_id) return profile.user_id as string

  let page = 1
  while (page <= 10) {
    const { data: list } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    const u = list?.users?.find((x) => x.email?.toLowerCase() === email)
    if (u?.id) return u.id
    if (!list?.users?.length || list.users.length < 200) break
    page++
  }
  throw new Error(`Utilizador não encontrado: ${email}`)
}

async function main() {
  const emailArg = process.argv[2]?.trim().toLowerCase()
  const planArg = (process.argv[3]?.trim().toLowerCase() || 'monthly') as ProEsteticaCapilarPlanType
  const sandbox = process.argv.includes('--sandbox')

  if (!emailArg?.includes('@')) {
    console.error('Uso: npx tsx scripts/pro-estetica-capilar-gerar-link-mp.ts <email> [monthly|annual] [--sandbox]')
    process.exit(1)
  }
  if (planArg !== 'monthly' && planArg !== 'annual') {
    console.error('Plano deve ser monthly ou annual')
    process.exit(1)
  }
  if (!supabaseUrl || !serviceKey) {
    console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  let baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    process.env.MP_CHECKOUT_BACK_URL_BASE ||
    'https://www.ylada.com'
  ).replace(/\/$/, '')
  if (/localhost|127\.0\.0\.1/i.test(baseUrl)) {
    baseUrl = 'https://www.ylada.com'
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const userId = await resolveUserId(admin, emailArg)
  const amount = proEsteticaCapilarCheckoutAmountBrl(planArg)
  const description =
    planArg === 'annual'
      ? `YLADA Pro Estética Capilar — Plano anual (R$ ${amount.toFixed(2)}, 12× R$ 150)`
      : `YLADA Pro Estética Capilar — Assinatura mensal (R$ ${amount.toFixed(2)})`

  const sub = await createRecurringSubscription(
    {
      area: PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA,
      planType: planArg,
      userId,
      userEmail: emailArg,
      amount,
      description,
      successUrl: `${baseUrl}/pro-estetica-capilar/painel/assinatura?mp=ok`,
      failureUrl: `${baseUrl}/pro-estetica-capilar/painel/assinatura?mp=fail`,
      pendingUrl: `${baseUrl}/pro-estetica-capilar/painel/assinatura?mp=pending`,
    },
    sandbox
  )

  console.log('\n--- Link Mercado Pago (enviar à cliente) ---\n')
  console.log(sub.initPoint)
  console.log('\n--- Metadados (webhook / SQL) ---')
  console.log('email:', emailArg)
  console.log('user_id:', userId)
  console.log('plan_type:', planArg)
  console.log('amount_brl:', amount)
  console.log('preapproval_id:', sub.id)
  console.log('mp_mode:', sandbox ? 'sandbox' : 'production')
  console.log('\nexternal_reference esperado: pecapilar_' + planArg + '_' + userId)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
