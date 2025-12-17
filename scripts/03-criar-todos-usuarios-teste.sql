-- =====================================================
-- SCRIPT: Criar Perfis para Todos os Usuários de Teste
-- =====================================================
-- Execute este script APÓS criar os usuários no Dashboard
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
  v_nome TEXT;
  v_tem_diagnostico BOOLEAN;
BEGIN
  -- Usuário 1: Sem diagnóstico
  v_email := 'nutri1@ylada.com';
  v_nome := 'Nutricionista Teste 1';
  v_tem_diagnostico := false;
  
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE NOTICE '⚠️ Usuário não encontrado: %. Crie primeiro no Dashboard!', v_email;
  ELSE
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
      v_tem_diagnostico,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE
    SET 
      email = v_email,
      nome_completo = v_nome,
      perfil = 'nutri',
      diagnostico_completo = v_tem_diagnostico,
      updated_at = NOW();

    RAISE NOTICE '✅ Perfil criado/atualizado: %', v_email;
  END IF;

  -- Usuário 2: Com diagnóstico
  v_email := 'nutri2@ylada.com';
  v_nome := 'Nutricionista Teste 2';
  v_tem_diagnostico := true;
  
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE NOTICE '⚠️ Usuário não encontrado: %. Crie primeiro no Dashboard!', v_email;
  ELSE
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
      v_tem_diagnostico,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE
    SET 
      email = v_email,
      nome_completo = v_nome,
      perfil = 'nutri',
      diagnostico_completo = v_tem_diagnostico,
      updated_at = NOW();

    RAISE NOTICE '✅ Perfil criado/atualizado: %', v_email;
  END IF;

  -- Usuário 3: Com diagnóstico
  v_email := 'nutri3@ylada.com';
  v_nome := 'Nutricionista Teste 3';
  v_tem_diagnostico := true;
  
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE NOTICE '⚠️ Usuário não encontrado: %. Crie primeiro no Dashboard!', v_email;
  ELSE
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
      v_tem_diagnostico,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE
    SET 
      email = v_email,
      nome_completo = v_nome,
      perfil = 'nutri',
      diagnostico_completo = v_tem_diagnostico,
      updated_at = NOW();

    RAISE NOTICE '✅ Perfil criado/atualizado: %', v_email;
  END IF;
END $$;

-- =====================================================
-- VERIFICAR SE FUNCIONOU
-- =====================================================
SELECT 
  au.email,
  up.nome_completo,
  up.perfil,
  CASE 
    WHEN up.diagnostico_completo = true THEN '✅ Com diagnóstico'
    ELSE '❌ Sem diagnóstico'
  END as status_diagnostico
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN ('nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com')
ORDER BY au.email;


