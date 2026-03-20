#!/usr/bin/env tsx
/**
 * Executa um arquivo SQL de migration no banco Supabase.
 * Requer: DATABASE_URL no .env.local (Connection string do Supabase)
 * Obtenha em: Supabase Dashboard > Project Settings > Database > Connection string (URI)
 */
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

config({ path: join(process.cwd(), '.env.local') })

const migrationFile = process.argv[2] || '235-ylada-templates-biblioteca-nutri-bloco2.sql'
if (!migrationFile.endsWith('.sql')) {
  console.error('❌ Só é possível executar arquivos .sql com este script.')
  console.error('   Exemplo: npx tsx scripts/run-migration.ts migrations/235-exemplo.sql')
  console.error('   Para criar contas de teste (Node.js): node scripts/criar-contas-teste-interno.js')
  process.exit(1)
}
const migrationPath = join(process.cwd(), 'migrations', migrationFile)

async function run() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ DATABASE_URL não encontrada em .env.local')
    console.error('   Obtenha em: Supabase Dashboard > Project Settings > Database > Connection string (URI)')
    process.exit(1)
  }

  const sql = readFileSync(migrationPath, 'utf-8')
  console.log(`📂 Executando: migrations/${migrationFile}`)

  try {
    const { default: pg } = await import('pg')
    const client = new pg.Client({ connectionString: dbUrl })
    await client.connect()
    await client.query(sql)
    await client.end()
    console.log('✅ Migration executada com sucesso!')
  } catch (err: unknown) {
    console.error('❌ Erro:', (err as Error).message)
    process.exit(1)
  }
}

run()
