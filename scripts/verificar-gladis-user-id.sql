-- =====================================================
-- VERIFICAR SITUAÇÃO DA GLADIS - USER_ID INCONSISTENTE
-- =====================================================
-- Este script verifica se há problemas de user_id
-- entre subscriptions e user_profiles após migração

-- =====================================================
-- 1. VERIFICAR TODOS OS USUÁRIOS COM EMAIL DA GLADIS
-- =====================================================
SELECT 
  'AUTH.USERS' as tabela,
  id as user_id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'gladisgordaliza@gmail.com'
ORDER BY created_at DESC;

-- =====================================================
-- 2. VERIFICAR PERFIS (USER_PROFILES) DA GLADIS
-- =====================================================
SELECT 
  'USER_PROFILES' as tabela,
  id as profile_id,
  user_id,
  email,
  nome_completo,
  perfil,
  created_at,
  updated_at
FROM user_profiles
WHERE email = 'gladisgordaliza@gmail.com'
   OR user_id IN (
     SELECT id FROM auth.users WHERE email = 'gladisgordaliza@gmail.com'
   )
ORDER BY created_at DESC;

-- =====================================================
-- 3. VERIFICAR SUBSCRIPTIONS DA GLADIS
-- =====================================================
SELECT 
  'SUBSCRIPTIONS' as tabela,
  s.id as subscription_id,
  s.user_id as subscription_user_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  s.created_at,
  s.updated_at,
  -- Verificar se user_id da subscription existe em auth.users
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users u WHERE u.id = s.user_id) 
    THEN '✅ User existe'
    ELSE '❌ User NÃO existe'
  END as user_existe,
  -- Verificar se user_id da subscription tem perfil
  CASE 
    WHEN EXISTS (SELECT 1 FROM user_profiles up WHERE up.user_id = s.user_id) 
    THEN '✅ Tem perfil'
    ELSE '❌ SEM perfil'
  END as tem_perfil
FROM subscriptions s
WHERE s.user_id IN (
  SELECT id FROM auth.users WHERE email = 'gladisgordaliza@gmail.com'
)
   OR EXISTS (
     SELECT 1 FROM auth.users u 
     WHERE u.id = s.user_id 
     AND u.email = 'gladisgordaliza@gmail.com'
   )
ORDER BY s.created_at DESC;

-- =====================================================
-- 4. VERIFICAR INCONSISTÊNCIAS
-- =====================================================
-- Verificar se subscription.user_id não bate com user_profiles.user_id
SELECT 
  'INCONSISTÊNCIA DETECTADA' as tipo,
  s.id as subscription_id,
  s.user_id as subscription_user_id,
  u.email as email_do_user_id,
  up.user_id as profile_user_id,
  up.email as email_do_perfil,
  CASE 
    WHEN s.user_id != up.user_id THEN '❌ USER_ID DIFERENTE'
    WHEN up.user_id IS NULL THEN '❌ SEM PERFIL'
    ELSE '✅ OK'
  END as status
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE u.email = 'gladisgordaliza@gmail.com'
  AND s.status = 'active'
ORDER BY s.current_period_end DESC;

-- =====================================================
-- 5. VERIFICAR QUAL É O USER_ID CORRETO
-- =====================================================
-- O user_id correto deve ser o que está em user_profiles
-- e que tem o email correto
SELECT 
  'USER_ID CORRETO' as info,
  up.user_id as user_id_correto,
  up.email,
  up.nome_completo,
  u.created_at as user_criado_em,
  up.created_at as perfil_criado_em
FROM user_profiles up
INNER JOIN auth.users u ON u.id = up.user_id
WHERE up.email = 'gladisgordaliza@gmail.com'
ORDER BY up.created_at DESC
LIMIT 1;

