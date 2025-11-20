-- Script para atualizar automaticamente o user_id dos formulários
-- Este script atualiza os formulários de exemplo para o primeiro usuário nutri encontrado
-- Execute este script no Supabase SQL Editor

DO $$
DECLARE
  v_novo_user_id UUID;
  v_antigo_user_id UUID := 'aae94961-3c29-4743-8538-fcad5c95cac7';  -- user_id dos formulários criados
  v_atualizados INTEGER;
  v_user_email TEXT;
BEGIN
  -- Buscar o primeiro usuário nutri disponível
  SELECT u.id, u.email INTO v_novo_user_id, v_user_email
  FROM auth.users u
  WHERE u.id IN (
    SELECT user_id FROM user_profiles WHERE perfil = 'nutri'
    LIMIT 1
  )
  LIMIT 1;

  -- Se não encontrar, tentar qualquer usuário
  IF v_novo_user_id IS NULL THEN
    SELECT id, email INTO v_novo_user_id, v_user_email
    FROM auth.users
    LIMIT 1;
  END IF;

  -- Verificar se encontrou um usuário
  IF v_novo_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado.';
  END IF;

  -- Atualizar user_id dos formulários de exemplo
  -- Atualiza tanto os formulários com o user_id antigo quanto qualquer formulário de exemplo
  UPDATE custom_forms
  SET user_id = v_novo_user_id,
      updated_at = NOW()
  WHERE (user_id = v_antigo_user_id OR user_id = 'aae94961-3c29-4743-8538-fcad5c95cac7')
    AND (name LIKE '%Exemplo%' OR name LIKE '%exemplo%' OR description LIKE '%exemplo%');

  GET DIAGNOSTICS v_atualizados = ROW_COUNT;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Formulários atualizados: %', v_atualizados;
  RAISE NOTICE 'Novo usuário: % (ID: %)', v_user_email, v_novo_user_id;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Certifique-se de estar logado com o usuário acima.';

END $$;

