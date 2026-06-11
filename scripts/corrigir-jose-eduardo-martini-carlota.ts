/**
 * Corrige troca de e-mails: José Eduardo usou o convite do Martini (Japa).
 *
 * - Conta atual (José Eduardo) em martinijp@hotmail.com → jeoliveira2025@icloud.com
 * - Libera martinijp@hotmail.com para o Martini se cadastrar pelo convite pendente
 * - Gera convites novos em nome da Carlota (--novos-convites)
 *
 * Uso:
 *   npx tsx scripts/corrigir-jose-eduardo-martini-carlota.ts --dry-run
 *   npx tsx scripts/corrigir-jose-eduardo-martini-carlota.ts
 *   npx tsx scripts/corrigir-jose-eduardo-martini-carlota.ts --novos-convites
 *   npx tsx scripts/corrigir-jose-eduardo-martini-carlota.ts --reset-completo
 */

import { randomBytes } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const DRY_RUN = process.argv.includes('--dry-run')
const NOVOS_CONVITES = process.argv.includes('--novos-convites')
const RESET_COMPLETO = process.argv.includes('--reset-completo')

const USER_ID = '63112d27-61b0-41e4-b4b3-37b7e2ee7211'
const TENANT_ID = '583c31a0-7e66-4df7-b5c5-d9555210c96f'
const CARLOTA_USER_ID = '56fac814-1e97-48bf-a622-37b5a3a9e9e4'
const EMAIL_JOSE = 'jeoliveira2025@icloud.com'
const EMAIL_MARTINI = 'martinijp@hotmail.com'
/** Convite que José consumiu por engano (era do Martini). */
const INVITE_USED_WRONG_ID = '364d9806-12cc-4a1a-abec-c5395f4b4321'
/** Convite duplicado pendente do José — revogar após correção. */
const INVITE_JOSE_DUPLICATE_PENDING_ID = 'ba916664-47d1-495b-852c-deb7d9c4b085'
/** Convite pendente do Martini — manter para ele se cadastrar. */
const INVITE_MARTINI_PENDING_ID = '8e0f40fc-c526-4e40-879a-9018b2de63ea'

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function generateInviteToken(): string {
  return randomBytes(24).toString('base64url')
}

function inviteExpiresAt(): string {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString()
}

/** Apaga o cadastro errado do José e gera convites novos para os dois começarem do zero. */
async function resetCompleto(siteUrl: string) {
  console.log(DRY_RUN ? '🔍 DRY RUN — reset completo\n' : '🔄 Reset completo (ignorar cadastro anterior)\n')

  const authJose = await findAuthUserByEmail(EMAIL_JOSE)
  const authMartini = await findAuthUserByEmail(EMAIL_MARTINI)

  if (authMartini) {
    console.error('❌ Martini já tem conta em', EMAIL_MARTINI, '— abortando para não apagar dados dele.')
    process.exit(1)
  }

  if (authJose) {
    if (authJose.id !== USER_ID) {
      console.error('❌ user_id inesperado para José:', authJose.id)
      process.exit(1)
    }
    if (DRY_RUN) {
      console.log('Apagaria auth user José:', authJose.id, '(cascade: membro da equipe, tokens)')
    } else {
      const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(USER_ID)
      if (delErr) {
        console.error('❌ deleteUser José:', delErr.message)
        process.exit(1)
      }
      console.log('✅ Cadastro anterior do José removido (conta + vínculo na equipe)')
    }
  } else {
    console.log('ℹ️ Conta do José já não existe — seguindo com convites')
  }

  const { data: invitesAntigos } = await supabaseAdmin
    .from('leader_tenant_invites')
    .select('id, status, invited_email')
    .eq('leader_tenant_id', TENANT_ID)
    .in('invited_email', [EMAIL_JOSE, EMAIL_MARTINI])

  if (invitesAntigos?.length) {
    if (DRY_RUN) {
      console.log('Revogaria todos os convites antigos:', invitesAntigos.length)
    } else {
      const { error } = await supabaseAdmin
        .from('leader_tenant_invites')
        .update({ status: 'revoked' })
        .in(
          'id',
          invitesAntigos.map((i) => i.id)
        )
      if (error) {
        console.error('❌ revogar convites:', error.message)
        process.exit(1)
      }
      console.log(`✅ ${invitesAntigos.length} convite(s) antigo(s) revogado(s)`)
    }
  }

  await criarConvitesCarlota(siteUrl)
}

