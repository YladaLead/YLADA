-- =====================================================
-- VERIFICAR STATUS DOS TEMPLATES NO BANCO
-- =====================================================

-- 1. Contar templates por status
SELECT 
  is_active,
  language,
  COUNT(*) as total
FROM templates_nutrition
GROUP BY is_active, language
ORDER BY is_active DESC, language;

-- 2. Listar todos os templates PT (ativos e inativos)
SELECT 
  id,
  name,
  type,
  language,
  is_active,
  created_at
FROM templates_nutrition
WHERE language = 'pt' OR language LIKE 'pt%'
ORDER BY is_active DESC, name;

-- 3. Contar templates por tipo
SELECT 
  type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM templates_nutrition
WHERE language = 'pt' OR language LIKE 'pt%'
GROUP BY type
ORDER BY type;

-- 4. Verificar se há templates com profession
SELECT 
  CASE 
    WHEN profession IS NULL THEN 'sem profession'
    WHEN profession = '' THEN 'profession vazio'
    ELSE profession
  END as status_profession,
  COUNT(*) as total
FROM templates_nutrition
WHERE language = 'pt' OR language LIKE 'pt%'
GROUP BY status_profession;

