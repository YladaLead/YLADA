-- =====================================================
-- CRIAR SENHA PROVISÓRIA PARA ÉRIKA CREMMER
-- Email: evsnutrivibe@gmail.com
-- =====================================================

-- IMPORTANTE: Este script cria uma senha provisória
-- A senha será: Ylada2026!@#
-- O usuário DEVE alterar no primeiro acesso

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'evsnutrivibe@gmail.com';
  v_senha_provisoria TEXT := 'Ylada2026!@#';
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(v_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado!';
  END IF;

  RAISE NOTICE '✅ Usuário encontrado: %', v_user_id;
  RAISE NOTICE '✅ Senha provisória será: %', v_senha_provisoria;
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ IMPORTANTE: Execute o comando abaixo no Supabase Dashboard:';
  RAISE NOTICE '   Vá em Authentication > Users > evsnutrivibe@gmail.com';
  RAISE NOTICE '   Clique em "Reset Password" ou "Update User"';
  RAISE NOTICE '   Defina a senha: Ylada2026!@#';
  RAISE NOTICE '';
  RAISE NOTICE '   OU use a API do Supabase para atualizar a senha.';
  RAISE NOTICE '';

END $$;

-- NOTA: O Supabase não permite alterar senha diretamente via SQL por segurança
-- Você precisa usar o Dashboard ou a API do Supabase
-- 
-- Opção 1: Via Dashboard Supabase
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Vá em Authentication > Users
-- 3. Encontre: evsnutrivibe@gmail.com
-- 4. Clique em "..." > "Reset Password"
-- 5. Defina: Ylada2026!@#
--
-- Opção 2: Via API (se tiver acesso)
-- Use a função admin.updateUserById() com password
