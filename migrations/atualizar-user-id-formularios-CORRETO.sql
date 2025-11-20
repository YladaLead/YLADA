-- Script para atualizar o user_id dos formulários para o usuário correto
-- Baseado no user_id do console: d7afdf33-8ee7-42ee-b083-5376015c60f8
-- Execute este script no Supabase SQL Editor

DO $$
DECLARE
  v_novo_user_id UUID := 'd7afdf33-8ee7-42ee-b083-5376015c60f8'::UUID;  -- User ID do usuário logado
  v_atualizados INTEGER;
BEGIN
  -- Verificar se o user_id é válido
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_novo_user_id) THEN
    RAISE EXCEPTION 'User ID inválido. Verifique se está correto.';
  END IF;

  -- Atualizar user_id dos formulários de exemplo
  UPDATE custom_forms
  SET user_id = v_novo_user_id,
      updated_at = NOW()
  WHERE (user_id = 'aae94961-3c29-4743-8538-fcad5c95cac7' OR name LIKE '%Exemplo%')
    AND (name LIKE '%Exemplo%' OR name LIKE '%exemplo%' OR description LIKE '%exemplo%');

  GET DIAGNOSTICS v_atualizados = ROW_COUNT;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Formulários atualizados: %', v_atualizados;
  RAISE NOTICE 'Novo user_id: %', v_novo_user_id;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Recarregue a página de formulários para ver as mudanças.';

END $$;

