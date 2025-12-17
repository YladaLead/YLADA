-- =====================================================
-- SCRIPT: Resetar TODOS os Usuários de Teste
-- =====================================================
-- Este script reseta todos os usuários que terminam com @ylada.com
-- Útil para resetar múltiplos usuários de uma vez
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
  usuarios_resetados INTEGER := 0;
BEGIN
  -- Resetar todos os usuários de teste
  FOR v_user_id, v_email IN
    SELECT au.id, au.email
    FROM auth.users au
    WHERE au.email LIKE '%@ylada.com'
  LOOP
    -- 1. Deletar diagnóstico
    DELETE FROM nutri_diagnostico WHERE user_id = v_user_id;
    
    -- 2. Resetar flag no perfil
    UPDATE user_profiles 
    SET diagnostico_completo = false 
    WHERE user_id = v_user_id;

    -- 3. Deletar progresso da jornada
    DELETE FROM journey_progress WHERE user_id = v_user_id;

    -- 4. Deletar perfil estratégico
    DELETE FROM nutri_perfil_estrategico WHERE user_id = v_user_id;

    -- 5. Deletar análises da LYA
    DELETE FROM lya_analise_nutri WHERE user_id = v_user_id;
    
    usuarios_resetados := usuarios_resetados + 1;
    RAISE NOTICE '✅ Resetado: %', v_email;
  END LOOP;
  
  RAISE NOTICE '✅ Total de usuários resetados: %', usuarios_resetados;
END $$;

-- =====================================================
-- VERIFICAR RESULTADO
-- =====================================================
SELECT 
  au.email,
  up.diagnostico_completo,
  CASE WHEN nd.user_id IS NULL THEN 'Sem diagnóstico' ELSE 'Com diagnóstico' END as status_diagnostico,
  COUNT(jp.day_number) as dias_completos,
  CASE 
    WHEN COUNT(jp.day_number) = 0 THEN 'Sem jornada iniciada'
    WHEN MAX(jp.day_number) <= 7 THEN 'Fase 1'
    WHEN MAX(jp.day_number) <= 15 THEN 'Fase 2'
    ELSE 'Fase 3'
  END as fase_atual
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN nutri_diagnostico nd ON up.user_id = nd.user_id
LEFT JOIN journey_progress jp ON up.user_id = jp.user_id AND jp.completed = true
WHERE au.email LIKE '%@ylada.com'
GROUP BY au.email, up.diagnostico_completo, nd.user_id
ORDER BY au.email;


