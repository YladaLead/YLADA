-- =====================================================
-- CRIAR USUÁRIO DE SUPORTE: ANNA SLIM
-- Email: portalmagra@gmail.com
-- Nome: Anna Slim
-- Senha: 123456
-- Área: Coach (mas com acesso a todas as áreas via is_support = true)
-- =====================================================

-- NOTA: Este script SQL não pode criar o usuário diretamente em auth.users
-- Você precisa criar o usuário primeiro no Supabase Dashboard ou usar a API
-- Depois execute este script para criar/atualizar o perfil

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Verificar se o usuário existe
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'portalmagra@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE '⚠️ Usuário portalmagra@gmail.com NÃO encontrado em auth.users';
    RAISE NOTICE '';
    RAISE NOTICE '📋 OPÇÕES PARA CRIAR O USUÁRIO:';
    RAISE NOTICE '';
    RAISE NOTICE 'OPÇÃO 1 - Via Supabase Dashboard (RECOMENDADO):';
    RAISE NOTICE '  1. Acesse: Supabase Dashboard > Authentication > Users';
    RAISE NOTICE '  2. Clique em "Add User"';
    RAISE NOTICE '  3. Preencha:';
    RAISE NOTICE '     - Email: portalmagra@gmail.com';
    RAISE NOTICE '     - Password: 123456';
    RAISE NOTICE '     - Auto Confirm User: ✅ (marcar)';
    RAISE NOTICE '  4. Clique em "Create User"';
    RAISE NOTICE '  5. Execute novamente este script para criar o perfil';
    RAISE NOTICE '';
    RAISE NOTICE 'OPÇÃO 2 - Via API Route (se servidor estiver rodando):';
    RAISE NOTICE '  curl -X POST http://localhost:3000/api/admin/create-support-user \';
    RAISE NOTICE '    -H "Content-Type: application/json" \';
    RAISE NOTICE '    -d ''{"email":"portalmagra@gmail.com","password":"123456","nome_completo":"Anna Slim"}''';
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
    'portalmagra@gmail.com',
    'Anna Slim',
    'coach',
    false,
    true, -- is_support = true (acesso a todas as áreas)
    'Suporte',
    'portalmagra',
    'BR'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = 'portalmagra@gmail.com',
    nome_completo = 'Anna Slim',
    perfil = 'coach',
    is_admin = false,
    is_support = true, -- Garantir que is_support está true
    bio = 'Suporte',
    user_slug = COALESCE(user_profiles.user_slug, 'portalmagra'),
    country_code = COALESCE(user_profiles.country_code, 'BR'),
    updated_at = NOW();

  RAISE NOTICE '✅ Perfil criado/atualizado com is_support = true';
  RAISE NOTICE '';
  RAISE NOTICE '📋 INFORMAÇÕES:';
  RAISE NOTICE '   Email: portalmagra@gmail.com';
  RAISE NOTICE '   Nome: Anna Slim';
  RAISE NOTICE '   Área: Coach';
  RAISE NOTICE '   Suporte: ✅ Sim (acesso a todas as áreas)';
  RAISE NOTICE '   Admin: ❌ Não';

END $$;

-- Verificar resultado da Anna Slim
SELECT 
  '✅ VERIFICAÇÃO FINAL - ANNA SLIM' as status,
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
WHERE au.email = 'portalmagra@gmail.com';

-- Listar TODOS os usuários de suporte
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

