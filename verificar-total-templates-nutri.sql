-- =====================================================
-- VERIFICAÇÃO: Total de Templates Nutri
-- =====================================================
-- 
-- Este script verifica quantos templates Nutri existem
-- e quantos têm content completo
-- 
-- =====================================================

-- 1. Total de templates Nutri ativos
SELECT 
  COUNT(*) as total_templates_nutri,
  COUNT(CASE WHEN is_active = true THEN 1 END) as templates_ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as templates_inativos
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

-- 2. Templates Nutri por tipo
SELECT 
  type as tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN content IS NOT NULL AND content::text != '{}' AND content::text != 'null' THEN 1 END) as com_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
GROUP BY type
ORDER BY total DESC;

-- 3. Templates Nutri com content completo
SELECT 
  COUNT(*) as total_com_content,
  COUNT(CASE 
    WHEN content->'questions' IS NOT NULL AND jsonb_typeof(content->'questions') = 'array' THEN 1
    WHEN content->'items' IS NOT NULL AND jsonb_typeof(content->'items') = 'array' THEN 1
    WHEN content->'steps' IS NOT NULL AND jsonb_typeof(content->'steps') = 'array' THEN 1
    WHEN content IS NOT NULL AND content::text != '{}' AND content::text != 'null' THEN 1
  END) as com_content_valido
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true;

-- 4. Lista completa de templates Nutri ativos (para verificar se são 37)
SELECT 
  slug,
  name as nome,
  type as tipo,
  CASE 
    WHEN content IS NULL THEN '❌ SEM CONTENT'
    WHEN content::text = '{}' THEN '❌ CONTENT VAZIO'
    WHEN content::text = 'null' THEN '❌ CONTENT NULL'
    WHEN content->'questions' IS NOT NULL AND jsonb_typeof(content->'questions') = 'array' THEN 
      '✅ TEM CONTENT (' || jsonb_array_length(content->'questions') || ' perguntas)'
    WHEN content->'items' IS NOT NULL AND jsonb_typeof(content->'items') = 'array' THEN 
      '✅ TEM CONTENT (' || jsonb_array_length(content->'items') || ' itens)'
    WHEN content->'steps' IS NOT NULL AND jsonb_typeof(content->'steps') = 'array' THEN 
      '✅ TEM CONTENT (' || jsonb_array_length(content->'steps') || ' steps)'
    ELSE '✅ TEM CONTENT (outro formato)'
  END as status_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY type, name;

-- 5. Comparação: Templates Nutri vs Wellness
SELECT 
  'Nutri' as area,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
UNION ALL
SELECT 
  'Wellness' as area,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';