async function criarConvitesCarlota(siteUrl: string) {
  console.log('\n📨 Gerando convites novos (Carlota e José Batista)…\n')

  const { data: pendentes } = await supabaseAdmin
    .from('leader_tenant_invites')
    .select('id, invited_email, status, token')
    .eq('leader_tenant_id', TENANT_ID)
    .in('invited_email', [EMAIL_JOSE, EMAIL_MARTINI])
    .eq('status', 'pending')

  if (pendentes?.length) {
    const ids = pendentes.map((p) => p.id)
    if (DRY_RUN) {
      console.log('Revogaria convites pendentes antigos:', pendentes)
    } else {
      const { error } = await supabaseAdmin
        .from('leader_tenant_invites')
        .update({ status: 'revoked' })
        .in('id', ids)
        .eq('status', 'pending')
      if (error) {
        console.error('❌ revogar pendentes:', error.message)
        process.exit(1)
      }
      console.log(`✅ ${ids.length} convite(s) pendente(s) antigo(s) revogado(s)`)
    }
  }

  const links: { nome: string; email: string; url: string; instrucao: string }[] = []

  const instrucaoCadastro =
    'Abrir o link e preencher o cadastro completo (nome, tabulador, slug nos links, WhatsApp, senha).'

  for (const [nome, email] of [
    ['José Eduardo de Oliveira', EMAIL_JOSE],
    ['Martini (Japa)', EMAIL_MARTINI],
  ] as const) {
    const token = generateInviteToken()
    const expiresAt = inviteExpiresAt()

    if (DRY_RUN) {
      links.push({
        nome,
        email,
        url: `${siteUrl}/pro-lideres/convite/${token}`,
        instrucao: instrucaoCadastro,
      })
      continue
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('leader_tenant_invites')
      .insert({
        leader_tenant_id: TENANT_ID,
        token,
        invited_email: email,
        created_by_user_id: CARLOTA_USER_ID,
        expires_at: expiresAt,
        status: 'pending',
      })
      .select('token')
      .single()

    if (error || !inserted?.token) {
      console.error(`❌ criar convite ${email}:`, error?.message)
      process.exit(1)
    }

    links.push({
      nome,
      email,
      url: `${siteUrl}/pro-lideres/convite/${inserted.token}`,
      instrucao: instrucaoCadastro,
    })
  }

  for (const l of links) {
    console.log(`— ${l.nome} (${l.email})`)
    console.log(`  ${l.url}`)
    console.log(`  → ${l.instrucao}\n`)
  }

  console.log(
    'Esses links aparecem no painel da Carlota em Pro Líderes → Convites, como se ela tivesse acabado de gerar.'
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

async function main() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.com').replace(
    /\/$/,
    ''
  )

  if (RESET_COMPLETO) {
    await resetCompleto('https://www.ylada.com')
    return
  }

  if (NOVOS_CONVITES) {
    await criarConvitesCarlota('https://www.ylada.com')
    return
  }

  console.log(DRY_RUN ? '🔍 DRY RUN\n' : '🚀 Aplicando correção\n')

  const authJoseWrong = await findAuthUserByEmail(EMAIL_MARTINI)
  const authJoseRight = await findAuthUserByEmail(EMAIL_JOSE)
  const authMartini = await findAuthUserByEmail(EMAIL_MARTINI)

  if (!authJoseWrong || authJoseWrong.id !== USER_ID) {
    console.error('❌ Conta esperada não encontrada em', EMAIL_MARTINI)
    process.exit(1)
  }
  if (authJoseRight && authJoseRight.id !== USER_ID) {
    console.error('❌', EMAIL_JOSE, 'já pertence a outro user_id:', authJoseRight.id)
    process.exit(1)
  }

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('nome_completo, email, whatsapp')
    .eq('user_id', USER_ID)
    .maybeSingle()

  const { data: member } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('leader_tenant_id, pro_lideres_share_slug, pro_lideres_tabulator_name, team_access_state')
    .eq('user_id', USER_ID)
    .eq('leader_tenant_id', TENANT_ID)
    .maybeSingle()

  console.log('Conta a corrigir:', {
    user_id: USER_ID,
    nome: profile?.nome_completo,
    email_atual: profile?.email,
    whatsapp: profile?.whatsapp,
    membro: member,
  })

  const { data: martiniInvite } = await supabaseAdmin
    .from('leader_tenant_invites')
    .select('id, token, status, invited_email')
    .eq('id', INVITE_MARTINI_PENDING_ID)
    .maybeSingle()

  const martiniConviteUrl = martiniInvite?.token
    ? `${siteUrl}/pro-lideres/convite/${martiniInvite.token}`
    : '(convite não encontrado)'

  if (DRY_RUN) {
    console.log('\nDry-run:')
    console.log(`  Auth + profile: ${EMAIL_MARTINI} → ${EMAIL_JOSE}`)
    console.log(`  Convite usado ${INVITE_USED_WRONG_ID}: invited_email → ${EMAIL_JOSE}`)
    console.log(`  Revogar convite duplicado ${INVITE_JOSE_DUPLICATE_PENDING_ID}`)
    console.log(`  Martini cadastra em: ${martiniConviteUrl}`)
    return
  }

  const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(USER_ID, {
    email: EMAIL_JOSE,
    email_confirm: true,
    user_metadata: {
      full_name: profile?.nome_completo ?? 'José Eduardo de Oliveira',
      name: profile?.nome_completo ?? 'José Eduardo de Oliveira',
      perfil: 'ylada',
    },
  })
  if (authErr) {
    console.error('❌ Auth:', authErr.message)
    process.exit(1)
  }

  const { error: profErr } = await supabaseAdmin
    .from('user_profiles')
    .update({ email: EMAIL_JOSE, updated_at: new Date().toISOString() })
    .eq('user_id', USER_ID)
  if (profErr) {
    console.error('❌ user_profiles:', profErr.message)
    process.exit(1)
  }

  const { error: invFixErr } = await supabaseAdmin
    .from('leader_tenant_invites')
    .update({ invited_email: EMAIL_JOSE })
    .eq('id', INVITE_USED_WRONG_ID)
  if (invFixErr) {
    console.error('❌ convite usado (email):', invFixErr.message)
    process.exit(1)
  }

  const { error: invRevokeErr } = await supabaseAdmin
    .from('leader_tenant_invites')
    .update({ status: 'revoked' })
    .eq('id', INVITE_JOSE_DUPLICATE_PENDING_ID)
    .eq('status', 'pending')
  if (invRevokeErr) {
    console.error('❌ revogar convite duplicado:', invRevokeErr.message)
    process.exit(1)
  }

  console.log('\n✅ José Eduardo: login agora com', EMAIL_JOSE, '(mesma senha que ele definiu no cadastro)')
  console.log('✅ E-mail', EMAIL_MARTINI, 'liberado para o Martini (Japa)')
  console.log('\n📩 Martini deve abrir o convite e criar a conta:')
  console.log('   ', martiniConviteUrl)
  console.log('\nSe José não lembrar a senha, use Admin → definir senha individual.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
