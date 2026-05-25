/**
 * Gera e persiste user_slug para contas Coach de bem-estar sem slug.
 *
 * Uso:
 *   npx tsx scripts/gerar-user-slug-coach-bem-estar-lote.ts           # dry-run
 *   npx tsx scripts/gerar-user-slug-coach-bem-estar-lote.ts --apply   # grava
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const apply = process.argv.includes('--apply')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function normalizeToSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)
}

function nameHintForUserSlug(nomeCompleto: string, email?: string): string {
  const nome = (nomeCompleto || '').trim()
  if (nome.length >= 3) return nome
  const local = (email || '').split('@')[0]?.trim() ?? ''
  if (!local) return nome
  const fromEmail = local.replace(/[._+-]+/g, ' ').trim()
  return (fromEmail.length >= 3 ? fromEmail : nome || local).trim()
}

const RESERVED = new Set([
  'portal', 'ferramenta', 'ferramentas', 'home', 'configuracao',
  'configuracoes', 'perfil', 'admin', 'api', 'pt', 'c', 'coach',
  'nutri', 'wellness', 'nutra', 'hom', 'workshop', 'trial', 'login',
])

async function isSlugAvailable(sb: SupabaseClient, slug: string): Promise<boolean> {
  if (!slug || slug.length < 3 || RESERVED.has(slug.toLowerCase())) return false
  const { data, error } = await sb
    .from('user_profiles')
    .select('user_id')
    .eq('user_slug', slug)
    .maybeSingle()
  if (error && error.code !== 'PGRST116') return false
  return !data
}

async function generateAvailableUserSlug(
  sb: SupabaseClient,
  nomeCompleto: string,
  email?: string
): Promise<string | null> {
  const hint = nameHintForUserSlug(nomeCompleto, email)
  if (!hint || hint.length < 3) return null

  const partes = hint.split(/\s+/)
  const primeiro = partes[0]
  if (!primeiro || primeiro.length < 2) return null

  const tentativas: string[] = []
  tentativas.push(normalizeToSlug(primeiro))
  if (partes.length >= 2 && partes[1].length > 0) {
    tentativas.push(normalizeToSlug(`${primeiro} ${partes[1].charAt(0)}`))
    tentativas.push(normalizeToSlug(`${primeiro} ${partes[1]}`))
  }
  for (let i = 1; i <= 99; i++) tentativas.push(`${normalizeToSlug(primeiro)}${i}`)
  for (let i = 0; i < 26; i++) {
    tentativas.push(`${normalizeToSlug(primeiro)}${String.fromCharCode(97 + i)}`)
  }

  for (const t of tentativas) {
    if (t && t.length >= 3 && (await isSlugAvailable(sb, t))) return t
  }
  return null
}

async function main() {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, email, nome_completo, user_slug, perfil')
    .eq('perfil', 'coach-bem-estar')
    .order('email')

  if (error) {
    console.error(error)
    process.exit(1)
  }

  const semSlug = (data || []).filter((r) => !r.user_slug?.trim())
  console.log(`\nModo: ${apply ? 'APLICAR' : 'DRY-RUN (use --apply para gravar)'}`)
  console.log(`Coach de bem-estar sem slug: ${semSlug.length} de ${data?.length ?? 0}\n`)

  if (!semSlug.length) {
    console.log('✅ Nenhuma conta pendente.')
    return
  }

  console.log('\n--- SQL (referência) ---\n')

  for (const row of semSlug) {
    const nome = row.nome_completo?.trim() || ''
    const email = row.email?.trim() || ''
    const slug = await generateAvailableUserSlug(supabaseAdmin, nome, email)

    console.log(`-- ${email} | ${nome}`)
    if (!slug) {
      console.log(`-- ⚠️ não foi possível gerar slug automático\n`)
      continue
    }

    console.log(
      `UPDATE user_profiles SET user_slug = '${slug}', updated_at = NOW() WHERE user_id = '${row.user_id}';`
    )
    console.log(
      `-- Link exemplo: https://www.ylada.com/pt/coach-bem-estar/${slug}/calc-imc\n`
    )

    if (apply) {
      const { error: updErr } = await supabaseAdmin
        .from('user_profiles')
        .update({ user_slug: slug, updated_at: new Date().toISOString() })
        .eq('user_id', row.user_id)

      if (updErr) console.error(`❌ Falha ${email}:`, updErr.message)
      else console.log(`✅ Gravado: ${email} → ${slug}`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
