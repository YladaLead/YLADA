-- =====================================================
-- VERIFICAR USUÁRIO FAULAANDRE NO SUPABASE AUTH
-- =====================================================

-- 1. VERIFICAR SE O USUÁRIO EXISTE
SELECT 
  id,
  email,
  encrypted_password IS NOT NULL as tem_senha,
  email_confirmed_at IS NOT NULL as email_confirmado,
  created_at,
  last_sign_in_at,
  updated_at
FROM auth.users
WHERE email = 'faulaandre@gmail.com';

-- 2. VERIFICAR PERFIL
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support
FROM user_profiles up
WHERE up.email = 'faulaandre@gmail.com';

-- 3. VERIFICAR SE HÁ PROBLEMA COM SENHA
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.encrypted_password IS NULL THEN '❌ SEM SENHA'
    WHEN au.encrypted_password = '' THEN '❌ SENHA VAZIA'
    ELSE '✅ TEM SENHA'
  END as status_senha,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM auth.users au
WHERE au.email = 'faulaandre@gmail.com';

