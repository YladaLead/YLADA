/**
 * Garante tenant capilar + ficha consultoria para studioalexialima@gmail.com
 * Uso: npx tsx scripts/pro-estetica-capilar-preparar-alexia-lima.ts
 */
import { createClient } from '@supabase/supabase-js'

const EMAIL = 'studioalexialima@gmail.com'
const COURTESY_DAYS = 3

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function addDaysYmd(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

async function main() {
  const email = EMAIL.trim().toLowerCase()

  const { data: profile } = await admin
    .from('user_profiles')
    .select('user_id, email, nome_completo')
    .ilike('email', email)
    .maybeSingle()

  let userId = profile?.user_id as string | undefined
  if (!userId) {
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
    const u = list?.users?.find((x) => x.email?.toLowerCase() === email)
    userId = u?.id
  }

  if (!userId) {
    console.error(`Utilizador não encontrado: ${email}`)
    console.error('Peça para criar conta em https://www.ylada.com/pro-estetica-capilar/entrar')
    process.exit(1)
  }

  console.log('user_id:', userId, profile?.nome_completo ?? '')

  const { data: existingTenant } = await admin
    .from('leader_tenants')
    .select('id, vertical_code')
    .eq('owner_user_id', userId)
    .maybeSingle()

  let tenantId = existingTenant?.id as string | undefined

  if (!tenantId) {
    const slug = `pecap-${userId.replace(/-/g, '').slice(0, 12)}`
    const { data: ins, error } = await admin
      .from('leader_tenants')
      .insert({
        owner_user_id: userId,
        slug,
        display_name: 'Alexia Lima',
        vertical_code: 'estetica-capilar',
        contact_email: email,
      })
      .select('id')
      .single()
    if (error) {
      console.error('Erro ao criar tenant:', error.message)
      process.exit(1)
    }
    tenantId = ins.id
    console.log('Tenant criado:', tenantId)
  } else {
    await admin
      .from('leader_tenants')
      .update({
        vertical_code: 'estetica-capilar',
        contact_email: email,
        display_name: 'Alexia Lima',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
    console.log('Tenant atualizado:', tenantId, 'vertical:', existingTenant?.vertical_code)
  }

  const until = addDaysYmd(COURTESY_DAYS)

  const { data: clients } = await admin
    .from('ylada_estetica_consult_clients')
    .select('id, access_valid_until')
    .or(`leader_tenant_id.eq.${tenantId},contact_email.ilike.${email}`)

  const client = clients?.[0]
  if (!client?.id) {
    const { error } = await admin.from('ylada_estetica_consult_clients').insert({
      business_name: 'Studio Alexia Lima — Estética capilar',
      segment: 'capilar',
      contact_email: email,
      leader_tenant_id: tenantId,
      access_valid_until: until,
      admin_notes: 'Preparado script — link /pro-estetica-capilar/assinatura',
    })
    if (error) {
      console.error('Erro ao criar ficha consultoria:', error.message)
      process.exit(1)
    }
    console.log('Ficha consultoria criada, access_until:', until)
  } else {
    const cur = (client.access_valid_until as string | null)?.slice(0, 10)
    const next =
      cur && cur >= new Date().toISOString().slice(0, 10)
        ? cur > until
          ? cur
          : until
        : until
    await admin
      .from('ylada_estetica_consult_clients')
      .update({
        leader_tenant_id: tenantId,
        segment: 'capilar',
        contact_email: email,
        access_valid_until: next,
        updated_at: new Date().toISOString(),
      })
      .eq('id', client.id)
    console.log('Ficha atualizada:', client.id, 'access_until:', next)
  }

  console.log('\n✅ Pronta para:')
  console.log('   Entrar: https://www.ylada.com/pro-estetica-capilar/entrar')
  console.log('   Assinar: https://www.ylada.com/pro-estetica-capilar/assinatura')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
