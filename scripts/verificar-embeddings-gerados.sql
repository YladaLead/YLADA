-- =====================================================
-- Script para verificar status dos embeddings
-- =====================================================

-- Total de itens ativos
SELECT 
  'Total de itens ativos' as descricao,
  COUNT(*) as quantidade
FROM knowledge_wellness_items
WHERE is_active = true;

-- Total de embeddings gerados
SELECT 
  'Total de embeddings' as descricao,
  COUNT(*) as quantidade
FROM knowledge_wellness_embeddings;

-- Itens sem embeddings
SELECT 
  'Itens sem embeddings' as descricao,
  COUNT(*) as quantidade
FROM knowledge_wellness_items kwi
LEFT JOIN knowledge_wellness_embeddings kwe ON kwe.item_id = kwi.id
WHERE kwi.is_active = true AND kwe.id IS NULL;

-- Distribuição por categoria
SELECT 
  kwi.category,
  COUNT(*) as total_itens,
  COUNT(kwe.id) as com_embeddings,
  COUNT(*) - COUNT(kwe.id) as sem_embeddings
FROM knowledge_wellness_items kwi
LEFT JOIN knowledge_wellness_embeddings kwe ON kwe.item_id = kwi.id
WHERE kwi.is_active = true
GROUP BY kwi.category
ORDER BY total_itens DESC;

