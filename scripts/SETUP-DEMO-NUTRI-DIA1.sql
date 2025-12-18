-- =====================================================
-- SETUP: demo.nutri@ylada.com - DIA 1 (GRAVAÇÃO)
-- =====================================================
-- Cenário: Primeiro acesso, tudo zerado
-- - Apenas conta criada
-- - Perfil básico
-- - ZERO formulários
-- - ZERO respostas
-- - ZERO clientes
-- - Tela limpa para gravar demonstração do zero
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_nutri_profile_id UUID;
BEGIN

  -- =====================================================
  -- PARTE 1: CRIAR/VERIFICAR USUÁRIO
  -- =====================================================

  -- Buscar ou criar usuário demo.nutri@ylada.com
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'demo.nutri@ylada.com';

  IF v_user_id IS NULL THEN
    -- Criar usuário
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'demo.nutri@ylada.com',
      crypt('Ylada2025!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"nome_completo":"Nutricionista Demo"}',
      false,
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO v_user_id;
    
    RAISE NOTICE '✅ Usuário demo.nutri@ylada.com criado: %', v_user_id;
  ELSE
    RAISE NOTICE '✅ Usuário demo.nutri@ylada.com já existe: %', v_user_id;
  END IF;

  -- =====================================================
  -- PARTE 2: LIMPAR TUDO DO USUÁRIO (SE EXISTIR)
  -- =====================================================

  -- Deletar respostas antigas
  DELETE FROM form_responses WHERE user_id = v_user_id;
  RAISE NOTICE '🗑️  Respostas deletadas';

  -- Deletar formulários antigos
  DELETE FROM custom_forms WHERE user_id = v_user_id AND is_template = false;
  RAISE NOTICE '🗑️  Formulários deletados';

  -- Deletar clientes antigos
  DELETE FROM leads WHERE user_id = v_user_id;
  RAISE NOTICE '🗑️  Clientes deletados';

  -- Deletar perfil antigo
  DELETE FROM nutri_profiles WHERE user_id = v_user_id;
  RAISE NOTICE '🗑️  Perfil antigo deletado';

  -- =====================================================
  -- PARTE 3: CRIAR PERFIL BÁSICO (MÍNIMO)
  -- =====================================================

  INSERT INTO nutri_profiles (
    user_id,
    nome_completo,
    email,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'Nutricionista Demo',
    'demo.nutri@ylada.com',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_nutri_profile_id;

  RAISE NOTICE '✅ Perfil básico criado: %', v_nutri_profile_id;

  -- =====================================================
  -- RESUMO FINAL
  -- =====================================================
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SETUP COMPLETO: demo.nutri@ylada.com';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: demo.nutri@ylada.com';
  RAISE NOTICE 'Senha: Ylada2025!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Estado Atual:';
  RAISE NOTICE '  - ✅ Conta ativa';
  RAISE NOTICE '  - ✅ Perfil básico criado';
  RAISE NOTICE '  - ❌ ZERO formulários';
  RAISE NOTICE '  - ❌ ZERO respostas';
  RAISE NOTICE '  - ❌ ZERO clientes';
  RAISE NOTICE '';
  RAISE NOTICE '🎬 Ambiente limpo - PERFEITO para gravação!';
  RAISE NOTICE 'Use esta conta para demonstrar:';
  RAISE NOTICE '  - Primeiro acesso';
  RAISE NOTICE '  - Criar formulários do zero';
  RAISE NOTICE '  - Usar templates';
  RAISE NOTICE '  - Compartilhar no WhatsApp';
  RAISE NOTICE '  - Testar LYA';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';

END $$;
