-- =====================================================
-- MIGRATION: Adicionar campo viewed em form_responses
-- =====================================================
-- Objetivo: Permitir rastrear quais respostas de formulários foram visualizadas pelo coach
-- Data: 2025-01-06

DO $$
BEGIN
  -- Adicionar campo viewed se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'form_responses'
    AND column_name = 'viewed'
  ) THEN
    ALTER TABLE form_responses
    ADD COLUMN viewed BOOLEAN DEFAULT false;
    
    COMMENT ON COLUMN form_responses.viewed IS 'Indica se a resposta foi visualizada pelo coach';
    
    RAISE NOTICE 'Coluna viewed adicionada à tabela form_responses';
  ELSE
    RAISE NOTICE 'Coluna viewed já existe na tabela form_responses';
  END IF;

  -- Criar índice para performance (buscar respostas não visualizadas por user_id)
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'form_responses'
    AND indexname = 'idx_form_responses_viewed'
  ) THEN
    CREATE INDEX idx_form_responses_viewed 
    ON form_responses(user_id, viewed, created_at DESC);
    
    RAISE NOTICE 'Índice idx_form_responses_viewed criado';
  ELSE
    RAISE NOTICE 'Índice idx_form_responses_viewed já existe';
  END IF;

  -- Marcar todas as respostas antigas como visualizadas (para não gerar notificações de dados antigos)
  UPDATE form_responses
  SET viewed = true
  WHERE viewed IS NULL OR viewed = false;
  
  RAISE NOTICE 'Respostas antigas marcadas como visualizadas';
END $$;


