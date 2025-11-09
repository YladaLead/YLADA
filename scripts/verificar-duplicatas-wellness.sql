-- ============================================
-- VERIFICAR DUPLICATAS E CONTAGEM DE TEMPLATES WELLNESS
-- ============================================

-- 1. CONTAGEM TOTAL
SELECT 
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- 2. VERIFICAR DUPLICATAS POR NOME
SELECT 
  name,
  COUNT(*) as quantidade,
  STRING_AGG(id::text, ', ') as ids,
  STRING_AGG(slug, ', ') as slugs,
  STRING_AGG(CASE WHEN is_active THEN 'ativo' ELSE 'inativo' END, ', ') as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY quantidade DESC, name;

-- 3. VERIFICAR DUPLICATAS POR SLUG
SELECT 
  slug,
  COUNT(*) as quantidade,
  STRING_AGG(name, ', ') as nomes,
  STRING_AGG(id::text, ', ') as ids,
  STRING_AGG(CASE WHEN is_active THEN 'ativo' ELSE 'inativo' END, ', ') as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND slug IS NOT NULL
  AND slug != ''
GROUP BY slug
HAVING COUNT(*) > 1
ORDER BY quantidade DESC, slug;

-- 4. LISTAR TODOS OS TEMPLATES COM STATUS
SELECT 
  name,
  slug,
  type,
  is_active,
  created_at,
  CASE 
    WHEN is_active THEN '✅ Ativo'
    ELSE '❌ Inativo'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY type, is_active DESC, name;

-- 5. CONTAGEM POR TIPO
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

