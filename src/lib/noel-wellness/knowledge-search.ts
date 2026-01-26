/**
 * NOEL WELLNESS - Busca na Base de Conhecimento
 * 
 * Busca por similaridade usando embeddings
 * Retorna resultados ordenados por relevância
 */

import { supabaseAdmin } from '@/lib/supabase'
import type { NoelModule } from './classifier'
import { getCachedEmbedding, cacheEmbedding } from '@/lib/embedding-cache'

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
 * ⚡ OTIMIZAÇÃO: Usa cache para evitar gerar embeddings duplicados (economia 60-80%)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // 1. Verificar cache primeiro
  const cached = getCachedEmbedding(text)
  if (cached) {
    return cached
  }

  // 2. Se não estiver em cache, gerar novo embedding
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
  const embedding = data.data[0].embedding

  // 3. Salvar no cache para próximas vezes
  cacheEmbedding(text, embedding)

  return embedding
}

/**
 * Busca na base de conhecimento por similaridade
 * ⚡ OTIMIZAÇÃO: Aceita embedding pré-gerado para reutilização (economia 66%)
 */
export async function searchKnowledgeBase(
  query: string,
  module: NoelModule,
  limit: number = 5,
  queryEmbedding?: number[] // Embedding opcional para reutilização
): Promise<SearchResult> {
  try {
    // Gerar embedding da query (ou usar o fornecido)
    const embedding = queryEmbedding || await generateEmbedding(query)

    // Buscar por similaridade usando pgvector
    // Similaridade cosseno: 1 = idêntico, 0 = sem relação
    // IMPORTANTE: Buscar em todas as categorias primeiro, depois filtrar por módulo se necessário
    const { data: embeddings, error } = await supabaseAdmin.rpc(
      'match_wellness_knowledge',
      {
        query_embedding: embedding,
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

/**
 * Busca sugestões de aprendizado que podem ser usadas automaticamente
 * Retorna sugestões aprovadas ou com frequência >= 3 (threshold para auto-aprovação)
 */
export async function searchLearningSuggestions(
  query: string,
  module: NoelModule,
  autoApproveThreshold: number = 3
): Promise<{ suggestion: any; similarity: number } | null> {
  try {
    const lowerQuery = query.toLowerCase().trim()
    
    // Buscar sugestões aprovadas ou com frequência alta
    const { data: suggestions, error } = await supabaseAdmin
      .from('wellness_learning_suggestions')
      .select('*')
      .or(`approved.eq.true,and(approved.is.null,frequency.gte.${autoApproveThreshold})`)
      .eq('suggested_category', module)
      .order('frequency', { ascending: false })
      .order('last_seen_at', { ascending: false })
      .limit(10)

    if (error || !suggestions || suggestions.length === 0) {
      return null
    }

    // Calcular similaridade simples entre query e sugestões
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2)
    
    let bestMatch: any = null
    let bestSimilarity = 0

    for (const suggestion of suggestions) {
      const suggestionText = `${suggestion.query} ${suggestion.suggested_response}`.toLowerCase()
      let score = 0
      
      // Contar palavras da query que aparecem na sugestão
      for (const word of queryWords) {
        if (suggestionText.includes(word)) {
          score += 1
        }
      }
      
      // Bonus se query exata ou muito similar
      if (suggestion.query.toLowerCase().includes(lowerQuery) || lowerQuery.includes(suggestion.query.toLowerCase())) {
        score += 3
      }
      
      // Normalizar score (0-1)
      const similarity = Math.min(1, score / Math.max(1, queryWords.length + 3))
      
      if (similarity > bestSimilarity && similarity >= 0.5) { // Threshold mínimo de 50%
        bestSimilarity = similarity
        bestMatch = suggestion
      }
    }

    if (bestMatch) {
      console.log(`✅ [Auto-Learning] Encontrada sugestão com similaridade ${(bestSimilarity * 100).toFixed(1)}%`)
      return { suggestion: bestMatch, similarity: bestSimilarity }
    }

    return null
  } catch (error: any) {
    console.error('❌ Erro ao buscar sugestões de aprendizado:', error)
    return null
  }
}

/**
 * Adiciona automaticamente uma sugestão à base de conhecimento
 * Chamado quando frequência >= threshold (padrão: 3)
 */
export async function autoAddSuggestionToKnowledgeBase(
  suggestionId: string,
  module: NoelModule
): Promise<{ success: boolean; itemId?: string; error?: string }> {
  try {
    // Buscar sugestão
    const { data: suggestion, error: fetchError } = await supabaseAdmin
      .from('wellness_learning_suggestions')
      .select('*')
      .eq('id', suggestionId)
      .single()

    if (fetchError || !suggestion) {
      return { success: false, error: 'Sugestão não encontrada' }
    }

    // Verificar se já foi adicionada (evitar duplicatas)
    if (suggestion.approved === true) {
      console.log('ℹ️ [Auto-Learning] Sugestão já foi aprovada anteriormente')
      return { success: false, error: 'Já foi adicionada' }
    }

    // Gerar slug único
    const slugBase = suggestion.query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50)
    
    const slug = `auto-learned-${slugBase}-${Date.now()}`

    // Extrair título da query (primeiras palavras)
    const title = suggestion.query.length > 60 
      ? suggestion.query.substring(0, 60) + '...'
      : suggestion.query

    // Adicionar à base de conhecimento
    // Nota: campos metadata e source podem não existir, então usar apenas campos obrigatórios
    const insertData: any = {
      title: title,
      slug: slug,
      category: module,
      subcategory: 'auto_learned',
      tags: ['auto_learned', `freq_${suggestion.frequency}`],
      priority: 5, // Prioridade média
      content: suggestion.suggested_response,
      is_active: true,
    }
    
    // Adicionar campos opcionais se a tabela suportar
    const { data: newItem, error: insertError } = await supabaseAdmin
      .from('knowledge_wellness_items')
      .insert(insertData)
      .select()
      .single()

    if (insertError || !newItem) {
      console.error('❌ Erro ao adicionar à base:', insertError)
      return { success: false, error: insertError?.message || 'Erro ao inserir' }
    }

    // Gerar e salvar embedding
    try {
      await saveItemEmbedding(newItem.id, suggestion.suggested_response)
    } catch (embeddingError) {
      console.warn('⚠️ Erro ao gerar embedding (não crítico):', embeddingError)
      // Continuar mesmo se embedding falhar
    }

    // Marcar sugestão como aprovada automaticamente
    await supabaseAdmin
      .from('wellness_learning_suggestions')
      .update({
        approved: true,
        approved_at: new Date().toISOString(),
      })
      .eq('id', suggestionId)

    console.log(`✅ [Auto-Learning] Sugestão adicionada automaticamente à base (ID: ${newItem.id})`)
    
    return { success: true, itemId: newItem.id }
  } catch (error: any) {
    console.error('❌ Erro ao adicionar sugestão automaticamente:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Verifica e processa sugestões que devem ser adicionadas automaticamente
 * Chamado antes de buscar na base de conhecimento
 */
export async function processAutoLearning(
  query: string,
  module: NoelModule
): Promise<KnowledgeItem | null> {
  try {
    // 1. Buscar sugestões que podem ser usadas
    const suggestionResult = await searchLearningSuggestions(query, module, 3)
    
    if (!suggestionResult) {
      return null
    }

    const { suggestion, similarity } = suggestionResult

    // 2. Se frequência >= 3 e ainda não foi adicionada, adicionar automaticamente
    if (suggestion.frequency >= 3 && suggestion.approved !== true) {
      console.log(`🤖 [Auto-Learning] Adicionando automaticamente (frequência: ${suggestion.frequency})`)
      
      const addResult = await autoAddSuggestionToKnowledgeBase(suggestion.id, module)
      
      if (addResult.success && addResult.itemId) {
        // Retornar como KnowledgeItem para uso imediato
        return {
          id: addResult.itemId,
          title: suggestion.query.length > 60 
            ? suggestion.query.substring(0, 60) + '...'
            : suggestion.query,
          slug: `auto-learned-${suggestion.id}`,
          category: module,
          subcategory: 'auto_learned',
          tags: ['auto_learned'],
          priority: 5,
          content: suggestion.suggested_response,
          similarity: similarity,
        }
      }
    }

    // 3. Se já foi aprovada, tentar buscar item na base de conhecimento
    // (pode ter sido adicionado manualmente pelo admin)
    if (suggestion.approved === true && similarity >= 0.7) {
      // Buscar por slug ou título similar
      const searchTitle = suggestion.query.length > 60 
        ? suggestion.query.substring(0, 60)
        : suggestion.query
      
      const { data: items } = await supabaseAdmin
        .from('knowledge_wellness_items')
        .select('*')
        .eq('is_active', true)
        .or(`title.ilike.%${searchTitle}%,content.ilike.%${suggestion.query.substring(0, 30)}%`)
        .limit(1)

      if (items && items.length > 0) {
        const item = items[0]
        return {
          id: item.id,
          title: item.title,
          slug: item.slug,
          category: item.category,
          subcategory: item.subcategory,
          tags: item.tags || [],
          priority: item.priority,
          content: item.content,
          similarity: similarity,
        }
      }
    }

    // 4. Se similaridade alta mas ainda não adicionada, usar resposta da sugestão diretamente
    if (similarity >= 0.7) {
      return {
        id: `suggestion-${suggestion.id}`,
        title: suggestion.query,
        slug: `suggestion-${suggestion.id}`,
        category: module,
        subcategory: 'learning_suggestion',
        tags: ['learning_suggestion'],
        priority: 4,
        content: suggestion.suggested_response,
        similarity: similarity,
      }
    }

    return null
  } catch (error: any) {
    console.error('❌ Erro ao processar auto-learning:', error)
    return null
  }
}

