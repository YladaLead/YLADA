/**
 * Separa e-mails: Wellness mantém vidasaudavelaracy@gmail.com;
 * conta Pró Líderes passa a marcio.sciascio@gmail.com.
 *
 * Uso: npx tsx scripts/trocar-email-pro-lideres-aracy.ts
 *      npx tsx scripts/trocar-email-pro-lideres-aracy.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const EMAIL_WELLNESS = 'vidasaudavelaracy@gmail.com'
const EMAIL_PRO_LIDERES = 'marcio.sciascio@gmail.com'
const DRY_RUN = process.argv.includes('--dry-run')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

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

async function findProfilesByEmailLike(fragment: string) {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, email, nome_completo, perfil, whatsapp, created_at')
    .ilike('email', `%${fragment}%`)
  if (error) throw error
  return data ?? []
}

async function proLideresContext(userId: string) {
  const { data: owned } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, vertical_code, display_name, owner_user_id')
    .eq('owner_user_id', userId)

  const { data: member } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('leader_tenant_id, role, user_id')
    .eq('user_id', userId)

  return { owned: owned ?? [], member: member ?? [] }
}

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN\n' : '🚀 Aplicar alterações\n')

  const authWellness = await findAuthUserByEmail(EMAIL_WELLNESS)
  const authMarcio = await findAuthUserByEmail(EMAIL_PRO_LIDERES)
  const profiles = await findProfilesByEmailLike('aracy')
  const profilesMarcio = await findProfilesByEmailLike('marcio.sciascio')

  console.log('Auth vidasaudavelaracy:', authWellness?.id ?? '—', authWellness?.email)
  console.log('Auth marcio.sciascio:', authMarcio?.id ?? '—', authMarcio?.email)
  console.log('\nPerfis (aracy):', profiles)
  console.log('\nPerfis (marcio):', profilesMarcio)

  for (const p of [...profiles, ...profilesMarcio]) {
    const ctx = await proLideresContext(p.user_id)
    console.log(`\n${p.nome_completo} (${p.perfil}) user_id=${p.user_id}`)
    console.log('  tenants owner:', ctx.owned)
    console.log('  member of:', ctx.member)
  }

  // Conta Pro Líderes: dono ou membro de tenant h-lider; preferir user_id mais recente se duplicado
  const candidateIds = new Set<string>()
  for (const p of profiles) {
    const ctx = await proLideresContext(p.user_id)
    if (ctx.owned.length > 0 || ctx.member.length > 0) candidateIds.add(p.user_id)
  }

  let proUserId: string | null = null
  if (candidateIds.size === 1) {
    proUserId = [...candidateIds][0]
  } else if (candidateIds.size > 1) {
    // mais recente cadastro
    const sorted = profiles
      .filter((p) => candidateIds.has(p.user_id))
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
    proUserId = sorted[0]?.user_id ?? null
    console.log('\n⚠️ Vários candidatos Pro Líderes; escolhido o cadastro mais recente:', proUserId)
  } else if (authWellness && profiles.length === 1) {
    // mesma conta wellness + pro — precisa criar conta nova para marcio
    console.log('\n⚠️ Pro Líderes parece estar na mesma conta que Wellness — será necessário criar conta separada.')
    proUserId = authWellness.id
  }

  if (!proUserId) {
    console.error('\n❌ Não foi possível identificar a conta Pro Líderes.')
    process.exit(1)
  }

  const wellnessUserId = authWellness?.id
  if (wellnessUserId && proUserId === wellnessUserId) {
    console.error(
      '\n❌ Wellness e Pro Líderes estão no mesmo user_id. Este script só troca e-mail em conta separada.',
      '\n   Confirme no admin se existem duas linhas com user_id diferentes ou peça split manual.'
    )
    process.exit(1)
  }

  if (authMarcio && authMarcio.id !== proUserId) {
    console.error(`\n❌ ${EMAIL_PRO_LIDERES} já pertence a outro user_id (${authMarcio.id}).`)
    process.exit(1)
  }

  const { data: prof } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('user_id', proUserId)
    .maybeSingle()

  console.log('\n✅ Conta Pro Líderes a atualizar:', proUserId, prof?.nome_completo, prof?.email)

  if (DRY_RUN) {
    console.log(`\nDry-run: Auth + profile → ${EMAIL_PRO_LIDERES}`)
    return
  }

  const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(proUserId, {
    email: EMAIL_PRO_LIDERES,
    email_confirm: true,
  })
  if (authErr) {
    console.error('❌ Auth:', authErr.message)
    process.exit(1)
  }

  const { error: profErr } = await supabaseAdmin
    .from('user_profiles')
    .update({ email: EMAIL_PRO_LIDERES, updated_at: new Date().toISOString() })
    .eq('user_id', proUserId)

  if (profErr) {
    console.error('❌ user_profiles:', profErr.message)
    process.exit(1)
  }

  console.log(`\n✅ Pró Líderes: login agora com ${EMAIL_PRO_LIDERES} (mesma senha de antes).`)
  console.log(`✅ Wellness mantém ${EMAIL_WELLNESS} (user_id ${wellnessUserId ?? '—'}).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
