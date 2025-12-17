-- =====================================================
-- SCRIPT: Criar Perfis para Usuários de Teste
-- =====================================================
-- Use este script APÓS criar os usuários no Supabase Dashboard
-- Ele cria/atualiza os perfis em user_profiles
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
  v_nome TEXT;
  usuarios_teste TEXT[][] := ARRAY[
    ['nutri1@ylada.com', 'Nutricionista Teste 1'],
    ['nutri2@ylada.com', 'Nutricionista Teste 2'],
    ['nutri3@ylada.com', 'Nutricionista Teste 3'],
    ['nutri4@ylada.com', 'Nutricionista Teste 4'],
    ['nutri5@ylada.com', 'Nutricionista Teste 5']
    -- Adicione mais emails aqui se necessário
  ];
  usuario TEXT[];
BEGIN
  FOREACH usuario SLICE 1 IN ARRAY usuarios_teste
  LOOP
    v_email := usuario[1];
    v_nome := usuario[2];
    
    -- Buscar user_id
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email;
    
    IF v_user_id IS NULL THEN
      RAISE NOTICE '⚠️ Usuário não encontrado: %. Crie primeiro no Dashboard.', v_email;
    ELSE
      -- Criar ou atualizar perfil
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
  
  RAISE NOTICE '✅ Processo concluído!';
END $$;

-- =====================================================
-- VERIFICAR RESULTADO
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


