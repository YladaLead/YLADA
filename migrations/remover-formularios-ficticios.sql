-- Script para remover formulários fictícios de teste
-- Execute este script no Supabase SQL Editor quando terminar os testes

DO $$
DECLARE
  v_user_id UUID;
  v_deleted_count INTEGER;
BEGIN
  -- Buscar o primeiro usuário nutri disponível
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE id IN (
    SELECT user_id FROM user_profiles WHERE perfil = 'nutri'
    LIMIT 1
  )
  LIMIT 1;

  -- Se não encontrar, tentar qualquer usuário
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id
    FROM auth.users
    LIMIT 1;
  END IF;

  -- Verificar se encontrou um usuário
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado.';
  END IF;

  -- Deletar formulários fictícios (que contêm "Exemplo" ou "Fictício" no nome)
  DELETE FROM custom_forms
  WHERE user_id = v_user_id
    AND (
      name ILIKE '%exemplo%' 
      OR name ILIKE '%fictício%'
      OR name ILIKE '%ficticio%'
      OR name ILIKE '%teste%'
      OR description ILIKE '%exemplo%'
      OR description ILIKE '%fictício%'
      OR description ILIKE '%ficticio%'
    );

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RAISE NOTICE 'Formulários fictícios removidos: %', v_deleted_count;

END $$;

