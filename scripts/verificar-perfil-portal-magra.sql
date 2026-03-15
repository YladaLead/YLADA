-- =====================================================
-- VERIFICAR PERFIL DO USUÁRIO portal.magra@gmail.com
-- =====================================================
-- Execute no Supabase SQL Editor para diagnosticar
-- por que o usuário não foi redirecionado ao onboarding
-- =====================================================

-- 1. Buscar usuário em auth.users (aceita variações do email)
SELECT 
  id AS user_id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email ILIKE '%portal%magra%' 
   OR email ILIKE '%portalmagra%'
   OR email ILIKE '%portal.magra%';

-- 2. Perfil em user_profiles (área antiga: coach, nutri, etc.)
SELECT 
  up.user_id,
  up.perfil,
  up.nome_completo,
  up.email,
  up.diagnostico_completo,
  up.updated_at
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE u.email ILIKE '%portal%magra%' 
   OR u.email ILIKE '%portalmagra%'
   OR u.email ILIKE '%portal.magra%';

-- 3. Perfil YLADA (ylada_noel_profile) — usado para decidir onboarding vs home
SELECT 
  ynp.user_id,
  ynp.segment,
  ynp.area_specific,
  ynp.profile_type,
  ynp.profession,
  ynp.updated_at,
  -- Extrair nome e whatsapp para verificar critério de redirect
  (ynp.area_specific->>'nome') AS nome_no_area_specific,
  (ynp.area_specific->>'whatsapp') AS whatsapp_no_area_specific,
  LENGTH(COALESCE(ynp.area_specific->>'nome', '')::text) AS len_nome,
  LENGTH(REGEXP_REPLACE(COALESCE(ynp.area_specific->>'whatsapp', ''), '\D', '', 'g')) AS len_whatsapp
FROM ylada_noel_profile ynp
JOIN auth.users u ON u.id = ynp.user_id
WHERE u.email ILIKE '%portal%magra%' 
   OR u.email ILIKE '%portalmagra%'
   OR u.email ILIKE '%portal.magra%';

-- 4. Assinaturas (subscriptions) do usuário
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  s.stripe_subscription_id
FROM subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE u.email ILIKE '%portal%magra%' 
   OR u.email ILIKE '%portalmagra%'
   OR u.email ILIKE '%portal.magra%'
ORDER BY s.created_at DESC;

-- 5. Resumo: o usuário seria redirecionado para onboarding ou home?
-- Critério: area_specific.nome >= 2 chars E area_specific.whatsapp >= 10 dígitos
SELECT 
  u.email,
  up.perfil AS perfil_user_profiles,
  ynp.segment,
  (ynp.area_specific->>'nome') AS nome,
  (ynp.area_specific->>'whatsapp') AS whatsapp,
  CASE 
    WHEN ynp.id IS NULL THEN 'SEM REGISTRO em ylada_noel_profile → DEVERIA ir para /pt/onboarding'
    WHEN LENGTH(TRIM(COALESCE(ynp.area_specific->>'nome', ''))) < 2 
      OR LENGTH(REGEXP_REPLACE(COALESCE(ynp.area_specific->>'whatsapp', ''), '\D', '', 'g')) < 10 
    THEN 'DADOS INCOMPLETOS → DEVERIA ir para /pt/onboarding'
    ELSE 'DADOS COMPLETOS → vai para /pt/home'
  END AS resultado_esperado
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN ylada_noel_profile ynp ON ynp.user_id = u.id AND ynp.segment = 'ylada'
WHERE u.email ILIKE '%portal%magra%' 
   OR u.email ILIKE '%portalmagra%'
   OR u.email ILIKE '%portal.magra%';
