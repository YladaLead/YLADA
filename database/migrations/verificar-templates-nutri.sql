-- =====================================================
-- VERIFICAR TODOS OS TEMPLATES NUTRI
-- Script para verificar se todos os templates existem e têm slugs corretos
-- =====================================================

-- Listar todos os templates Nutri ativos
SELECT 
  id,
  name,
  slug,
  profession,
  language,
  is_active,
  type,
  created_at
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
ORDER BY name;

-- Contar templates por tipo
SELECT 
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN slug IS NOT NULL THEN 1 END) as com_slug,
  COUNT(CASE WHEN slug IS NULL THEN 1 END) as sem_slug
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
GROUP BY type
ORDER BY type;

-- Verificar templates sem slug (problema potencial)
SELECT 
  id,
  name,
  type,
  profession,
  '⚠️ Template sem slug' as problema
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
  AND (slug IS NULL OR slug = '')
ORDER BY name;

-- Verificar slugs duplicados (problema potencial)
SELECT 
  slug,
  COUNT(*) as total,
  array_agg(name) as nomes,
  '⚠️ Slug duplicado' as problema
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
  AND slug IS NOT NULL
  AND slug != ''
GROUP BY slug
HAVING COUNT(*) > 1
ORDER BY slug;

-- Verificar templates com slugs que não correspondem ao nome (problema potencial)
SELECT 
  id,
  name,
  slug,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '⚠️ Sem slug'
    WHEN LOWER(REPLACE(REPLACE(name, ' ', '-'), 'ç', 'c')) != slug THEN '⚠️ Slug não corresponde ao nome'
    ELSE '✅ OK'
  END as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
ORDER BY name;

-- Listar todos os slugs únicos de templates Nutri
SELECT DISTINCT
  slug,
  name,
  type
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
  AND slug IS NOT NULL
  AND slug != ''
ORDER BY slug;
