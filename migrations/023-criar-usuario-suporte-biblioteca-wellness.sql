-- =====================================================
-- CRIAR USUÁRIO DE SUPORTE PARA BIBLIOTECA WELLNESS
-- Migração 023: Configurar acesso de suporte à biblioteca
-- =====================================================
--
-- Este script configura um usuário de suporte com acesso à área de biblioteca wellness
-- O usuário pode fazer upload de materiais (videos, PDFs, imagens)
--
-- IMPORTANTE: Você precisa criar o usuário no Supabase Auth primeiro!
-- Veja as instruções no arquivo: INSTRUCOES-CRIAR-SUPORTE-BIBLIOTECA.md
--

-- =====================================================
-- CONFIGURAÇÃO DO USUÁRIO
-- =====================================================
-- Altere estas variáveis conforme necessário:
-- 
-- Email: suporte.wellness@ylada.com (ou outro e-mail de sua escolha)
-- Nome: Suporte Wellness Biblioteca
-- Senha: [defina uma senha segura]
-- 
-- OU use um e-mail existente que já tenha conta no sistema
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'suportewellness@ylada.com'; -- E-mail dedicado para suporte da biblioteca
  v_nome_completo TEXT := 'Suporte Wellness Biblioteca';
BEGIN
  -- Verificar se o usuário existe no Supabase Auth
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  USUÁRIO NÃO ENCONTRADO EM auth.users';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Email: %', v_email;
    RAISE NOTICE '';
    RAISE NOTICE '📝 OPÇÕES PARA CRIAR O USUÁRIO:';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'OPÇÃO 1 - Via Supabase Dashboard (RECOMENDADO):';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '1. Acesse: https://supabase.com/dashboard';
    RAISE NOTICE '2. Vá em: Authentication > Users';
    RAISE NOTICE '3. Clique em "Add User" (botão no canto superior direito)';
    RAISE NOTICE '4. Preencha os dados:';
    RAISE NOTICE '   - Email: %', v_email;
    RAISE NOTICE '   - Password: 123456';
    RAISE NOTICE '   - Auto Confirm User: ✅ MARCAR ESTA OPÇÃO';
    RAISE NOTICE '5. Clique em "Create User"';
    RAISE NOTICE '6. Execute novamente este script para criar o perfil';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'OPÇÃO 2 - Via API Route (se servidor estiver rodando):';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'curl -X POST http://localhost:3000/api/admin/create-support-user \';
    RAISE NOTICE '  -H "Content-Type: application/json" \';
    RAISE NOTICE '  -H "Authorization: Bearer [SEU_TOKEN_ADMIN]" \';
    RAISE NOTICE '  -d ''{"email":"%","password":"[SENHA_SEGURA]","nome_completo":"%"}''', v_email, v_nome_completo;
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'OPÇÃO 3 - Usar E-mail Existente:';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'Se você já tem um e-mail de suporte cadastrado,';
    RAISE NOTICE 'altere a variável v_email no início deste script';
    RAISE NOTICE 'para o e-mail existente e execute novamente.';
    RAISE NOTICE '';
    RETURN;
  END IF;

  -- Se chegou aqui, usuário existe - criar/atualizar perfil
  RAISE NOTICE '';
  RAISE NOTICE '✅ Usuário encontrado! Configurando perfil de suporte...';
  RAISE NOTICE '   User ID: %', v_user_id;
  RAISE NOTICE '   Email: %', v_email;
  RAISE NOTICE '';

  -- Criar ou atualizar perfil com is_support = true
  INSERT INTO user_profiles (
    user_id,
    email,
    nome_completo,
    perfil,
    profile_type,
    is_admin,
    is_support,
    bio,
    country_code,
    user_slug,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    v_email,
    v_nome_completo,
    'wellness',
    'wellness',
    false,  -- Não é admin
    true,   -- É suporte (permite upload na biblioteca)
    'Suporte - Acesso à Biblioteca Wellness',
    'BR',
    LOWER(REGEXP_REPLACE(SPLIT_PART(v_email, '@', 1), '[^a-z0-9]', '-', 'g')),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    nome_completo = EXCLUDED.nome_completo,
    perfil = EXCLUDED.perfil,
    profile_type = EXCLUDED.profile_type,
    is_support = true,  -- Garantir que is_support está true
    is_admin = false,   -- Garantir que não é admin
    bio = EXCLUDED.bio,
    updated_at = NOW();

  RAISE NOTICE '✅ Perfil criado/atualizado com sucesso!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 RESUMO DA CONFIGURAÇÃO:';
  RAISE NOTICE '   - Email: %', v_email;
  RAISE NOTICE '   - Nome: %', v_nome_completo;
  RAISE NOTICE '   - is_support: true ✅';
  RAISE NOTICE '   - is_admin: false';
  RAISE NOTICE '   - perfil: wellness';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 PERMISSÕES CONCEDIDAS:';
  RAISE NOTICE '   ✅ Upload de materiais na biblioteca wellness';
  RAISE NOTICE '   ✅ Leitura de materiais da biblioteca wellness';
  RAISE NOTICE '   ❌ Deletar materiais (apenas admins podem deletar)';
  RAISE NOTICE '';

END $$;

-- =====================================================
-- VERIFICAR CONFIGURAÇÃO
-- =====================================================

SELECT 
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_support,
  up.is_admin,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  au.created_at as usuario_criado_em
FROM user_profiles up
INNER JOIN auth.users au ON up.user_id = au.id
WHERE up.is_support = true
  AND up.email = 'suportewellness@ylada.com'
ORDER BY up.created_at DESC;

-- =====================================================
-- TESTAR ACESSO (Opcional)
-- =====================================================
-- Após configurar, você pode testar se o usuário tem acesso:
--
-- 1. Faça login com o e-mail e senha configurados
-- 2. Acesse: /pt/wellness/biblioteca/upload
-- 3. Você deve conseguir fazer upload de arquivos
-- =====================================================
