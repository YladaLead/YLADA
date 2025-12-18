-- =====================================================
-- INVESTIGAR DUPLICATAS E PROBLEMAS - TEMPLATES NUTRI
-- =====================================================

-- 1. VERIFICAR DUPLICATAS POR SLUG
SELECT 
  slug,
  COUNT(*) as quantidade,
  STRING_AGG(name, ' | ') as nomes,
  STRING_AGG(id::text, ', ') as ids
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
GROUP BY slug
HAVING COUNT(*) > 1
ORDER BY quantidade DESC;

-- 2. VERIFICAR DUPLICATAS POR NOME
SELECT 
  name,
  COUNT(*) as quantidade,
  STRING_AGG(slug, ' | ') as slugs,
  STRING_AGG(id::text, ', ') as ids
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY quantidade DESC;

-- 3. LISTAR TODOS OS 30 TEMPLATES COM DETALHES
SELECT 
  ROW_NUMBER() OVER (ORDER BY type, name) as "#",
  id,
  name as "Nome",
  slug as "Slug",
  type as "Tipo",
  created_at::date as "Criado em"
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
ORDER BY type, name;

-- 4. VERIFICAR FERRAMENTAS DA ANA (user_templates)
SELECT 
  ut.id,
  ut.title,
  ut.slug,
  ut.template_slug,
  ut.status,
  ut.created_at::date
FROM user_templates ut
JOIN user_profiles up ON ut.user_id = up.user_id
WHERE up.user_slug = 'ana'
  AND ut.profession = 'nutri'
ORDER BY ut.created_at;

-- 5. VERIFICAR SE HÁ TEMPLATES COM MESMO SLUG MAS DIFERENTES PROFISSÕES
SELECT 
  slug,
  STRING_AGG(profession, ', ') as profissoes,
  COUNT(*) as quantidade
FROM templates_nutrition
WHERE is_active = true
  AND language = 'pt'
GROUP BY slug
HAVING COUNT(DISTINCT profession) > 1
ORDER BY slug;

-- 6. LISTAR TODOS OS SLUGS ÚNICOS (PARA COPIAR)
SELECT DISTINCT slug
FROM templates_nutrition
WHERE profession = 'nutri'
  AND is_active = true
  AND language = 'pt'
ORDER BY slug;
