-- =====================================================
-- VERIFICAÇÃO E CORREÇÃO DE ACESSOS - RENATA
-- =====================================================
-- 
-- Este script verifica e corrige os acessos da Renata
-- para as áreas Wellness e Nutri
--
-- Emails:
-- - Wellness: renatateste@gmail.com
-- - Nutri: renataborges.mpm@gmail.com
--
-- =====================================================

-- =====================================================
-- 1. VERIFICAR SE OS USUÁRIOS EXISTEM NO SUPABASE AUTH
-- =====================================================
-- Nota: Isso precisa ser feito manualmente no Supabase Dashboard
-- Authentication > Users > Verificar se os emails existem

-- =====================================================
-- 2. VERIFICAR PERFIS ATUAIS
-- =====================================================

-- Verificar perfil Wellness
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.nome_completo,
  up.created_at,
  au.email as auth_email,
  au.email_confirmed_at
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.email = 'renatateste@gmail.com' 
   OR au.email = 'renatateste@gmail.com';

-- Verificar perfil Nutri
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.nome_completo,
  up.created_at,
  au.email as auth_email,
  au.email_confirmed_at
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.email = 'renataborges.mpm@gmail.com' 
   OR au.email = 'renataborges.mpm@gmail.com';

-- =====================================================
-- 3. CRIAR/ATUALIZAR PERFIL WELLNESS
-- =====================================================
-- Primeiro, precisamos encontrar o user_id do Supabase Auth
-- Se o usuário existe no auth.users mas não tem perfil, vamos criar

-- Este comando vai:
-- 1. Encontrar o user_id pelo email no auth.users
-- 2. Criar ou atualizar o perfil para 'wellness'

INSERT INTO user_profiles (user_id, perfil, email, nome_completo)
SELECT 
  au.id,
  'wellness',
  'renatateste@gmail.com',
  'Renata Teste'
FROM auth.users au
WHERE au.email = 'renatateste@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.user_id = au.id
  )
ON CONFLICT (user_id) 
DO UPDATE SET
  perfil = 'wellness',
  email = 'renatateste@gmail.com',
  updated_at = NOW();

-- =====================================================
-- 4. CRIAR/ATUALIZAR PERFIL NUTRI
-- =====================================================

INSERT INTO user_profiles (user_id, perfil, email, nome_completo)
SELECT 
  au.id,
  'nutri',
  'renataborges.mpm@gmail.com',
  'Renata Borges'
FROM auth.users au
WHERE au.email = 'renataborges.mpm@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.user_id = au.id
  )
ON CONFLICT (user_id) 
DO UPDATE SET
  perfil = 'nutri',
  email = 'renataborges.mpm@gmail.com',
  updated_at = NOW();

-- =====================================================
-- 5. VERIFICAR SE A CORREÇÃO FOI APLICADA
-- =====================================================

-- Verificar perfil Wellness após correção
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.nome_completo,
  au.email as auth_email,
  au.email_confirmed_at,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN '⚠️ Email não confirmado'
    ELSE '✅ Email confirmado'
  END as status_email
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.email = 'renatateste@gmail.com' 
   OR au.email = 'renatateste@gmail.com';

-- Verificar perfil Nutri após correção
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.nome_completo,
  au.email as auth_email,
  au.email_confirmed_at,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN '⚠️ Email não confirmado'
    ELSE '✅ Email confirmado'
  END as status_email
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.email = 'renataborges.mpm@gmail.com' 
   OR au.email = 'renataborges.mpm@gmail.com';

-- =====================================================
-- 6. LISTAR TODOS OS PERFIS PARA VERIFICAÇÃO GERAL
-- =====================================================

SELECT 
  up.email,
  up.perfil,
  up.nome_completo,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  up.created_at,
  up.updated_at
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.email IN ('renatateste@gmail.com', 'renataborges.mpm@gmail.com')
ORDER BY up.email;

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================
-- 
-- 1. Execute este script no Supabase SQL Editor
-- 
-- 2. Se os usuários NÃO existem no Supabase Auth:
--    - Vá em Authentication > Users > Add User
--    - Crie os usuários manualmente com os emails:
--      * renatateste@gmail.com (senha temporária)
--      * renataborges.mpm@gmail.com (senha temporária)
--    - Envie o email de confirmação ou confirme manualmente
-- 
-- 3. Após criar os usuários, execute novamente este script
--    para criar/atualizar os perfis
-- 
-- 4. Verifique os resultados das queries de verificação
-- 
-- 5. Se o email não estiver confirmado:
--    - Vá em Authentication > Users
--    - Clique no usuário
--    - Clique em "Confirm Email" (ou envie o email de confirmação)
-- 
-- 6. Teste o login:
--    - Wellness: /pt/wellness/login
--    - Nutri: /pt/nutri/login

