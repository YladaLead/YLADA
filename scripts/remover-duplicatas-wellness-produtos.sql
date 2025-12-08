-- =====================================================
-- REMOVER DUPLICATAS DE wellness_produtos
-- Mantém o produto mais antigo (menor ID), elimina os demais
-- =====================================================

-- ATENÇÃO: Execute primeiro o script de verificação para ver o que será eliminado!

-- 1. VER O QUE SERÁ ELIMINADO (antes de deletar)
WITH duplicatas AS (
  SELECT 
    LOWER(TRIM(nome)) as nome_normalizado,
    COUNT(*) as total
  FROM wellness_produtos
  WHERE ativo = true
  GROUP BY LOWER(TRIM(nome))
  HAVING COUNT(*) > 1
),
produtos_manter AS (
  SELECT DISTINCT ON (LOWER(TRIM(nome)))
    id as id_manter,
    LOWER(TRIM(nome)) as nome_normalizado
  FROM wellness_produtos
  WHERE ativo = true
  ORDER BY LOWER(TRIM(nome)), created_at ASC
)
SELECT 
  p.id as id_eliminar,
  p.nome as nome_eliminar,
  p.categoria,
  p.tipo,
  p.pv,
  p.created_at,
  pm.id_manter,
  d.total as total_duplicatas
FROM wellness_produtos p
INNER JOIN duplicatas d ON LOWER(TRIM(p.nome)) = d.nome_normalizado
INNER JOIN produtos_manter pm ON LOWER(TRIM(p.nome)) = pm.nome_normalizado
WHERE p.ativo = true
  AND p.id != pm.id_manter
ORDER BY p.nome, p.created_at;

-- 2. ELIMINAR DUPLICATAS (mantém o mais antigo baseado em created_at)
-- ⚠️ ATENÇÃO: Esta query vai DELETAR 54 produtos duplicados!
-- Execute apenas após revisar a query 1 acima

WITH produtos_manter AS (
  SELECT DISTINCT ON (LOWER(TRIM(nome)))
    id as id_manter,
    LOWER(TRIM(nome)) as nome_normalizado
  FROM wellness_produtos
  WHERE ativo = true
  ORDER BY LOWER(TRIM(nome)), created_at ASC
),
duplicatas AS (
  SELECT 
    LOWER(TRIM(nome)) as nome_normalizado,
    COUNT(*) as total
  FROM wellness_produtos
  WHERE ativo = true
  GROUP BY LOWER(TRIM(nome))
  HAVING COUNT(*) > 1
)
DELETE FROM wellness_produtos
WHERE id IN (
  SELECT p.id
  FROM wellness_produtos p
  INNER JOIN duplicatas d ON LOWER(TRIM(p.nome)) = d.nome_normalizado
  INNER JOIN produtos_manter pm ON LOWER(TRIM(p.nome)) = pm.nome_normalizado
  WHERE p.ativo = true
    AND p.id != pm.id_manter
);

-- 3. VERIFICAR RESULTADO APÓS ELIMINAÇÃO
SELECT 
  categoria,
  COUNT(*) as total,
  SUM(pv) as pv_total
FROM wellness_produtos
WHERE ativo = true
GROUP BY categoria
ORDER BY categoria;

-- 4. VERIFICAR SE AINDA HÁ DUPLICATAS
SELECT 
  LOWER(TRIM(nome)) as nome_normalizado,
  COUNT(*) as quantidade
FROM wellness_produtos
WHERE ativo = true
GROUP BY LOWER(TRIM(nome))
HAVING COUNT(*) > 1;
-- Se esta query retornar 0 linhas, todas as duplicatas foram eliminadas!

-- 5. ADICIONAR ÍNDICE UNIQUE PARA PREVENIR FUTURAS DUPLICATAS
DO $$ 
BEGIN
  -- Verificar se índice único já existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_wellness_produtos_nome_unique'
  ) THEN
    -- Criar índice único funcional (case-insensitive)
    CREATE UNIQUE INDEX idx_wellness_produtos_nome_unique 
    ON wellness_produtos (LOWER(TRIM(nome)))
    WHERE ativo = true;
    
    RAISE NOTICE 'Índice UNIQUE criado com sucesso';
  ELSE
    RAISE NOTICE 'Índice UNIQUE já existe';
  END IF;
END $$;

-- 6. VERIFICAR CONTAGEM FINAL ESPERADA
-- Esperado após limpeza:
-- - bebida_funcional: 12 produtos
-- - produto_fechado: 12 produtos
-- - kit: 3 produtos
-- Total: 27 produtos únicos

SELECT 
  'ESPERADO' as tipo,
  categoria,
  CASE 
    WHEN categoria = 'bebida_funcional' THEN 12
    WHEN categoria = 'produto_fechado' THEN 12
    WHEN categoria = 'kit' THEN 3
    ELSE 0
  END as esperado,
  COUNT(*) as atual
FROM wellness_produtos
WHERE ativo = true
GROUP BY categoria
ORDER BY categoria;



