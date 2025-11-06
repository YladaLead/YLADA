-- =====================================================
-- SOLUÇÃO: Criar usuário Renan via SQL (se possível)
-- =====================================================
-- NOTA: Criar usuário diretamente em auth.users via SQL
-- pode não funcionar dependendo das permissões.
-- Se este script falhar, use a API Route ou crie manualmente.
-- =====================================================

-- Tentar criar usuário diretamente (pode não funcionar)
-- Se falhar, use a API Route: POST /api/admin/create-support-user
-- Ou crie manualmente no Dashboard

DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  -- Verificar se já existe
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'renan.mdlr@gmail.com'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    RAISE NOTICE '✅ Usuário já existe! user_id: %', v_user_id;
  ELSE
    RAISE NOTICE '⚠️ Não é possível criar usuário diretamente via SQL.';
    RAISE NOTICE '';
    RAISE NOTICE '📋 OPÇÕES PARA CRIAR O USUÁRIO:';
    RAISE NOTICE '';
    RAISE NOTICE 'OPÇÃO 1 - Via Supabase Dashboard (RECOMENDADO):';
    RAISE NOTICE '  1. Acesse: Supabase Dashboard > Authentication > Users';
    RAISE NOTICE '  2. Clique em "Add User"';
    RAISE NOTICE '  3. Preencha:';
    RAISE NOTICE '     - Email: renan.mdlr@gmail.com';
    RAISE NOTICE '     - Password: 123456';
    RAISE NOTICE '     - Auto Confirm User: ✅ (marcar)';
    RAISE NOTICE '  4. Clique em "Create User"';
    RAISE NOTICE '  5. Execute novamente este script para criar o perfil';
    RAISE NOTICE '';
    RAISE NOTICE 'OPÇÃO 2 - Via API Route (se servidor estiver rodando):';
    RAISE NOTICE '  POST http://localhost:3000/api/admin/create-support-user';
    RAISE NOTICE '  Body: {"email":"renan.mdlr@gmail.com","password":"123456","nome_completo":"Renan Lieiria"}';
    RAISE NOTICE '';
    RETURN;
  END IF;

  -- Se chegou aqui, usuário existe - criar/atualizar perfil
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
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = 'renan.mdlr@gmail.com',
    nome_completo = 'Renan Lieiria',
    perfil = 'wellness',
    is_admin = false,
    is_support = true,
    bio = 'Suporte',
    user_slug = COALESCE(user_profiles.user_slug, 'renan-lieiria'),
    country_code = COALESCE(user_profiles.country_code, 'BR'),
    updated_at = NOW();

  RAISE NOTICE '✅ Perfil criado/atualizado com is_support = true';

END $$;

-- Verificar resultado
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

-- Listar todos os usuários de suporte
SELECT 
  '📋 LISTA DE USUÁRIOS DE SUPORTE' as titulo,
  up.email,
  up.nome_completo,
  up.is_support,
  up.is_admin
FROM user_profiles up
INNER JOIN auth.users au ON up.user_id = au.id
WHERE up.is_support = true
ORDER BY up.nome_completo;

