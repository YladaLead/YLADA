/**
 * Sincroniza assinatura Pro Líderes equipe a partir do Mercado Pago (pagamento ou preapproval).
 *
 * Uso:
 *   npx tsx scripts/pro-lideres-sync-mp-team-subscription.ts --email mvempreender@gmail.com
 *   npx tsx scripts/pro-lideres-sync-mp-team-subscription.ts --payment-id 161669410892
 *   npx tsx scripts/pro-lideres-sync-mp-team-subscription.ts --preapproval-id 0ed0788e979a4c8cba44c52f4658a331
 */
import { config } from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

function arg(name: string): string | null {
  const i = process.argv.indexOf(name)
  if (i === -1 || !process.argv[i + 1]) return null
  return process.argv[i + 1]
}

async function main() {
  const email = arg('--email')
  const paymentId = arg('--payment-id')
  const preapprovalId = arg('--preapproval-id')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  if (email) {
    const q = email.toLowerCase().trim()
    const { data: prof } = await admin
      .from('user_profiles')
      .select('user_id, email, nome_completo')
      .ilike('email', q)
      .maybeSingle()
    if (!prof?.user_id) {
      console.error('Usuário não encontrado:', email)
      process.exit(1)
    }
    console.log('Líder:', prof.nome_completo, prof.email, prof.user_id)
    const { data: sub } = await admin
      .from('subscriptions')
      .select('area, status, current_period_end, stripe_subscription_id')
      .eq('user_id', prof.user_id)
      .eq('area', 'pro_lideres_team')
      .maybeSingle()
    console.log('Assinatura pro_lideres_team antes:', sub ?? '(nenhuma)')
  }

  const { syncPaymentByIdFromMercadoPago, syncPreapprovalByIdFromMercadoPago } = await import(
    '../src/app/api/webhooks/mercado-pago/route'
  )

  if (paymentId) {
    console.log('Sincronizando pagamento MP', paymentId, '…')
    const r = await syncPaymentByIdFromMercadoPago(paymentId, false)
    console.log(r)
    if (!r.success) process.exit(1)
  }

  if (preapprovalId) {
    console.log('Sincronizando preapproval MP', preapprovalId, '…')
    const r = await syncPreapprovalByIdFromMercadoPago(preapprovalId, false)
    console.log(r)
    if (!r.success) process.exit(1)
  }

  if (!paymentId && !preapprovalId) {
    console.error('Informe --payment-id e/ou --preapproval-id')
    process.exit(1)
  }

  if (email) {
    const q = email.toLowerCase().trim()
    const { data: prof } = await admin
      .from('user_profiles')
      .select('user_id')
      .ilike('email', q)
      .maybeSingle()
    if (prof?.user_id) {
      const { data: sub } = await admin
        .from('subscriptions')
        .select('area, status, current_period_end, stripe_subscription_id')
        .eq('user_id', prof.user_id)
        .eq('area', 'pro_lideres_team')
        .maybeSingle()
      console.log('Assinatura pro_lideres_team depois:', sub ?? '(nenhuma)')
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
