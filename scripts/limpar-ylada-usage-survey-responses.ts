/**
 * Remove todas as linhas de ylada_usage_survey_responses (pesquisa /pt/pesquisa-uso-ylada).
 * Usa SUPABASE_SERVICE_ROLE_KEY do .env.local — apaga no projeto apontado por NEXT_PUBLIC_SUPABASE_URL.
 *
 * Uso: npx tsx scripts/limpar-ylada-usage-survey-responses.ts
 */
import { config } from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: path.resolve(process.cwd(), '.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}

const sb = createClient(url, key, { auth: { persistSession: false } })

async function main() {
  const { data, error } = await sb
    .from('ylada_usage_survey_responses')
    .delete()
    .gte('created_at', '1970-01-01T00:00:00.000Z')
    .select('id')

  if (error) {
    console.error('Erro Supabase:', error.message)
    process.exit(1)
  }
  const n = data?.length ?? 0
  console.log(`Removidas ${n} linha(s) de ylada_usage_survey_responses.`)
}

main()
