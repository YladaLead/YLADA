-- =====================================================
-- SCRIPT: Criar Usuários de Teste para Nutri
-- =====================================================
-- Este script cria uma sequência de usuários de teste
-- Prontos para testar o fluxo completo de onboarding
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
  v_nome TEXT;
  i INTEGER;
BEGIN
  -- Criar usuários de teste (nutri1 até nutri10)
  FOR i IN 1..10 LOOP
    v_email := 'nutri' || i || '@ylada.com';
    v_nome := 'Nutricionista Teste ' || i;
    
    -- Verificar se o usuário já existe
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email;
    
    -- Se não existe, criar
    IF v_user_id IS NULL THEN
      -- Criar usuário no auth.users
      INSERT INTO auth.users (
        id,
        instance_id,
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
        v_email,
        crypt('senha123', gen_salt('bf')), -- Senha padrão: senha123
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
      
      RAISE NOTICE '✅ Usuário criado: % (ID: %)', v_email, v_user_id;
      
      -- Criar perfil em user_profiles
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
      ON CONFLICT (user_id) DO NOTHING;
      
      RAISE NOTICE '✅ Perfil criado para: %', v_email;
    ELSE
      RAISE NOTICE '⚠️ Usuário já existe: % (ID: %)', v_email, v_user_id;
      
      -- Garantir que o perfil está configurado corretamente
      UPDATE user_profiles
      SET 
        perfil = 'nutri',
        diagnostico_completo = false, -- Resetar para testar onboarding
        updated_at = NOW()
      WHERE user_id = v_user_id;
    END IF;
  END LOOP;
  
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
WHERE au.email LIKE 'nutri%@ylada.com'
ORDER BY au.email;

-- =====================================================
-- INFORMAÇÕES DE LOGIN
-- =====================================================
-- Email: nutri1@ylada.com até nutri10@ylada.com
-- Senha: senha123 (para todos)
-- Status: Email confirmado, sem diagnóstico
-- =====================================================


