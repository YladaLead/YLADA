-- =====================================================
-- SCRIPT: Resetar Jornada para Testes
-- =====================================================
-- Use este script para resetar o progresso da jornada
-- Isso permite testar diferentes fases

-- =====================================================
-- SCRIPT: Resetar Jornada para Testes
-- =====================================================
-- Use este script para resetar o progresso da jornada
-- Isso permite testar diferentes fases
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

  -- Deletar todo o progresso da jornada
  DELETE FROM journey_progress WHERE user_id = v_user_id;
  
  RAISE NOTICE 'Jornada resetada para usuário: %', v_email;
END $$;

-- =====================================================
-- 3. AVANÇAR PARA FASE ESPECÍFICA (OPÇÃO 2)
-- =====================================================
-- Descomente e ajuste o day_number para testar fases específicas:

/*
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'seu-email@exemplo.com'; -- ⚠️⚠️⚠️ SUBSTITUA AQUI PELO EMAIL REAL ⚠️⚠️⚠️
  v_day_number INTEGER := 8; -- Ajuste aqui: 1-7 (Fase 1), 8-15 (Fase 2), 16-30 (Fase 3)
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email: %', v_email;
  END IF;

  -- Deletar progresso atual
  DELETE FROM journey_progress WHERE user_id = v_user_id;
  
  -- Criar progresso até o dia desejado (marcando como completo)
  FOR i IN 1..v_day_number LOOP
    INSERT INTO journey_progress (user_id, day_number, week_number, completed, completed_at)
    VALUES (
      v_user_id,
      i,
      CASE 
        WHEN i <= 7 THEN 1
        WHEN i <= 14 THEN 2
        WHEN i <= 21 THEN 3
        ELSE 4
      END,
      true,
      NOW()
    )
    ON CONFLICT (user_id, day_number) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Jornada avançada até dia % para usuário: %', v_day_number, v_email;
END $$;
*/

-- =====================================================
-- 4. VERIFICAR RESULTADO
-- =====================================================
-- ⚠️⚠️⚠️ SUBSTITUA O EMAIL AQUI TAMBÉM ⚠️⚠️⚠️
-- Use o MESMO email que você colocou na variável v_email acima
SELECT 
  up.email,
  COUNT(jp.day_number) as dias_completos,
  MAX(jp.day_number) as maior_dia_completo,
  CASE 
    WHEN MAX(jp.day_number) IS NULL THEN 'Sem jornada iniciada'
    WHEN MAX(jp.day_number) <= 7 THEN 'Fase 1: Fundamentos'
    WHEN MAX(jp.day_number) <= 15 THEN 'Fase 2: Captação & Posicionamento'
    ELSE 'Fase 3: Gestão & Escala'
  END as fase_atual
FROM user_profiles up
LEFT JOIN journey_progress jp ON up.user_id = jp.user_id AND jp.completed = true
WHERE up.email = 'seu-email@exemplo.com' -- ⚠️⚠️⚠️ SUBSTITUA AQUI PELO EMAIL REAL ⚠️⚠️⚠️
GROUP BY up.email;


