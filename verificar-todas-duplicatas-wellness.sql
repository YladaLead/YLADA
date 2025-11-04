-- ============================================
-- VERIFICAR TODAS AS DUPLICATAS NA ÁREA WELLNESS
-- Tabela: templates_nutrition (profession='wellness')
-- ============================================

-- 1. RESUMO: Templates com nomes idênticos (case-insensitive)
SELECT 
  LOWER(TRIM(name)) as nome_normalizado,
  COUNT(*) as quantidade,
  STRING_AGG(id::text, ', ' ORDER BY created_at) as ids,
  STRING_AGG(name, ' | ' ORDER BY created_at) as nomes,
  STRING_AGG(created_at::text, ' | ' ORDER BY created_at) as datas_criacao
FROM templates_nutrition
WHERE profession = 'wellness' 
  AND language = 'pt'
  AND is_active = true
GROUP BY LOWER(TRIM(name))
HAVING COUNT(*) > 1
ORDER BY quantidade DESC, nome_normalizado;

-- 2. DETALHES COMPLETOS: Informações de cada duplicata
WITH duplicatas AS (
  SELECT 
    LOWER(TRIM(name)) as nome_normalizado,
    COUNT(*) as quantidade
  FROM templates_nutrition
  WHERE profession = 'wellness' 
    AND language = 'pt'
    AND is_active = true
  GROUP BY LOWER(TRIM(name))
  HAVING COUNT(*) > 1
)
SELECT 
  t.id,
  t.name,
  t.type,
  t.specialization,
  LEFT(t.description, 50) as descricao_preview,
  t.created_at,
  t.updated_at,
  d.quantidade as total_duplicatas,
  CASE 
    WHEN t.id = (SELECT MIN(t2.id) FROM templates_nutrition t2 WHERE LOWER(TRIM(t2.name)) = d.nome_normalizado AND t2.profession = 'wellness' AND t2.language = 'pt' AND t2.is_active = true) 
    THEN 'MANTER (mais antigo)'
    ELSE 'ELIMINAR'
  END as acao
FROM templates_nutrition t
INNER JOIN duplicatas d ON LOWER(TRIM(t.name)) = d.nome_normalizado
WHERE t.profession = 'wellness' 
  AND t.language = 'pt'
  AND t.is_active = true
ORDER BY LOWER(TRIM(t.name)), t.created_at;

-- 3. SCRIPT PARA ELIMINAR DUPLICATAS (manter o mais antigo, eliminar os demais)
-- ATENÇÃO: Execute apenas após revisar a query 2 acima!
/*
WITH duplicatas AS (
  SELECT 
    LOWER(TRIM(name)) as nome_normalizado,
    MIN(id) as id_manter
  FROM templates_nutrition
  WHERE profession = 'wellness' 
    AND language = 'pt'
    AND is_active = true
  GROUP BY LOWER(TRIM(name))
  HAVING COUNT(*) > 1
)
DELETE FROM templates_nutrition
WHERE id IN (
  SELECT t.id
  FROM templates_nutrition t
  INNER JOIN duplicatas d ON LOWER(TRIM(t.name)) = d.nome_normalizado
  WHERE t.profession = 'wellness' 
    AND t.language = 'pt'
    AND t.is_active = true
    AND t.id != d.id_manter
);
*/
