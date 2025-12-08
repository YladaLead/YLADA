/**
 * Script para reprocessar apenas o item sem embedding
 * 
 * Execute: npx tsx scripts/reprocessar-embedding-faltante.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Variáveis de ambiente SUPABASE não configuradas')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Gera embedding usando OpenAI
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erro ao gerar embedding: ${error}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

/**
 * Reprocessa apenas os itens sem embeddings
 */
async function reprocessarFaltantes() {
  console.log('🔍 Buscando itens sem embeddings...')

  // Buscar todos os itens ativos
  const { data: allItems, error: itemsError } = await supabase
    .from('knowledge_wellness_items')
    .select('id, title, content, category')
    .eq('is_active', true)

  if (itemsError || !allItems) {
    console.error('❌ Erro ao buscar itens:', itemsError)
    return
  }

  // Buscar embeddings existentes
  const { data: existingEmbeddings, error: embeddingsError } = await supabase
    .from('knowledge_wellness_embeddings')
    .select('item_id')

  if (embeddingsError) {
    console.error('❌ Erro ao buscar embeddings:', embeddingsError)
    return
  }

  const existingIds = new Set(existingEmbeddings?.map(e => e.item_id) || [])
  const itemsWithoutEmbeddings = allItems.filter(item => !existingIds.has(item.id))

  if (itemsWithoutEmbeddings.length === 0) {
    console.log('✅ Todos os itens já têm embeddings!')
    return
  }

  console.log(`📊 Encontrados ${itemsWithoutEmbeddings.length} itens sem embeddings:`)
  itemsWithoutEmbeddings.forEach(item => {
    console.log(`   - [${item.category}] ${item.title}`)
  })

  let processados = 0
  let erros = 0

  for (const item of itemsWithoutEmbeddings) {
    try {
      console.log(`\n🔄 Processando: [${item.category}] ${item.title.substring(0, 60)}...`)

      // Aguardar um pouco mais para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))

      // Gerar embedding do conteúdo
      const embedding = await generateEmbedding(item.content)

      // Salvar embedding
      const { error: embedError } = await supabase
        .from('knowledge_wellness_embeddings')
        .upsert({
          item_id: item.id,
          embedding_vector: embedding,
        }, {
          onConflict: 'item_id',
        })

      if (embedError) {
        console.error(`❌ Erro ao salvar embedding para ${item.id}:`, embedError)
        erros++
      } else {
        processados++
        console.log(`✅ Embedding gerado e salvo (${processados}/${itemsWithoutEmbeddings.length})`)
      }

    } catch (error: any) {
      console.error(`❌ Erro ao processar item ${item.id}:`, error.message)
      erros++
      
      // Se for erro de rate limiting, aguardar mais tempo
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        console.log('⏳ Rate limit atingido. Aguardando 5 segundos...')
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }

  console.log(`\n✅ Concluído!`)
  console.log(`   - Processados: ${processados}`)
  console.log(`   - Erros: ${erros}`)
  console.log(`   - Total: ${itemsWithoutEmbeddings.length}`)
}

// Executar
reprocessarFaltantes()
  .then(() => {
    console.log('\n🎉 Script finalizado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })

