-- =====================================================
-- SCRIPT: Resetar Diagnóstico para Testes
-- =====================================================
-- Use este script para resetar o diagnóstico de um usuário
-- Isso permite testar o fluxo de onboarding novamente

-- =====================================================
-- SCRIPT: Resetar Diagnóstico para Testes
-- =====================================================
-- Use este script para resetar o diagnóstico de um usuário
-- Isso permite testar o fluxo de onboarding novamente
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
  -- Buscar user_id pelo email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email: %', v_email;
  END IF;

  -- Deletar diagnóstico
  DELETE FROM nutri_diagnostico WHERE user_id = v_user_id;
  
  -- Resetar flag no perfil
  UPDATE user_profiles 
  SET diagnostico_completo = false 
  WHERE user_id = v_user_id;

  RAISE NOTICE 'Diagnóstico resetado para usuário: %', v_email;
END $$;

-- =====================================================
-- 3. VERIFICAR RESULTADO
-- =====================================================
-- ⚠️⚠️⚠️ SUBSTITUA O EMAIL AQUI TAMBÉM ⚠️⚠️⚠️
-- Use o MESMO email que você colocou na variável v_email acima
SELECT 
  up.email,
  up.diagnostico_completo,
  CASE WHEN nd.user_id IS NULL THEN 'Sem diagnóstico' ELSE 'Com diagnóstico' END as status_diagnostico
FROM user_profiles up
LEFT JOIN nutri_diagnostico nd ON up.user_id = nd.user_id
WHERE up.email = 'seu-email@exemplo.com'; -- ⚠️⚠️⚠️ SUBSTITUA AQUI PELO EMAIL REAL ⚠️⚠️⚠️


