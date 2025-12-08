-- =====================================================
-- MIGRATION 009: Adicionar coluna tipo_mentor
-- Suporta múltiplos mentores por área (NOEL, Vendedor, Suporte)
-- =====================================================

BEGIN;

-- Adicionar coluna tipo_mentor na tabela ylada_wellness_base_conhecimento
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ylada_wellness_base_conhecimento' 
    AND column_name = 'tipo_mentor'
  ) THEN
    ALTER TABLE ylada_wellness_base_conhecimento 
    ADD COLUMN tipo_mentor TEXT DEFAULT 'noel' 
    CHECK (tipo_mentor IN ('noel', 'vendedor', 'suporte'));
    
    COMMENT ON COLUMN ylada_wellness_base_conhecimento.tipo_mentor IS 
    'Tipo de mentor: noel (estratégico), vendedor (conversão), suporte (técnico)';
  END IF;
END $$;

-- Criar índice para busca por tipo_mentor
CREATE INDEX IF NOT EXISTS idx_wellness_base_tipo_mentor 
ON ylada_wellness_base_conhecimento(tipo_mentor);

-- Adicionar coluna tipo_mentor na tabela wellness_objecoes (se existir)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'wellness_objecoes'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_objecoes' 
      AND column_name = 'tipo_mentor'
    ) THEN
      ALTER TABLE wellness_objecoes 
      ADD COLUMN tipo_mentor TEXT DEFAULT 'noel' 
      CHECK (tipo_mentor IN ('noel', 'vendedor', 'suporte'));
    END IF;
  END IF;
END $$;

COMMIT;

