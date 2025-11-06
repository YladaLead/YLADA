-- =====================================================
-- DIAGNÓSTICO: Verificar situação do Renan
-- =====================================================

-- 1. Verificar se o usuário existe no auth.users
SELECT 
  '1. Usuário no auth.users' as etapa,
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmado,
  created_at
FROM auth.users
WHERE email = 'renan.mdlr@gmail.com';

-- 2. Verificar se tem perfil na user_profiles
SELECT 
  '2. Perfil na user_profiles' as etapa,
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
WHERE up.email = 'renan.mdlr@gmail.com'
   OR up.user_id IN (
     SELECT id FROM auth.users WHERE email = 'renan.mdlr@gmail.com'
   );

-- 3. Verificar JOIN entre auth.users e user_profiles
SELECT 
  '3. JOIN auth.users + user_profiles' as etapa,
  au.id as auth_user_id,
  au.email as auth_email,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  up.id as profile_id,
  up.user_id as profile_user_id,
  up.email as profile_email,
  up.nome_completo,
  up.is_admin,
  up.is_support
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email = 'renan.mdlr@gmail.com';

-- =====================================================
-- SOLUÇÃO: Forçar criação/atualização do perfil
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  -- Buscar user_id do Renan
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'renan.mdlr@gmail.com'
  LIMIT 1;

  -- Verificar se encontrou o usuário
  IF v_user_id IS NULL THEN
    RAISE NOTICE '❌ ERRO: Usuário renan.mdlr@gmail.com NÃO encontrado em auth.users';
    RAISE NOTICE '   Você precisa criar o usuário primeiro no Supabase Dashboard:';
    RAISE NOTICE '   1. Authentication > Users > Add User';
    RAISE NOTICE '   2. Email: renan.mdlr@gmail.com';
    RAISE NOTICE '   3. Password: 123456';
    RAISE NOTICE '   4. Marcar "Auto Confirm User"';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Usuário encontrado! user_id: %', v_user_id;

  -- Verificar se já tem perfil
  SELECT EXISTS(SELECT 1 FROM user_profiles WHERE user_id = v_user_id) INTO v_profile_exists;

  IF v_profile_exists THEN
    RAISE NOTICE '📝 Perfil já existe. Atualizando...';
    
    -- ATUALIZAR perfil existente
    UPDATE user_profiles
    SET 
      email = 'renan.mdlr@gmail.com',
      nome_completo = COALESCE(NULLIF(nome_completo, ''), 'Renan Lieiria'),
      perfil = COALESCE(perfil, 'wellness'),
      is_admin = false,
      is_support = true,
      bio = COALESCE(bio, 'Suporte'),
      user_slug = COALESCE(user_slug, 'renan-lieiria'),
      country_code = COALESCE(country_code, 'BR'),
      updated_at = NOW()
    WHERE user_id = v_user_id;
    
    RAISE NOTICE '✅ Perfil atualizado com sucesso!';
  ELSE
    RAISE NOTICE '➕ Criando novo perfil...';
    
    -- CRIAR novo perfil
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
      true,
      'Suporte',
      'renan-lieiria',
      'BR'
    );
    
    RAISE NOTICE '✅ Perfil criado com sucesso!';
  END IF;

END $$;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 
  '✅ RESULTADO FINAL' as status,
  up.id,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  CASE 
    WHEN up.is_support = true THEN '✅ CONFIGURADO CORRETAMENTE'
    ELSE '❌ PRECISA CONFIGURAR'
  END as status_configuracao
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'renan.mdlr@gmail.com'
   OR up.email = 'renan.mdlr@gmail.com';

-- =====================================================
-- LISTAR TODOS OS USUÁRIOS DE SUPORTE
-- =====================================================

SELECT 
  '📋 TODOS OS USUÁRIOS DE SUPORTE' as lista,
  up.email,
  up.nome_completo,
  up.is_support,
  up.is_admin,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.is_support = true
ORDER BY up.nome_completo;

