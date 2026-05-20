-- =====================================================
-- CRIAR USUÁRIO RENAN VIA API OU ATUALIZAR SCRIPT
-- =====================================================
-- 
-- OPÇÃO 1: Usar a API Route (RECOMENDADO)
-- =====================================================
-- 
-- Faça uma requisição POST para:
-- POST /api/admin/create-support-user
-- 
-- Body JSON:
-- {
--   "email": "renan.mdlr@gmail.com",
--   "password": "123456",
--   "nome_completo": "Renan Lieiria"
-- }
--
-- Isso criará o usuário no Supabase Auth e o perfil com is_support = true
--
-- =====================================================
-- OPÇÃO 2: Criar manualmente no Dashboard e executar script
-- =====================================================
--
-- 1. Acesse: Supabase Dashboard > Authentication > Users
-- 2. Clique em "Add User"
-- 3. Preencha:
--    - Email: renan.mdlr@gmail.com
--    - Password: 123456
--    - Auto Confirm User: ✅ (marcar)
-- 4. Clique em "Create User"
-- 5. Execute o script abaixo para criar o perfil
--
-- =====================================================
-- SCRIPT PARA CRIAR PERFIL DO RENAN (após criar no Dashboard)
-- =====================================================

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
      perfil = 'wellness',
      nome_completo = 'Renan Lieiria',
      email = 'renan.mdlr@gmail.com',
      is_admin = false,
      is_support = true,
      updated_at = NOW();
    
    RAISE NOTICE 'Perfil do Renan Lieiria criado/atualizado com user_id: %', v_user_id;
  ELSE
    RAISE NOTICE 'Usuário renan.mdlr@gmail.com não encontrado em auth.users. Por favor, crie o usuário primeiro no Supabase Auth ou use a API Route /api/admin/create-support-user';
  END IF;
END $$;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

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
WHERE up.email = 'renan.mdlr@gmail.com'
   OR au.email = 'renan.mdlr@gmail.com';

