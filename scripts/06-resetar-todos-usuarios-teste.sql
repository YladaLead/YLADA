-- =====================================================
-- SCRIPT: Resetar Todos os Usuários de Teste
-- =====================================================
-- Use este script quando quiser resetar e testar novamente
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  usuarios TEXT[] := ARRAY['nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com'];
  v_email TEXT;
BEGIN
  FOREACH v_email IN ARRAY usuarios
  LOOP
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email;

    IF v_user_id IS NULL THEN
      RAISE NOTICE '⚠️ Usuário não encontrado: %', v_email;
      CONTINUE;
    END IF;

    -- Deletar diagnóstico
    DELETE FROM nutri_diagnostico WHERE user_id = v_user_id;
    
    -- Resetar flag no perfil
    UPDATE user_profiles 
    SET diagnostico_completo = false 
    WHERE user_id = v_user_id;

    -- Deletar progresso da jornada
    DELETE FROM journey_progress WHERE user_id = v_user_id;

    -- Deletar perfil estratégico
    DELETE FROM nutri_perfil_estrategico WHERE user_id = v_user_id;

    -- Deletar análises da LYA
    DELETE FROM lya_analise_nutri WHERE user_id = v_user_id;

    -- Deletar assinatura (se existir)
    DELETE FROM subscriptions WHERE user_id = v_user_id AND area = 'nutri';

    RAISE NOTICE '✅ Resetado: %', v_email;
  END LOOP;
  
  RAISE NOTICE '✅ Todos os usuários foram resetados!';
  RAISE NOTICE '💡 Execute os scripts 03, 04 e 05 novamente para reconfigurar.';
END $$;

-- =====================================================
-- VERIFICAR STATUS APÓS RESET
-- =====================================================
SELECT 
  au.email,
  up.diagnostico_completo,
  CASE 
    WHEN EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = au.id AND s.area = 'nutri' AND s.status = 'active') 
    THEN '✅ Com assinatura'
    ELSE '❌ Sem assinatura'
  END as status_assinatura
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN ('nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com')
ORDER BY au.email;


