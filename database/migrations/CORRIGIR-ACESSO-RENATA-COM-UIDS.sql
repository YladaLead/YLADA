-- =====================================================
-- CORREÇÃO DE ACESSOS - RENATA (COM UIDs REAIS)
-- =====================================================
-- 
-- Baseado nos UIDs verificados no Supabase Dashboard:
-- - Wellness: renatateste@gmail.com (UID: 2d273111-bb30-48a1-97b2-79f674478d1c)
-- - Nutri: renataborges.mpm@gmail.com (UID: 3c18b29f-64fe-4ed7-9b77-6e538326e22f)
--
-- =====================================================

-- =====================================================
-- 1. VERIFICAR PERFIS ATUAIS (ANTES DA CORREÇÃO)
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
RIGHT JOIN auth.users au ON up.user_id = au.id
WHERE au.id = '2d273111-bb30-48a1-97b2-79f674478d1c'
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
RIGHT JOIN auth.users au ON up.user_id = au.id
WHERE au.id = '3c18b29f-64fe-4ed7-9b77-6e538326e22f'
   OR au.email = 'renataborges.mpm@gmail.com';

-- =====================================================
-- 2. CRIAR/ATUALIZAR PERFIL WELLNESS
-- =====================================================

-- Primeiro, verificar se já existe e atualizar, senão inserir
DO $$
BEGIN
  -- Tentar atualizar primeiro
  UPDATE user_profiles
  SET 
    perfil = 'wellness',
    email = 'renatateste@gmail.com',
    nome_completo = COALESCE(nome_completo, 'Renata Borges'),
    updated_at = NOW()
  WHERE user_id = '2d273111-bb30-48a1-97b2-79f674478d1c';
  
  -- Se não atualizou nada, inserir
  IF NOT FOUND THEN
    INSERT INTO user_profiles (user_id, perfil, email, nome_completo)
    VALUES (
      '2d273111-bb30-48a1-97b2-79f674478d1c',
      'wellness',
      'renatateste@gmail.com',
      'Renata Borges'
    );
  END IF;
END $$;

-- =====================================================
-- 3. CRIAR/ATUALIZAR PERFIL NUTRI
-- =====================================================

DO $$
BEGIN
  -- Tentar atualizar primeiro
  UPDATE user_profiles
  SET 
    perfil = 'nutri',
    email = 'renataborges.mpm@gmail.com',
    nome_completo = COALESCE(nome_completo, 'Renata Borges'),
    updated_at = NOW()
  WHERE user_id = '3c18b29f-64fe-4ed7-9b77-6e538326e22f';
  
  -- Se não atualizou nada, inserir
  IF NOT FOUND THEN
    INSERT INTO user_profiles (user_id, perfil, email, nome_completo)
    VALUES (
      '3c18b29f-64fe-4ed7-9b77-6e538326e22f',
      'nutri',
      'renataborges.mpm@gmail.com',
      'Renata Borges'
    );
  END IF;
END $$;

-- =====================================================
-- 4. VERIFICAR SE A CORREÇÃO FOI APLICADA
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
  END as status_email,
  CASE 
    WHEN up.perfil = 'wellness' THEN '✅ Perfil correto'
    ELSE '❌ Perfil incorreto'
  END as status_perfil
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.user_id = '2d273111-bb30-48a1-97b2-79f674478d1c'
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
  END as status_email,
  CASE 
    WHEN up.perfil = 'nutri' THEN '✅ Perfil correto'
    ELSE '❌ Perfil incorreto'
  END as status_perfil
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.user_id = '3c18b29f-64fe-4ed7-9b77-6e538326e22f'
   OR au.email = 'renataborges.mpm@gmail.com';

-- =====================================================
-- 5. LISTAR TODOS OS PERFIS DA RENATA
-- =====================================================

SELECT 
  up.email,
  up.perfil,
  up.nome_completo,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  up.created_at,
  up.updated_at,
  CASE 
    WHEN up.perfil = 'wellness' AND up.email = 'renatateste@gmail.com' THEN '✅ Configurado corretamente'
    WHEN up.perfil = 'nutri' AND up.email = 'renataborges.mpm@gmail.com' THEN '✅ Configurado corretamente'
    ELSE '❌ Precisa correção'
  END as status_geral
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.user_id IN ('2d273111-bb30-48a1-97b2-79f674478d1c', '3c18b29f-64fe-4ed7-9b77-6e538326e22f')
   OR up.email IN ('renatateste@gmail.com', 'renataborges.mpm@gmail.com')
ORDER BY up.email;

-- =====================================================
-- INSTRUÇÕES:
-- =====================================================
-- 
-- 1. Execute este script no Supabase SQL Editor
-- 
-- 2. Verifique os resultados das queries de verificação
--    - Deve mostrar perfil 'wellness' para renatateste@gmail.com
--    - Deve mostrar perfil 'nutri' para renataborges.mpm@gmail.com
-- 
-- 3. Se os emails não estiverem confirmados:
--    - Vá em Authentication > Users
--    - Clique em cada usuário
--    - Clique em "Confirm Email"
-- 
-- 4. Teste o login:
--    - Wellness: /pt/wellness/login com renatateste@gmail.com
--    - Nutri: /pt/nutri/login com renataborges.mpm@gmail.com

