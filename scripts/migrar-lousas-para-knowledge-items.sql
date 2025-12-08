-- =====================================================
-- MIGRAÇÃO: ylada_wellness_base_conhecimento → knowledge_wellness_items
-- Este script migra os dados das lousas para a tabela de busca semântica
-- e prepara para geração de embeddings
-- =====================================================

BEGIN;

-- =====================================================
-- 1. Mapear categorias de ylada_wellness_base_conhecimento 
--    para knowledge_wellness_items
-- =====================================================
-- ylada_wellness_base_conhecimento.categoria → knowledge_wellness_items.category
-- 'script_vendas' → 'mentor'
-- 'script_bebidas' → 'tecnico'
-- 'script_indicacao' → 'mentor'
-- 'script_recrutamento' → 'mentor'
-- 'script_followup' → 'mentor'
-- 'frase_motivacional' → 'mentor'
-- 'fluxo_padrao' → 'mentor'
-- 'instrucao' → 'suporte'

-- =====================================================
-- 2. Inserir dados na knowledge_wellness_items
-- =====================================================

INSERT INTO knowledge_wellness_items (
  title,
  slug,
  category,
  subcategory,
  tags,
  priority,
  content,
  is_active
)
SELECT 
  -- Título: usar titulo da tabela original
  ybc.titulo as title,
  
  -- Slug: gerar a partir do título (lowercase, espaços viram hífens, usar ID para unicidade)
  LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(ybc.titulo, '[àáâãäå]', 'a', 'gi'),
          '[éêë]', 'e', 'gi'
        ),
        '[íîï]', 'i', 'gi'
      ),
      '[^a-z0-9]+',
      '-',
      'g'
    )
  ) || '-' || SUBSTRING(REPLACE(ybc.id::text, '-', ''), 1, 8) as slug,
  
  -- Category: mapear categoria
  CASE ybc.categoria
    WHEN 'script_vendas' THEN 'mentor'
    WHEN 'script_indicacao' THEN 'mentor'
    WHEN 'script_recrutamento' THEN 'mentor'
    WHEN 'script_followup' THEN 'mentor'
    WHEN 'frase_motivacional' THEN 'mentor'
    WHEN 'fluxo_padrao' THEN 'mentor'
    WHEN 'script_bebidas' THEN 'tecnico'
    WHEN 'instrucao' THEN 'suporte'
    ELSE 'mentor' -- default
  END as category,
  
  -- Subcategory: usar subcategoria original
  ybc.subcategoria as subcategory,
  
  -- Tags: combinar tags + categoria + subcategoria
  ARRAY(
    SELECT DISTINCT unnest(
      COALESCE(ybc.tags, ARRAY[]::TEXT[]) ||
      ARRAY[ybc.categoria] ||
      CASE WHEN ybc.subcategoria IS NOT NULL THEN ARRAY[ybc.subcategoria] ELSE ARRAY[]::TEXT[] END
    )
  ) as tags,
  
  -- Priority: usar prioridade original
  ybc.prioridade as priority,
  
  -- Content: usar conteudo original
  ybc.conteudo as content,
  
  -- Active: usar ativo original
  ybc.ativo as is_active

FROM ylada_wellness_base_conhecimento ybc
WHERE ybc.tipo_mentor = 'noel' -- Apenas conteúdo do NOEL
  AND ybc.ativo = true
  AND NOT EXISTS (
    -- Evitar duplicatas: verificar se já existe item com mesmo título e categoria
    SELECT 1 FROM knowledge_wellness_items kwi
    WHERE kwi.title = ybc.titulo
      AND kwi.category = CASE ybc.categoria
        WHEN 'script_vendas' THEN 'mentor'
        WHEN 'script_indicacao' THEN 'mentor'
        WHEN 'script_recrutamento' THEN 'mentor'
        WHEN 'script_followup' THEN 'mentor'
        WHEN 'frase_motivacional' THEN 'mentor'
        WHEN 'fluxo_padrao' THEN 'mentor'
        WHEN 'script_bebidas' THEN 'tecnico'
        WHEN 'instrucao' THEN 'suporte'
        ELSE 'mentor'
      END
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  tags = EXCLUDED.tags,
  priority = EXCLUDED.priority,
  content = EXCLUDED.content,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- =====================================================
-- 3. Função auxiliar removida - usando slug simples com ID
-- =====================================================

-- =====================================================
-- 4. Estatísticas da migração
-- =====================================================

DO $$
DECLARE
  total_migrados INTEGER;
  total_por_categoria RECORD;
BEGIN
  -- Contar itens migrados
  SELECT COUNT(*) INTO total_migrados
  FROM knowledge_wellness_items
  WHERE created_at >= NOW() - INTERVAL '1 minute';
  
  RAISE NOTICE '✅ Total de itens migrados: %', total_migrados;
  
  -- Mostrar distribuição por categoria
  FOR total_por_categoria IN
    SELECT category, COUNT(*) as quantidade
    FROM knowledge_wellness_items
    WHERE created_at >= NOW() - INTERVAL '1 minute'
    GROUP BY category
    ORDER BY quantidade DESC
  LOOP
    RAISE NOTICE '  - %: % itens', total_por_categoria.category, total_por_categoria.quantidade;
  END LOOP;
END $$;

COMMIT;

-- =====================================================
-- PRÓXIMO PASSO: Gerar embeddings
-- =====================================================
-- Após executar este script, você precisa:
-- 1. Executar a API para gerar embeddings de todos os novos itens
-- 2. Ou usar o script: scripts/gerar-embeddings-knowledge-items.ts
-- =====================================================

