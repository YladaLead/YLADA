-- =====================================================
-- VERIFICAR DADOS DA NAYARA NO SUPABASE
-- Email: naytenutri@gmail.com
-- =====================================================

-- 1. VERIFICAR NO AUTH.USERS (Autenticação)
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  updated_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'naytenutri@gmail.com';

-- 2. VERIFICAR NO USER_PROFILES (Perfil)
SELECT 
  id,
  user_id,
  email,
  nome_completo,
  whatsapp,
  perfil,
  is_admin,
  is_support,
  bio,
  user_slug,
  country_code,
  created_at,
  updated_at
FROM user_profiles
WHERE email = 'naytenutri@gmail.com'
   OR user_id IN (
     SELECT id FROM auth.users WHERE email = 'naytenutri@gmail.com'
   );

-- 3. VERIFICAR ASSINATURA (Subscriptions)
SELECT 
  id,
  user_id,
  area,
  plan_type,
  status,
  current_period_start,
  current_period_end,
  is_migrated,
  migrated_from,
  requires_manual_renewal,
  created_at,
  updated_at
FROM subscriptions
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'naytenutri@gmail.com'
);

-- 4. VERIFICAR DADOS COMPLETOS (JOIN)
SELECT 
  au.id as auth_user_id,
  au.email,
  au.email_confirmed_at,
  au.created_at as auth_created_at,
  au.last_sign_in_at,
  up.id as profile_id,
  up.nome_completo,
  up.whatsapp,
  up.perfil,
  up.is_admin,
  up.is_support,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.status as subscription_status,
  s.current_period_end,
  s.is_migrated,
  s.migrated_from
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN subscriptions s ON au.id = s.user_id
WHERE au.email = 'naytenutri@gmail.com';

-- =====================================================
-- ONDE VER NO SUPABASE DASHBOARD:
-- =====================================================
-- 
-- 1. Authentication > Users
--    - Procure por: naytenutri@gmail.com
--    - Verá: ID, email, created_at, last_sign_in_at
--
-- 2. Table Editor > user_profiles
--    - Filtre por: email = 'naytenutri@gmail.com'
--    - Verá: nome_completo, whatsapp, perfil, etc.
--
-- 3. Table Editor > subscriptions
--    - Filtre por: user_id (pegue o ID do auth.users)
--    - Verá: plan_type, status, current_period_end, etc.
--
-- =====================================================

