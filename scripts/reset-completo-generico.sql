-- =====================================================
-- SCRIPT: Reset Completo para Testes (GENÉRICO)
-- =====================================================
-- Este script permite resetar usando o USER_ID diretamente
-- Útil quando o email não é encontrado
-- =====================================================

-- ⚠️ OPÇÃO 1: Usar USER_ID diretamente
-- Se você souber o user_id, use este bloco:

/*
DO $$
DECLARE
  v_user_id UUID := '00000000-0000-0000-0000-000000000000'; -- ⚠️ SUBSTITUA PELO USER_ID REAL
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
    RAISE EXCEPTION 'Usuário não encontrado com ID: %', v_user_id;
  END IF;

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

  RAISE NOTICE 'Reset completo realizado para user_id: %', v_user_id;
END $$;
*/

-- ⚠️ OPÇÃO 2: Buscar por email (case-insensitive)
-- Este bloco busca o email ignorando maiúsculas/minúsculas

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'oanfaol@gmail.com'; -- ⚠️ Tente variações: Oanfaol, OANFAOL, etc.
BEGIN
  -- Buscar email (case-insensitive)
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(v_email);

  IF v_user_id IS NULL THEN
    -- Tentar buscar emails similares
    RAISE NOTICE 'Email exato não encontrado. Procurando emails similares...';
    
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email ILIKE '%oanfaol%'
    LIMIT 1;
    
    IF v_user_id IS NULL THEN
      RAISE EXCEPTION 'Usuário não encontrado. Execute: verificar-email-oanfaol.sql para ver emails disponíveis';
    ELSE
      RAISE NOTICE 'Encontrado email similar. User ID: %', v_user_id;
    END IF;
  END IF;

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

  RAISE NOTICE 'Reset completo realizado para user_id: %', v_user_id;
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
GROUP BY au.email, up.diagnostico_completo, nd.user_id;


