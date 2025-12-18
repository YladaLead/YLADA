-- =====================================================
-- SCRIPT: Reset Completo para Testes
-- =====================================================
-- Use este script para resetar TUDO e começar do zero
-- Isso permite testar o fluxo completo desde o início
-- =====================================================

-- ⚠️⚠️⚠️ ANTES DE EXECUTAR ⚠️⚠️⚠️
-- 1. Execute primeiro: listar-emails-usuarios.sql
-- 2. Copie o email do usuário que você quer resetar
-- 3. Substitua 'seu-email@exemplo.com' abaixo pelo email REAL
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'seu-email@exemplo.com'; -- ⚠️⚠️⚠️ SUBSTITUA AQUI PELO EMAIL REAL ⚠️⚠️⚠️
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email: %', v_email;
  END IF;

  -- 1. Deletar diagnóstico
  DELETE FROM nutri_diagnostico WHERE user_id = v_user_id;
  
  -- 2. Resetar flag no perfil
  UPDATE user_profiles 
  SET diagnostico_completo = false 
  WHERE user_id = v_user_id;

  -- 3. Deletar progresso da jornada
  DELETE FROM journey_progress WHERE user_id = v_user_id;

  -- 4. Deletar perfil estratégico (opcional)
  DELETE FROM nutri_perfil_estrategico WHERE user_id = v_user_id;

  -- 5. Deletar análises da LYA (opcional)
  DELETE FROM lya_analise_nutri WHERE user_id = v_user_id;

  RAISE NOTICE 'Reset completo realizado para usuário: %', v_email;
  RAISE NOTICE 'Agora você pode testar o fluxo desde o início!';
END $$;

-- =====================================================
-- 3. VERIFICAR RESULTADO
-- =====================================================
-- ⚠️⚠️⚠️ SUBSTITUA O EMAIL AQUI TAMBÉM ⚠️⚠️⚠️
-- Use o MESMO email que você colocou na variável v_email acima
SELECT 
  up.email,
  up.diagnostico_completo,
  CASE WHEN nd.user_id IS NULL THEN 'Sem diagnóstico' ELSE 'Com diagnóstico' END as status_diagnostico,
  COUNT(jp.day_number) as dias_completos,
  CASE 
    WHEN COUNT(jp.day_number) = 0 THEN 'Sem jornada iniciada'
    WHEN MAX(jp.day_number) <= 7 THEN 'Fase 1'
    WHEN MAX(jp.day_number) <= 15 THEN 'Fase 2'
    ELSE 'Fase 3'
  END as fase_atual
FROM user_profiles up
LEFT JOIN nutri_diagnostico nd ON up.user_id = nd.user_id
LEFT JOIN journey_progress jp ON up.user_id = jp.user_id AND jp.completed = true
WHERE up.email = 'seu-email@exemplo.com' -- ⚠️⚠️⚠️ SUBSTITUA AQUI PELO EMAIL REAL ⚠️⚠️⚠️
GROUP BY up.email, up.diagnostico_completo, nd.user_id;



