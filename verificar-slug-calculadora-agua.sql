-- ============================================
-- VERIFICAR SLUG CORRETO DA CALCULADORA DE ÁGUA
-- ============================================
-- Execute este SQL para ver qual é o slug real da ferramenta criada pelo usuário
-- ============================================

-- 1. Verificar template base (calculadora-agua)
SELECT 
  id,
  slug,
  name,
  type,
  profession,
  is_active
FROM templates_nutrition
WHERE 
  (slug = 'calculadora-agua' OR slug = 'calc-hidratacao' OR slug = 'agua')
  AND is_active = true
ORDER BY slug;

-- 2. Verificar ferramentas criadas pelo usuário "andre" (user_slug)
SELECT 
  ut.id,
  ut.slug as tool_slug,
  ut.template_slug,
  ut.title,
  ut.status,
  up.user_slug,
  up.user_id
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'andre'
  AND ut.profession = 'wellness'
  AND ut.status = 'active'
  AND (
    ut.template_slug = 'calculadora-agua' 
    OR ut.template_slug = 'calc-hidratacao'
    OR ut.slug = 'agua'
    OR ut.slug = 'calculadora-agua'
    OR ut.slug = 'calc-hidratacao'
    OR ut.title ILIKE '%água%'
    OR ut.title ILIKE '%agua%'
    OR ut.title ILIKE '%hidratação%'
    OR ut.title ILIKE '%hidratacao%'
  )
ORDER BY ut.created_at DESC;

-- 3. Verificar TODAS as ferramentas do usuário "andre"
SELECT 
  ut.slug as tool_slug,
  ut.template_slug,
  ut.title,
  ut.status
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'andre'
  AND ut.profession = 'wellness'
  AND ut.status = 'active'
ORDER BY ut.slug;








