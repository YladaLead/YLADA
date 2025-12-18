-- =====================================================
-- VERIFICAR SLUGS DAS 28 FERRAMENTAS NUTRI
-- =====================================================
-- Execute no Supabase SQL Editor para verificar se todos
-- os slugs estão corretos e funcionando

-- 1. LISTAR TODAS AS FERRAMENTAS NUTRI COM SEUS SLUGS
SELECT 
  id,
  name as nome,
  slug,
  type as tipo,
  profession,
  language,
  is_active,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN slug NOT LIKE '%-nutri' AND profession = 'nutri' THEN '⚠️ SLUG SEM SUFIXO -nutri'
    ELSE '✅ OK'
  END as status_slug,
  created_at::date as criado_em
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
ORDER BY type, name;

-- 2. VERIFICAR SLUGS DUPLICADOS
SELECT 
  slug,
  COUNT(*) as quantidade,
  STRING_AGG(name, ', ') as templates
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
GROUP BY slug
HAVING COUNT(*) > 1;

-- 3. VERIFICAR SE CALCULADORA-AGUA EXISTE
SELECT 
  id,
  name,
  slug,
  type,
  profession,
  is_active,
  content IS NOT NULL as tem_content
FROM templates_nutrition
WHERE slug ILIKE '%agua%' 
   OR slug ILIKE '%water%'
   OR name ILIKE '%água%'
   OR name ILIKE '%agua%';

-- 4. LISTAR TODOS OS SLUGS PARA CONFERÊNCIA MANUAL
-- (Use para comparar com os links que estão sendo gerados)
SELECT 
  ROW_NUMBER() OVER (ORDER BY type, name) as "#",
  name as "Nome da Ferramenta",
  slug as "Slug (usado na URL)",
  type as "Tipo",
  CONCAT('ylada.app/pt/nutri/SEU_SLUG/', slug) as "URL Exemplo"
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
ORDER BY type, name;

-- 5. RESUMO POR TIPO
SELECT 
  type as tipo,
  COUNT(*) as quantidade,
  COUNT(CASE WHEN slug IS NOT NULL AND slug != '' THEN 1 END) as com_slug,
  COUNT(CASE WHEN slug IS NULL OR slug = '' THEN 1 END) as sem_slug
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
GROUP BY type
ORDER BY type;
