-- ============================================
-- ELIMINAR DUPLICATAS NA ÁREA WELLNESS
-- Mantém o template mais antigo (menor ID), elimina os demais
-- ============================================

-- ATENÇÃO: Execute primeiro a query de verificação para ver o que será eliminado!

-- 1. Ver o que será eliminado (antes de deletar)
WITH duplicatas AS (
  SELECT 
    LOWER(TRIM(name)) as nome_normalizado,
    MIN(id) as id_manter,
    COUNT(*) as total
  FROM templates_nutrition
  WHERE profession = 'wellness' 
    AND language = 'pt'
    AND is_active = true
  GROUP BY LOWER(TRIM(name))
  HAVING COUNT(*) > 1
)
SELECT 
  t.id as id_eliminar,
  t.name as nome_eliminar,
  t.type,
  t.created_at,
  d.id_manter as id_manter,
  d.total as total_duplicatas
FROM templates_nutrition t
INNER JOIN duplicatas d ON LOWER(TRIM(t.name)) = d.nome_normalizado
WHERE t.profession = 'wellness' 
  AND t.language = 'pt'
  AND t.is_active = true
  AND t.id != d.id_manter
ORDER BY t.name, t.created_at;

-- 2. ELIMINAR DUPLICATAS (descomente após revisar a query acima)
-- Descomente as linhas abaixo apenas após verificar o que será eliminado:

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

-- 3. Verificar resultado após eliminação
SELECT 
  LOWER(TRIM(name)) as nome_normalizado,
  COUNT(*) as quantidade
FROM templates_nutrition
WHERE profession = 'wellness' 
  AND language = 'pt'
  AND is_active = true
GROUP BY LOWER(TRIM(name))
HAVING COUNT(*) > 1;
-- Se esta query retornar 0 linhas, todas as duplicatas foram eliminadas!

