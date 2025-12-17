-- =====================================================
-- SCRIPT: Criar Diagnósticos para nutri2 e nutri3
-- =====================================================
-- Execute este script APÓS criar os perfis (03-criar-todos-usuarios-teste.sql)
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  usuarios_com_diagnostico TEXT[] := ARRAY['nutri2@ylada.com', 'nutri3@ylada.com'];
  v_email TEXT;
BEGIN
  FOREACH v_email IN ARRAY usuarios_com_diagnostico
  LOOP
    -- Buscar user_id
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email;

    IF v_user_id IS NULL THEN
      RAISE NOTICE '⚠️ Usuário não encontrado: %', v_email;
      CONTINUE;
    END IF;

    -- Criar diagnóstico básico
    INSERT INTO nutri_diagnostico (
      user_id,
      perfil_atual,
      experiencia_anos,
      tipo_atendimento,
      faturamento_mensal,
      principais_desafios,
      objetivos_principais,
      created_at,
      updated_at
    )
    VALUES (
      v_user_id,
      'consultoria_individual',
      3,
      'presencial_online',
      5000,
      ARRAY['captacao', 'organizacao'],
      ARRAY['aumentar_faturamento', 'organizar_atendimentos'],
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE
    SET 
      perfil_atual = 'consultoria_individual',
      experiencia_anos = 3,
      tipo_atendimento = 'presencial_online',
      faturamento_mensal = 5000,
      principais_desafios = ARRAY['captacao', 'organizacao'],
      objetivos_principais = ARRAY['aumentar_faturamento', 'organizar_atendimentos'],
      updated_at = NOW();

    -- Atualizar flag no perfil
    UPDATE user_profiles 
    SET diagnostico_completo = true 
    WHERE user_id = v_user_id;

    RAISE NOTICE '✅ Diagnóstico criado para: %', v_email;
  END LOOP;
END $$;

-- =====================================================
-- VERIFICAR SE FUNCIONOU
-- =====================================================
SELECT 
  au.email,
  up.diagnostico_completo,
  nd.perfil_atual,
  nd.experiencia_anos
FROM auth.users au
JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN nutri_diagnostico nd ON au.id = nd.user_id
WHERE au.email IN ('nutri2@ylada.com', 'nutri3@ylada.com')
ORDER BY au.email;


