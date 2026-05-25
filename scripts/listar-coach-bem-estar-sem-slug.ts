/**
 * Lista contas Coach de bem-estar sem user_slug (somente leitura).
 * Uso: npx tsx scripts/listar-coach-bem-estar-sem-slug.ts
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

async function main() {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, email, nome_completo, user_slug, perfil, updated_at')
    .eq('perfil', 'coach-bem-estar')
    .order('email')

  if (error) {
    console.error(error)
    process.exit(1)
  }

  const rows = data || []
  const semSlug = rows.filter((r) => !r.user_slug?.trim())

  console.log(`\nTotal coach-bem-estar: ${rows.length}`)
  console.log(`Sem user_slug: ${semSlug.length}\n`)

  for (const r of rows) {
    const slug = r.user_slug?.trim() || '(vazio)'
    console.log(`${slug.padEnd(24)} | ${r.email} | ${r.nome_completo || '-'}`)
  }

  if (semSlug.length) {
    console.log('\n--- Precisam de slug ---')
    for (const r of semSlug) {
      console.log(`  ${r.user_id} | ${r.email} | ${r.nome_completo || '-'}`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
