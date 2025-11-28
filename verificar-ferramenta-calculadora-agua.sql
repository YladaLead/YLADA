-- =====================================================
-- VERIFICAR FERRAMENTA CALCULADORA DE ÁGUA
-- Script para verificar se a ferramenta existe e está configurada corretamente
-- =====================================================

-- 1. Buscar ferramenta "calculadora-de-agua" do usuário "ana"
SELECT 
  ut.id,
  ut.title,
  ut.slug,
  ut.template_slug,
  ut.status,
  ut.profession,
  ut.user_id,
  up.user_slug,
  up.nome_completo,
  ut.created_at,
  ut.updated_at
FROM user_templates ut
LEFT JOIN user_profiles up ON ut.user_id = up.user_id
WHERE up.user_slug = 'ana'
  AND ut.slug = 'calculadora-de-agua'
  AND ut.profession = 'nutri';

-- 2. Verificar todas as calculadoras de água do usuário
SELECT 
  ut.id,
  ut.title,
  ut.slug,
  ut.template_slug,
  ut.status,
  up.user_slug
FROM user_templates ut
LEFT JOIN user_profiles up ON ut.user_id = up.user_id
WHERE up.user_slug = 'ana'
  AND ut.template_slug LIKE '%agua%'
  AND ut.profession = 'nutri';

-- 3. Verificar assinatura do usuário
SELECT 
  u.id as user_id,
  u.email,
  up.user_slug,
  up.nome_completo,
  s.id as subscription_id,
  s.status as subscription_status,
  s.plan_type,
  s.current_period_end,
  s.cancel_at_period_end
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.profession = 'nutri'
WHERE up.user_slug = 'ana'
ORDER BY s.created_at DESC
LIMIT 1;

-- 4. Verificar template base "calculadora-agua" no banco
SELECT 
  id,
  name,
  slug,
  profession,
  is_active,
  type,
  created_at
FROM templates_nutrition
WHERE slug LIKE '%agua%'
  OR slug LIKE '%hidratacao%'
  OR name LIKE '%água%'
  OR name LIKE '%hidratação%'
ORDER BY created_at DESC;

