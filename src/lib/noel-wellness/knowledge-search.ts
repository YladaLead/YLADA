/**
 * NOEL WELLNESS - Busca na Base de Conhecimento
 * 
 * Busca por similaridade usando embeddings
 * Retorna resultados ordenados por relevância
 */

import { supabaseAdmin } from '@/lib/supabase'
import type { NoelModule } from './classifier'

export interface KnowledgeItem {
  id: string
  title: string
  slug: string
  category: string
  subcategory: string | null
  tags: string[]
  priority: number
  content: string
  similarity?: number
}

export interface SearchResult {
  items: KnowledgeItem[]
  bestMatch: KnowledgeItem | null
  similarityScore: number
}

/**
 * Gera embedding do texto usando OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
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
 * Busca na base de conhecimento por similaridade
 */
export async function searchKnowledgeBase(
  query: string,
  module: NoelModule,
  limit: number = 5
): Promise<SearchResult> {
  try {
    // Gerar embedding da query
    const queryEmbedding = await generateEmbedding(query)

    // Buscar por similaridade usando pgvector
    // Similaridade cosseno: 1 = idêntico, 0 = sem relação
    // IMPORTANTE: Buscar em todas as categorias primeiro, depois filtrar por módulo se necessário
    const { data: embeddings, error } = await supabaseAdmin.rpc(
      'match_wellness_knowledge',
      {
        query_embedding: queryEmbedding,
        match_category: null, // Buscar em TODAS as categorias primeiro (não restringir)
        match_threshold: 0.4, // Reduzir threshold para 40% (mais permissivo)
        match_count: limit * 2, // Buscar mais resultados para depois filtrar
      }
    )

    if (error) {
      console.error('❌ Erro ao buscar embeddings:', error)
      
      // Fallback: busca por texto simples
      return await searchKnowledgeBaseFallback(query, module, limit)
    }

    if (!embeddings || embeddings.length === 0) {
      return {
        items: [],
        bestMatch: null,
        similarityScore: 0,
      }
    }

    // Buscar os itens completos
    const itemIds = embeddings.map((e: any) => e.item_id)
    const { data: items, error: itemsError } = await supabaseAdmin
      .from('knowledge_wellness_items')
      .select('*')
      .in('id', itemIds)
      .eq('is_active', true)
      .order('priority', { ascending: false })

    if (itemsError || !items) {
      console.error('❌ Erro ao buscar itens:', itemsError)
      return {
        items: [],
        bestMatch: null,
        similarityScore: 0,
      }
    }

    // Combinar com scores de similaridade
    const itemsWithScores: KnowledgeItem[] = items.map((item: any) => {
      const embedding = embeddings.find((e: any) => e.item_id === item.id)
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        category: item.category,
        subcategory: item.subcategory,
        tags: item.tags || [],
        priority: item.priority,
        content: item.content,
        similarity: embedding?.similarity || 0,
      }
    })

    // Ordenar por similaridade (maior primeiro), depois por prioridade
    itemsWithScores.sort((a, b) => {
      const simDiff = (b.similarity || 0) - (a.similarity || 0)
      if (Math.abs(simDiff) > 0.05) return simDiff // Se diferença > 5%, ordenar por similaridade
      return (b.priority || 5) - (a.priority || 5) // Senão, ordenar por prioridade
    })

    // Priorizar itens da categoria do módulo detectado, mas não excluir outros
    const itemsFromModule = itemsWithScores.filter(item => item.category === module)
    const itemsFromOtherModules = itemsWithScores.filter(item => item.category !== module)
    
    // Combinar: primeiro itens do módulo, depois outros (mas mantendo ordem por similaridade)
    const reorderedItems = [...itemsFromModule, ...itemsFromOtherModules].slice(0, limit)

    const bestMatch = reorderedItems[0] || null
    const similarityScore = bestMatch?.similarity || 0

    return {
      items: reorderedItems,
      bestMatch,
      similarityScore,
    }
  } catch (error: any) {
    console.error('❌ Erro na busca de conhecimento:', error)
    
    // Fallback para busca por texto
    return await searchKnowledgeBaseFallback(query, module, limit)
  }
}

/**
 * Fallback: busca por texto simples (sem embeddings)
 */
async function searchKnowledgeBaseFallback(
  query: string,
  module: NoelModule,
  limit: number
): Promise<SearchResult> {
  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2)

  const { data: items, error } = await supabaseAdmin
    .from('knowledge_wellness_items')
    .select('*')
    .eq('category', module)
    .eq('is_active', true)
    .order('priority', { ascending: false })
    .limit(limit * 2) // buscar mais para filtrar depois

  if (error || !items) {
    return {
      items: [],
      bestMatch: null,
      similarityScore: 0,
    }
  }

  // Calcular score simples baseado em palavras-chave
  const itemsWithScores: KnowledgeItem[] = items.map((item: any) => {
    const itemText = `${item.title} ${item.content} ${(item.tags || []).join(' ')}`.toLowerCase()
    let score = 0
    
    // Contar palavras da query que aparecem no item
    for (const word of queryWords) {
      if (itemText.includes(word)) {
        score += 1
      }
    }
    
    // Bonus se título contém palavras da query
    if (item.title.toLowerCase().includes(lowerQuery)) {
      score += 2
    }
    
    // Normalizar score (0-1)
    const similarity = Math.min(1, score / Math.max(1, queryWords.length + 2))
    
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      subcategory: item.subcategory,
      tags: item.tags || [],
      priority: item.priority,
      content: item.content,
      similarity,
    }
  })

  // Filtrar e ordenar
  const filtered = itemsWithScores
    .filter(item => (item.similarity || 0) > 0.3)
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
    .slice(0, limit)

  const bestMatch = filtered[0] || null
  const similarityScore = bestMatch?.similarity || 0

  return {
    items: filtered,
    bestMatch,
    similarityScore,
  }
}

/**
 * Salva embedding de um item na base de conhecimento
 */
export async function saveItemEmbedding(itemId: string, content: string): Promise<void> {
  try {
    const embedding = await generateEmbedding(content)

  const { error } = await supabaseAdmin
      .from('knowledge_wellness_embeddings')
      .upsert({
        item_id: itemId,
        embedding_vector: embedding,
      }, {
        onConflict: 'item_id',
      })

    if (error) {
      console.error('❌ Erro ao salvar embedding:', error)
      throw error
    }

    console.log('✅ Embedding salvo para item:', itemId)
  } catch (error: any) {
    console.error('❌ Erro ao gerar/salvar embedding:', error)
    throw error
  }
}

