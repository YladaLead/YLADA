-- =====================================================
-- SCRIPT: Criar Perfil para nutri1@ylada.com
-- =====================================================
-- Execute este script APÓS criar o usuário no Dashboard
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'nutri1@ylada.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Usuário não encontrado! Crie primeiro no Dashboard:
    1. Acesse: Supabase Dashboard > Authentication > Users
    2. Clique em "Add User"
    3. Email: nutri1@ylada.com
    4. Password: senha123
    5. Auto Confirm User: ✅ (marcar)
    6. Clique em "Create User"
    7. Execute este script novamente';
  END IF;

  -- Criar perfil
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
    'nutri1@ylada.com',
    'Nutricionista Teste 1',
    'nutri',
    false, -- Sem diagnóstico (pronto para testar onboarding)
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    perfil = 'nutri',
    diagnostico_completo = false,
    updated_at = NOW();

  RAISE NOTICE '✅ Perfil criado com sucesso para: nutri1@ylada.com';
  RAISE NOTICE '✅ Agora você pode fazer login e testar!';
END $$;

-- =====================================================
-- VERIFICAR SE FUNCIONOU
-- =====================================================
SELECT 
  au.email,
  up.nome_completo,
  up.perfil,
  up.diagnostico_completo,
  CASE 
    WHEN up.diagnostico_completo = true THEN '✅ Com diagnóstico'
    ELSE '❌ Sem diagnóstico (pronto para testar)'
  END as status
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email = 'nutri1@ylada.com';


