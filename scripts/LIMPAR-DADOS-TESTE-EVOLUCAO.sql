-- ==========================================
-- LIMPAR DADOS DE TESTE - EVOLUÇÃO FÍSICA
-- ==========================================
-- 
-- IMPORTANTE: Execute este script para remover os dados de teste
-- criados pelo script POPULAR-DADOS-TESTE-EVOLUCAO.sql
-- 
-- ==========================================

-- Verificar se estamos em ambiente de teste
DO $$
BEGIN
  IF current_database() = 'production' THEN
    RAISE EXCEPTION 'ERRO: Este script não pode ser executado em produção!';
  END IF;
END $$;

-- Remover evoluções dos clientes de teste
DELETE FROM client_evolution 
WHERE client_id IN (
  SELECT id FROM clients 
  WHERE email LIKE 'teste.evolucao.%@ylada.app'
);

-- Remover clientes de teste
DELETE FROM clients 
WHERE email LIKE 'teste.evolucao.%@ylada.app';

-- Confirmação
DO $$
BEGIN
  RAISE NOTICE '==================================';
  RAISE NOTICE 'DADOS DE TESTE REMOVIDOS!';
  RAISE NOTICE '==================================';
  RAISE NOTICE 'Todos os clientes e evoluções de teste foram excluídos.';
END $$;
