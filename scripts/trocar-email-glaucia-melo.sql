-- =====================================================
-- Trocar e-mail da Glaucia Melo (sem alterar senha)
-- De: dra.glauciamelo..nutri@gmail.com
-- Para: glauciajomelo@outlook.com
-- =====================================================
-- Execute no Supabase → SQL Editor (como superuser / service role).
-- O login passará a ser com o novo e-mail e a mesma senha.
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email_antigo TEXT := 'dra.glauciamelo..nutri@gmail.com';
  v_email_novo   TEXT := 'glauciajomelo@outlook.com';
BEGIN
  -- 1. Localizar usuário pelo e-mail atual
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(trim(email)) = LOWER(trim(v_email_antigo))
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com e-mail: %. Verifique o endereço.', v_email_antigo;
  END IF;

  -- 2. Atualizar e-mail em auth.users (senha não é alterada)
  UPDATE auth.users
  SET email = v_email_novo
  WHERE id = v_user_id;

  -- 3. Atualizar e-mail em user_profiles (se existir linha)
  UPDATE user_profiles
  SET email = v_email_novo,
      updated_at = NOW()
  WHERE user_id = v_user_id;

  RAISE NOTICE '✅ E-mail atualizado com sucesso. user_id: %. Login: % (mesma senha)', v_user_id, v_email_novo;
END $$;

-- Verificação (opcional): conferir após executar
SELECT
  au.id,
  au.email AS auth_email,
  au.created_at,
  up.email AS profile_email,
  up.nome_completo
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
WHERE au.email = 'glauciajomelo@outlook.com';
