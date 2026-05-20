-- =====================================================
-- VERIFICAR STATUS ADMIN DO FAULAANDRE
-- =====================================================
-- Este script verifica se o usuário faulaandre@gmail.com
-- está configurado corretamente como admin
-- =====================================================

-- 1. VERIFICAR SE O USUÁRIO EXISTE NO AUTH
SELECT 
  id as user_id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'faulaandre@gmail.com';

-- 2. VERIFICAR PERFIL NO user_profiles
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.created_at,
  up.updated_at
FROM user_profiles up
WHERE up.email = 'faulaandre@gmail.com';

-- 3. VERIFICAR SE É ADMIN (JOIN)
SELECT 
  au.id as user_id,
  au.email,
  au.email_confirmed_at,
  au.last_sign_in_at,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support,
  CASE 
    WHEN up.is_admin = true THEN '✅ É ADMIN'
    WHEN up.is_admin = false THEN '❌ NÃO É ADMIN'
    WHEN up.is_admin IS NULL THEN '⚠️ is_admin é NULL'
    ELSE '❓ Status desconhecido'
  END as status_admin
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email = 'faulaandre@gmail.com';

-- 4. VERIFICAR SE HÁ PERFIL (pode não existir)
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE email = 'faulaandre@gmail.com'
    ) THEN '✅ Perfil existe'
    ELSE '❌ Perfil NÃO existe'
  END as tem_perfil;

-- 5. VER TODOS OS ADMINS (para comparação)
SELECT 
  email,
  nome_completo,
  is_admin,
  is_support,
  perfil,
  updated_at
FROM user_profiles
WHERE is_admin = true
ORDER BY updated_at DESC;
