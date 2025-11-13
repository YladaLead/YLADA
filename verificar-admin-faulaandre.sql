-- =====================================================
-- VERIFICAR E RESETAR SENHA DO ADMIN
-- Email: faulaandre@gmail.com
-- =====================================================

-- 1. VERIFICAR SE O USUÁRIO EXISTE
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  updated_at
FROM auth.users
WHERE email = 'faulaandre@gmail.com';

-- 2. VERIFICAR PERFIL DO ADMIN
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'faulaandre@gmail.com' 
   OR up.email = 'faulaandre@gmail.com';

-- =====================================================
-- RESETAR SENHA VIA SUPABASE DASHBOARD
-- =====================================================
-- 
-- Opção 1: Via Dashboard (RECOMENDADO)
-- 1. Acesse: Supabase Dashboard > Authentication > Users
-- 2. Procure por: faulaandre@gmail.com
-- 3. Clique no usuário
-- 4. Clique em "Send Password Reset Email" OU
-- 5. Clique em "Reset Password" e defina uma nova senha
--
-- Opção 2: Via API (se tiver acesso)
-- Use a função: supabase.auth.admin.updateUserById()
-- com a nova senha
--
-- =====================================================

