-- ============================================
-- Script de Verificação da Base de Conhecimento NOEL
-- ============================================
-- Execute este script no Supabase SQL Editor para verificar o estado atual

-- 1. Verificar se as tabelas existem
SELECT 
  'knowledge_wellness_items' as tabela,
  COUNT(*) as total_registros,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM knowledge_wellness_items

UNION ALL

SELECT 
  'knowledge_wellness_embeddings' as tabela,
  COUNT(*) as total_registros,
  COUNT(*) as ativos,
  0 as inativos
FROM knowledge_wellness_embeddings;

-- 2. Verificar distribuição por categoria
SELECT 
  category,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  AVG(priority) as prioridade_media
FROM knowledge_wellness_items
GROUP BY category
ORDER BY total DESC;

-- 3. Verificar se há embeddings para os itens
SELECT 
  ki.id,
  ki.title,
  ki.category,
  CASE WHEN ke.id IS NOT NULL THEN '✅' ELSE '❌' END as tem_embedding
FROM knowledge_wellness_items ki
LEFT JOIN knowledge_wellness_embeddings ke ON ke.item_id = ki.id
WHERE ki.is_active = true
ORDER BY ki.category, ki.title
LIMIT 20;

-- 4. Verificar se a função de busca existe
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'match_wellness_knowledge';

-- 5. Verificar extensão pgvector
SELECT 
  extname,
  extversion
FROM pg_extension
WHERE extname = 'vector';

-- 6. Estatísticas de uso (se houver tabela de queries)
SELECT 
  source_type,
  COUNT(*) as total,
  AVG(similarity_score) as similaridade_media,
  COUNT(*) FILTER (WHERE similarity_score >= 0.8) as alta_similaridade,
  COUNT(*) FILTER (WHERE similarity_score = 0) as sem_similaridade
FROM wellness_user_queries
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY source_type;

-- 7. Top 10 perguntas sem similaridade (últimos 7 dias)
SELECT 
  query,
  COUNT(*) as frequencia,
  MAX(created_at) as ultima_vez
FROM wellness_user_queries
WHERE similarity_score = 0
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY query
ORDER BY frequencia DESC
LIMIT 10;

