-- Script para atualizar o user_id dos formulários para o usuário logado
-- Use este script se os formulários foram criados com um user_id diferente
--
-- INSTRUÇÕES:
-- 1. Execute primeiro para descobrir seu user_id:
--    SELECT id, email FROM auth.users WHERE id IN (SELECT user_id FROM user_profiles WHERE perfil = 'nutri');
--
-- 2. Substitua 'SEU_USER_ID_AQUI' abaixo pelo seu user_id real
-- 3. Execute o script completo

DO $$
DECLARE
  v_novo_user_id UUID := 'SEU_USER_ID_AQUI'::UUID;  -- SUBSTITUA AQUI pelo seu user_id
  v_antigo_user_id UUID := 'aae94961-3c29-4743-8538-fcad5c95cac7';  -- user_id dos formulários criados
  v_atualizados INTEGER;
BEGIN
  -- Verificar se o novo user_id é válido
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_novo_user_id) THEN
    RAISE EXCEPTION 'User ID inválido. Execute primeiro: SELECT id, email FROM auth.users WHERE id IN (SELECT user_id FROM user_profiles WHERE perfil = ''nutri'');';
  END IF;

  -- Atualizar user_id dos formulários
  UPDATE custom_forms
  SET user_id = v_novo_user_id,
      updated_at = NOW()
  WHERE user_id = v_antigo_user_id
    AND name LIKE '%Exemplo%';

  GET DIAGNOSTICS v_atualizados = ROW_COUNT;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Formulários atualizados: %', v_atualizados;
  RAISE NOTICE 'Novo user_id: %', v_novo_user_id;
  RAISE NOTICE '========================================';

END $$;

