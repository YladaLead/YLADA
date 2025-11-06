-- =====================================================
-- RESETAR SENHA DO ADMIN: faulaandre@gmail.com
-- =====================================================
-- IMPORTANTE: No Supabase, você precisa resetar a senha
-- pelo Dashboard ou usar a função de reset de senha
-- =====================================================

-- 1. VERIFICAR USUÁRIO NO SUPABASE AUTH
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- 2. RESETAR SENHA VIA SUPABASE DASHBOARD
-- =====================================================
-- 
-- Opção 1: Via Dashboard (RECOMENDADO)
-- 1. Acesse: Supabase Dashboard > Authentication > Users
-- 2. Procure por: faulaandre@gmail.com
-- 3. Clique no usuário
-- 4. Clique em "Send Password Reset Email"
-- 5. Ou clique em "Reset Password" e defina uma nova senha
--
-- Opção 2: Via API (se tiver acesso)
-- Use a função: supabase.auth.admin.updateUserById()
-- com a nova senha
--
-- =====================================================

-- 3. VERIFICAR PERFIL APÓS RESETAR SENHA
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.nome_completo,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'faulaandre@gmail.com' 
   OR up.email = 'faulaandre@gmail.com';

