-- =====================================================
-- CONFIGURAR USUÁRIOS DE SUPORTE
-- Renata Borges e Renan Lieiria com acesso a todas as áreas
-- =====================================================

-- =====================================================
-- 1. VERIFICAR SE OS USUÁRIOS EXISTEM NO SUPABASE AUTH
-- =====================================================

-- Verificar Renata
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'renataborges.mpm@gmail.com';

-- Verificar Renan
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'renan.mdlr@gmail.com';

-- =====================================================
-- 2. VERIFICAR SE TÊM PERFIS NA TABELA user_profiles
-- =====================================================

SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.nome_completo,
  au.email as auth_email,
  au.email_confirmed_at
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email IN ('renataborges.mpm@gmail.com', 'renan.mdlr@gmail.com')
   OR up.email IN ('renataborges.mpm@gmail.com', 'renan.mdlr@gmail.com');

-- =====================================================
-- 3. CRIAR/ATUALIZAR PERFIL DA RENATA BORGES
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar o user_id da Renata
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'renataborges.mpm@gmail.com'
  LIMIT 1;

  -- Se encontrou o user_id, criar/atualizar o perfil
  IF v_user_id IS NOT NULL THEN
    -- Inserir perfil único com is_support = true
    INSERT INTO user_profiles (
      user_id,
      perfil,
      nome_completo,
      email,
      whatsapp,
      bio,
      user_slug,
      country_code,
      is_admin,
      is_support
    ) VALUES (
      v_user_id,
      'wellness', -- Perfil padrão, mas is_support permite acesso a todas as áreas
      'Renata Borges',
      'renataborges.mpm@gmail.com',
      NULL, -- Preencher depois se necessário
      'Suporte', -- Bio
      'renata-borges', -- Slug
      'BR',
      false, -- Não é admin
      true   -- É suporte (pode acessar todas as áreas)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      perfil = 'wellness',
      nome_completo = 'Renata Borges',
      email = 'renataborges.mpm@gmail.com',
      is_admin = false,
      is_support = true,
      updated_at = NOW();
    
    RAISE NOTICE 'Perfil da Renata Borges criado/atualizado com user_id: %', v_user_id;
  ELSE
    RAISE NOTICE 'Usuário renataborges.mpm@gmail.com não encontrado em auth.users. Por favor, crie o usuário primeiro no Supabase Auth.';
  END IF;
END $$;

-- =====================================================
-- 4. CRIAR USUÁRIO E PERFIL DO RENAN LIEIRIA
-- =====================================================
-- NOTA: O usuário precisa ser criado primeiro no Supabase Auth
-- Este script apenas cria/atualiza o perfil se o usuário já existir

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar o user_id do Renan
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'renan.mdlr@gmail.com'
  LIMIT 1;

  -- Se encontrou o user_id, criar/atualizar o perfil
  IF v_user_id IS NOT NULL THEN
    -- Inserir perfil único com is_support = true
    INSERT INTO user_profiles (
      user_id,
      perfil,
      nome_completo,
      email,
      whatsapp,
      bio,
      user_slug,
      country_code,
      is_admin,
      is_support
    ) VALUES (
      v_user_id,
      'wellness', -- Perfil padrão, mas is_support permite acesso a todas as áreas
      'Renan Lieiria',
      'renan.mdlr@gmail.com',
      NULL, -- Preencher depois se necessário
      'Suporte', -- Bio
      'renan-lieiria', -- Slug
      'BR',
      false, -- Não é admin
      true   -- É suporte (pode acessar todas as áreas)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      perfil = COALESCE(user_profiles.perfil, 'wellness'),
      nome_completo = 'Renan Lieiria',
      email = 'renan.mdlr@gmail.com',
      is_admin = false,
      is_support = true,
      bio = COALESCE(user_profiles.bio, 'Suporte'),
      user_slug = COALESCE(user_profiles.user_slug, 'renan-lieiria'),
      country_code = COALESCE(user_profiles.country_code, 'BR'),
      updated_at = NOW();
    
    RAISE NOTICE 'Perfil do Renan Lieiria criado/atualizado com user_id: %', v_user_id;
  ELSE
    RAISE NOTICE 'Usuário renan.mdlr@gmail.com não encontrado em auth.users. Por favor, crie o usuário primeiro no Supabase Auth com uma senha segura.';
  END IF;
END $$;

-- =====================================================
-- 5. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar configuração final dos usuários de suporte
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.nome_completo,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  au.created_at as usuario_criado_em
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.email IN ('renataborges.mpm@gmail.com', 'renan.mdlr@gmail.com')
   OR au.email IN ('renataborges.mpm@gmail.com', 'renan.mdlr@gmail.com')
ORDER BY up.email;

-- =====================================================
-- 6. LISTAR TODOS OS USUÁRIOS DE SUPORTE
-- =====================================================

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
WHERE up.is_support = true
ORDER BY up.nome_completo;

