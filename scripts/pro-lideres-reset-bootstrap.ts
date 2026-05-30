/**
 * Copia vídeo/textos da HOM para Reset Metabólico nos tenants que ainda não têm config.
 * Pré-requisito: rodar migrations/442-pro-lideres-reset-config.sql no Supabase.
 *
 * Uso: npx tsx scripts/pro-lideres-reset-bootstrap.ts
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import {
  PRO_LIDERES_RESET_DEFAULT_DESCRIPTION,
  PRO_LIDERES_RESET_DEFAULT_HEADLINE,
  PRO_LIDERES_RESET_DEFAULT_SUBHEADLINE,
  PRO_LIDERES_RESET_DEFAULT_VIDEO_URL,
} from '../src/lib/pro-lideres-reset-content'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  const { data: homRows, error: homErr } = await admin.from('prolider_hom_config').select('*')
  if (homErr) {
    if (homErr.code === 'PGRST205') {
      console.error('Tabela prolider_hom_config não encontrada.')
    } else {
      console.error('Erro HOM:', homErr.message)
    }
    process.exit(1)
  }

  const { data: resetRows, error: resetErr } = await admin.from('prolider_reset_config').select('tenant_id')
  if (resetErr) {
    if (resetErr.code === 'PGRST205') {
      console.error(
        '\n⚠️  Tabela prolider_reset_config ainda não existe.\n' +
          '   Rode no Supabase SQL Editor: migrations/442-pro-lideres-reset-config.sql\n'
      )
      process.exit(1)
    }
    console.error('Erro reset:', resetErr.message)
    process.exit(1)
  }

  const existing = new Set((resetRows ?? []).map((r) => r.tenant_id as string))
  let created = 0

  for (const hom of homRows ?? []) {
    const tenantId = hom.tenant_id as string
    if (existing.has(tenantId)) continue

    const { error } = await admin.from('prolider_reset_config').insert({
      tenant_id: tenantId,
      video_url: PRO_LIDERES_RESET_DEFAULT_VIDEO_URL,
      headline: PRO_LIDERES_RESET_DEFAULT_HEADLINE,
      subheadline: PRO_LIDERES_RESET_DEFAULT_SUBHEADLINE,
      description: PRO_LIDERES_RESET_DEFAULT_DESCRIPTION,
    })
    if (error) {
      console.warn(`  ❌ tenant ${tenantId.slice(0, 8)}…: ${error.message}`)
    } else {
      console.log(`  ✅ Reset config criada — ${tenantId.slice(0, 8)}…`)
      created++
    }
  }

  console.log(`\nConcluído: ${created} tenant(s) com config Reset Metabólico.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
