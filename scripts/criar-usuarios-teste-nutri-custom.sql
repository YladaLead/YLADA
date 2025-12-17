-- =====================================================
-- SCRIPT: Criar Usuários de Teste Customizados
-- =====================================================
-- Este script permite criar usuários com emails customizados
-- Ajuste os emails na seção abaixo
-- =====================================================
-- 
-- ⚠️ IMPORTANTE: Criar usuários diretamente em auth.users via SQL
-- pode não funcionar dependendo das permissões do Supabase.
-- Se este script falhar, use as instruções no final.
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
  v_nome TEXT;
  v_senha TEXT := 'senha123'; -- Senha padrão para todos
  usuarios_teste TEXT[][] := ARRAY[
    ['nutri1@ylada.com', 'Nutricionista Teste 1'],
    ['nutri2@ylada.com', 'Nutricionista Teste 2'],
    ['nutri3@ylada.com', 'Nutricionista Teste 3'],
    ['nutri4@ylada.com', 'Nutricionista Teste 4'],
    ['nutri5@ylada.com', 'Nutricionista Teste 5']
    -- Adicione mais emails aqui se necessário
  ];
  usuario TEXT[];
  usuarios_nao_criados TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOREACH usuario SLICE 1 IN ARRAY usuarios_teste
  LOOP
    v_email := usuario[1];
    v_nome := usuario[2];
    
    -- Verificar se o usuário já existe
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email;
    
    -- Se não existe, tentar criar
    IF v_user_id IS NULL THEN
      BEGIN
        -- Tentar criar usuário no auth.users
        INSERT INTO auth.users (
          id,
          instance_id,
          aud,
          role,
          email,
          encrypted_password,
          email_confirmed_at,
          raw_app_meta_data,
          raw_user_meta_data,
          created_at,
          updated_at,
          confirmation_token,
          email_change,
          email_change_token_new,
          recovery_token
        )
        VALUES (
          gen_random_uuid(),
          '00000000-0000-0000-0000-000000000000',
          'authenticated',
          'authenticated',
          v_email,
          crypt(v_senha, gen_salt('bf')),
          NOW(), -- Email já confirmado
          '{"provider":"email","providers":["email"]}',
          jsonb_build_object('nome', v_nome),
          NOW(),
          NOW(),
          '',
          '',
          '',
          ''
        )
        RETURNING id INTO v_user_id;
        
        RAISE NOTICE '✅ Usuário criado via SQL: % (ID: %)', v_email, v_user_id;
      EXCEPTION WHEN OTHERS THEN
        -- Se falhar, adicionar à lista de usuários que precisam ser criados manualmente
        usuarios_nao_criados := array_append(usuarios_nao_criados, v_email);
        RAISE NOTICE '⚠️ Não foi possível criar % via SQL. Use o Dashboard ou API.', v_email;
        CONTINUE;
      END;
    ELSE
      RAISE NOTICE '✅ Usuário já existe: % (ID: %)', v_email, v_user_id;
    END IF;
    
    -- Se o usuário existe (foi criado ou já existia), criar/atualizar perfil
    IF v_user_id IS NOT NULL THEN
      INSERT INTO user_profiles (
        user_id,
        email,
        nome_completo,
        perfil,
        diagnostico_completo,
        created_at,
        updated_at
      )
      VALUES (
        v_user_id,
        v_email,
        v_nome,
        'nutri',
        false, -- Sem diagnóstico (para testar onboarding)
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE
      SET 
        perfil = 'nutri',
        diagnostico_completo = false,
        updated_at = NOW();
      
      RAISE NOTICE '✅ Perfil criado/atualizado para: %', v_email;
    END IF;
  END LOOP;
  
  -- Se houver usuários que não foram criados, mostrar instruções
  IF array_length(usuarios_nao_criados, 1) > 0 THEN
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ ALGUNS USUÁRIOS PRECISAM SER CRIADOS MANUALMENTE:';
    RAISE NOTICE '';
    RAISE NOTICE 'OPÇÃO 1 - Via Supabase Dashboard (RECOMENDADO):';
    RAISE NOTICE '  1. Acesse: Supabase Dashboard > Authentication > Users';
    RAISE NOTICE '  2. Para cada email abaixo, clique em "Add User"';
    RAISE NOTICE '  3. Preencha:';
    RAISE NOTICE '     - Email: [email abaixo]';
    RAISE NOTICE '     - Password: senha123';
    RAISE NOTICE '     - Auto Confirm User: ✅ (marcar)';
    RAISE NOTICE '  4. Clique em "Create User"';
    RAISE NOTICE '  5. Execute este script novamente para criar os perfis';
    RAISE NOTICE '';
    RAISE NOTICE 'Emails que precisam ser criados:';
    FOREACH v_email IN ARRAY usuarios_nao_criados
    LOOP
      RAISE NOTICE '  - %', v_email;
    END LOOP;
    RAISE NOTICE '';
    RAISE NOTICE 'OPÇÃO 2 - Via API (se servidor estiver rodando):';
    RAISE NOTICE '  Use a rota: POST /api/admin/create-support-user';
    RAISE NOTICE '';
  END IF;
  
  RAISE NOTICE '✅ Processo concluído!';
END $$;

-- =====================================================
-- VERIFICAR USUÁRIOS CRIADOS
-- =====================================================
SELECT 
  au.email,
  au.created_at as data_cadastro,
  up.nome_completo,
  up.perfil,
  up.diagnostico_completo,
  CASE 
    WHEN up.diagnostico_completo = true THEN '✅ Com diagnóstico'
    ELSE '❌ Sem diagnóstico (pronto para testar)'
  END as status
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'nutri1@ylada.com',
  'nutri2@ylada.com',
  'nutri3@ylada.com',
  'nutri4@ylada.com',
  'nutri5@ylada.com'
)
ORDER BY au.email;

-- =====================================================
-- INFORMAÇÕES DE LOGIN
-- =====================================================
-- Emails criados:
--   - nutri1@ylada.com
--   - nutri2@ylada.com
--   - nutri3@ylada.com
--   - nutri4@ylada.com
--   - nutri5@ylada.com
-- 
-- Senha: senha123 (para todos)
-- Status: Email confirmado, sem diagnóstico
-- Pronto para testar o fluxo de onboarding!
-- =====================================================


