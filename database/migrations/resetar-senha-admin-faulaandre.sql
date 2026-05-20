-- =====================================================
-- RESETAR SENHA DO ADMIN FAULAANDRE
-- =====================================================
-- ATENÇÃO: Este script NÃO pode resetar senha diretamente
-- Use o Supabase Dashboard ou a API de reset de senha
-- =====================================================

-- Este script apenas mostra como resetar a senha
-- A senha deve ser resetada via:
-- 1. Supabase Dashboard > Authentication > Users > Reset Password
-- 2. Ou via API: /api/admin/reset-password

-- VERIFICAR SE O USUÁRIO EXISTE
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- INSTRUÇÕES PARA RESETAR SENHA:
-- =====================================================
-- 
-- OPÇÃO 1: Via Supabase Dashboard
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Vá em: Authentication > Users
-- 3. Procure por: faulaandre@gmail.com
-- 4. Clique em: "..." > "Reset Password"
-- 5. Um email será enviado para resetar a senha
--
-- OPÇÃO 2: Via API (se tiver endpoint)
-- POST /api/admin/reset-password
-- Body: { "email": "faulaandre@gmail.com" }
--
-- OPÇÃO 3: Via SQL (NÃO RECOMENDADO - apenas para emergência)
-- UPDATE auth.users
-- SET encrypted_password = crypt('NovaSenha123!', gen_salt('bf'))
-- WHERE email = 'faulaandre@gmail.com';
-- 
-- ⚠️ ATENÇÃO: A opção 3 requer extensão pgcrypto
-- e não é recomendada por questões de segurança
-- =====================================================

