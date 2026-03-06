#!/usr/bin/env tsx
/**
 * Verifica duplicatas em ylada_biblioteca_itens.
 * Requer: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local
 */
import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: join(process.cwd(), '.env.local') })

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessários em .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, key)
  const { data: itens, error } = await supabase
    .from('ylada_biblioteca_itens')
    .select('id, titulo, tipo, template_id, sort_order, created_at')
    .eq('active', true)
    .order('titulo')

  if (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }

  const byKey = new Map<string, typeof itens>()
  for (const item of itens ?? []) {
    const chave = `${item.titulo}|${item.tipo}|${item.template_id ?? 'null'}`
    if (!byKey.has(chave)) byKey.set(chave, [])
    byKey.get(chave)!.push(item)
  }

  const duplicatas = [...byKey.entries()].filter(([, lista]) => lista.length > 1)

  console.log(`\n📊 Total de itens ativos: ${itens?.length ?? 0}`)
  console.log(`📋 Grupos com duplicata: ${duplicatas.length}\n`)

  if (duplicatas.length === 0) {
    console.log('✅ Nenhuma duplicata encontrada.\n')
    return
  }

  console.log('⚠️ Duplicatas encontradas:\n')
  for (const [chave, lista] of duplicatas) {
    const [titulo, tipo] = chave.split('|')
    console.log(`  • ${titulo} (${tipo}) — ${lista.length} cópias`)
    for (const i of lista) {
      console.log(`    - id: ${i.id}, template_id: ${i.template_id ?? 'null'}`)
    }
    console.log('')
  }
}

run()
