-- =====================================================
-- SCRIPT DEFINITIVO: Garantir que Renan está configurado
-- =====================================================
-- Este script:
-- 1. Verifica se o usuário existe
-- 2. Cria/atualiza o perfil FORÇADAMENTE
-- 3. Garante que is_support = true
-- =====================================================

-- PASSO 1: Verificar se usuário existe
DO $$
DECLARE
  v_user_id UUID;
  v_profile_id UUID;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'renan.mdlr@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ ERRO: Usuário renan.mdlr@gmail.com NÃO encontrado em auth.users. Crie o usuário primeiro no Supabase Dashboard (Authentication > Users > Add User)';
  END IF;

  RAISE NOTICE '✅ Usuário encontrado! user_id: %', v_user_id;

  -- Verificar se perfil existe
  SELECT id INTO v_profile_id
  FROM user_profiles
  WHERE user_id = v_user_id
  LIMIT 1;

  -- FORÇAR criação/atualização do perfil
  INSERT INTO user_profiles (
    user_id,
    email,
    nome_completo,
    perfil,
    is_admin,
    is_support,
    bio,
    user_slug,
    country_code
  ) VALUES (
    v_user_id,
    'renan.mdlr@gmail.com',
    'Renan Lieiria',
    'wellness',
    false,
    true,  -- ⭐ IS_SUPPORT = TRUE
    'Suporte',
    'renan-lieiria',
    'BR'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = 'renan.mdlr@gmail.com',
    nome_completo = 'Renan Lieiria',
    perfil = 'wellness',
    is_admin = false,
    is_support = true,  -- ⭐ FORÇAR IS_SUPPORT = TRUE
    bio = 'Suporte',
    user_slug = COALESCE(user_profiles.user_slug, 'renan-lieiria'),
    country_code = COALESCE(user_profiles.country_code, 'BR'),
    updated_at = NOW();

  IF v_profile_id IS NULL THEN
    RAISE NOTICE '✅ Perfil CRIADO com is_support = true';
  ELSE
    RAISE NOTICE '✅ Perfil ATUALIZADO com is_support = true';
  END IF;

END $$;

-- PASSO 2: Verificar resultado
SELECT 
  '✅ VERIFICAÇÃO FINAL' as status,
  up.id as profile_id,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support,
  CASE 
    WHEN up.is_support = true THEN '✅ CONFIGURADO CORRETAMENTE'
    ELSE '❌ ERRO: is_support não está true'
  END as status_configuracao,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
INNER JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'renan.mdlr@gmail.com';

-- PASSO 3: Listar TODOS os usuários de suporte
SELECT 
  '📋 LISTA DE USUÁRIOS DE SUPORTE' as titulo,
  up.email,
  up.nome_completo,
  up.is_support,
  up.is_admin,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
INNER JOIN auth.users au ON up.user_id = au.id
WHERE up.is_support = true
ORDER BY up.nome_completo;

