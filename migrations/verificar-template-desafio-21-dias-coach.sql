-- =====================================================
-- VERIFICAR TEMPLATE "DESAFIO 21 DIAS" COACH
-- =====================================================
-- Este script verifica se o template está disponível na API
-- e se há duplicados

-- 1. Verificar todos os templates "desafio-21-dias"
SELECT 
  id,
  name,
  slug,
  profession,
  language,
  is_active,
  created_at,
  updated_at,
  usage_count,
  (SELECT COUNT(*) FROM coach_user_templates WHERE template_id = coach_templates_nutrition.id) as ferramentas_usando
FROM coach_templates_nutrition
WHERE slug = 'desafio-21-dias' OR name ILIKE '%desafio%21%dias%'
ORDER BY created_at DESC;

-- 2. Verificar se o template específico aparece na API
-- (A API busca: is_active=true, profession='coach', language='pt')
SELECT 
  id,
  name,
  slug,
  profession,
  language,
  is_active,
  CASE 
    WHEN is_active = true AND profession = 'coach' AND (language = 'pt' OR language IS NULL) 
    THEN '✅ APARECE NA API'
    ELSE '❌ NÃO APARECE NA API'
  END as status_api
FROM coach_templates_nutrition
WHERE id = 'ddccdf92-3ba8-412a-8c79-e6a627620ed4';

-- 3. Verificar se há outros templates duplicados que aparecem na API
SELECT 
  id,
  name,
  slug,
  profession,
  language,
  is_active,
  created_at,
  (SELECT COUNT(*) FROM coach_user_templates WHERE template_id = coach_templates_nutrition.id) as ferramentas_usando,
  CASE 
    WHEN is_active = true AND profession = 'coach' AND (language = 'pt' OR language IS NULL) 
    THEN '✅ APARECE NA API'
    ELSE '❌ NÃO APARECE NA API'
  END as status_api
FROM coach_templates_nutrition
WHERE (slug = 'desafio-21-dias' OR name ILIKE '%desafio%21%dias%')
ORDER BY 
  CASE 
    WHEN is_active = true AND profession = 'coach' AND (language = 'pt' OR language IS NULL) 
    THEN 0 
    ELSE 1 
  END,
  created_at DESC;

-- 4. Verificar qual template é usado na criação de ferramentas
-- (A API de criação usa findTemplateBySlug que busca por slug)
SELECT 
  t.id as template_id,
  t.name as template_name,
  t.slug as template_slug,
  t.profession,
  t.is_active,
  t.language,
  COUNT(ut.id) as ferramentas_criadas,
  STRING_AGG(ut.title, ', ') as titulos_ferramentas
FROM coach_templates_nutrition t
LEFT JOIN coach_user_templates ut ON ut.template_id = t.id
WHERE t.slug = 'desafio-21-dias' OR t.name ILIKE '%desafio%21%dias%'
GROUP BY t.id, t.name, t.slug, t.profession, t.is_active, t.language
ORDER BY ferramentas_criadas DESC, t.created_at DESC;

