-- ============================================
-- FUNÇÃO PARA BUSCA POR SIMILARIDADE (pgvector)
-- ============================================

-- Verificar se a extensão pgvector está instalada
CREATE EXTENSION IF NOT EXISTS vector;

-- Função para buscar conhecimento por similaridade
CREATE OR REPLACE FUNCTION match_wellness_knowledge(
  query_embedding vector(1536),
  match_category TEXT DEFAULT NULL,
  match_threshold NUMERIC DEFAULT 0.5,
  match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  item_id UUID,
  similarity NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.item_id,
    1 - (e.embedding_vector <=> query_embedding) AS similarity
  FROM knowledge_wellness_embeddings e
  INNER JOIN knowledge_wellness_items k ON k.id = e.item_id
  WHERE
    k.is_active = true
    AND (match_category IS NULL OR k.category = match_category)
    AND (1 - (e.embedding_vector <=> query_embedding)) >= match_threshold
  ORDER BY e.embedding_vector <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Comentário
COMMENT ON FUNCTION match_wellness_knowledge IS 'Busca itens da base de conhecimento por similaridade usando embeddings';

