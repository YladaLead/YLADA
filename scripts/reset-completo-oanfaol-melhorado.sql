-- =====================================================
-- SCRIPT: Reset Completo - Busca Inteligente
-- Email procurado: oanfaol@gmail.com
-- =====================================================
-- Este script tenta encontrar o email mesmo com variações
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email_procurado TEXT := 'oanfaol@gmail.com';
  v_email_encontrado TEXT;
BEGIN
  -- Tentativa 1: Busca exata (case-insensitive)
  SELECT id, email INTO v_user_id, v_email_encontrado
  FROM auth.users
  WHERE LOWER(email) = LOWER(v_email_procurado)
  LIMIT 1;

  -- Tentativa 2: Se não encontrou, busca parcial
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Email exato não encontrado. Buscando emails similares...';
    
    SELECT id, email INTO v_user_id, v_email_encontrado
    FROM auth.users
    WHERE email ILIKE '%oanfaol%'
       OR email ILIKE '%oan%faol%'
    LIMIT 1;
  END IF;

  -- Tentativa 3: Se ainda não encontrou, busca em user_profiles
  IF v_user_id IS NULL THEN
    SELECT up.user_id, up.email INTO v_user_id, v_email_encontrado
    FROM user_profiles up
    WHERE up.email ILIKE '%oanfaol%'
    LIMIT 1;
  END IF;

  -- Se ainda não encontrou, mostrar erro com sugestões
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email: %. Execute listar-emails-usuarios.sql para ver emails disponíveis.', v_email_procurado;
  END IF;

  RAISE NOTICE 'Email encontrado: % (User ID: %)', v_email_encontrado, v_user_id;

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
  DELETE FROM lya_analise WHERE user_id = v_user_id;

  RAISE NOTICE '✅ Reset completo realizado para: %', v_email_encontrado;
  RAISE NOTICE '✅ Agora você pode testar o fluxo desde o início!';
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
WHERE au.email ILIKE '%oanfaol%'
   OR up.email ILIKE '%oanfaol%'
GROUP BY au.email, up.diagnostico_completo, nd.user_id;


