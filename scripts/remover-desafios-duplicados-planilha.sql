-- ============================================
-- REMOVER DESAFIOS DUPLICADOS (VERSÕES PLANILHA)
-- Remove as versões antigas que estão como planilha
-- Mantém apenas as versões como quiz
-- ============================================

-- 1. VERIFICAR ANTES DE REMOVER
SELECT 
  'ANTES' as etapa,
  type as tipo,
  name as nome,
  slug,
  is_active,
  id,
  created_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    (name LIKE '%Desafio 21 Dias%' OR slug = 'desafio-21-dias')
    OR (name LIKE '%Desafio 7 Dias%' OR slug = 'desafio-7-dias')
  )
ORDER BY type, name;

-- 2. DESATIVAR VERSÕES PLANILHA DOS DESAFIOS
-- (Manter as versões quiz ativas)
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (
    (name LIKE '%Desafio 21 Dias%' OR slug = 'desafio-21-dias')
    OR (name LIKE '%Desafio 7 Dias%' OR slug = 'desafio-7-dias')
  );

-- 3. VERIFICAR DEPOIS
SELECT 
  'DEPOIS' as etapa,
  type as tipo,
  name as nome,
  slug,
  is_active,
  id,
  created_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    (name LIKE '%Desafio 21 Dias%' OR slug = 'desafio-21-dias')
    OR (name LIKE '%Desafio 7 Dias%' OR slug = 'desafio-7-dias')
  )
ORDER BY type, name;

-- 4. CONTAGEM FINAL
SELECT 
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY type
ORDER BY type;


