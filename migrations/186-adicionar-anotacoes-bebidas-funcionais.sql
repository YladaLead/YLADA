-- ============================================
-- MIGRAÇÃO 186: Adicionar campo anotacoes_bebidas_funcionais na tabela wellness_noel_profile
-- Data: 2025-01-28
-- Objetivo: Adicionar campo de texto livre para anotações sobre trabalho com bebidas funcionais que o NOEL usa para personalizar respostas
-- ============================================

-- Adicionar coluna anotacoes_bebidas_funcionais
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'anotacoes_bebidas_funcionais'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN anotacoes_bebidas_funcionais TEXT;
    
    COMMENT ON COLUMN wellness_noel_profile.anotacoes_bebidas_funcionais IS 'Anotações pessoais sobre trabalho com bebidas funcionais (espaço da saudável, rotina, desafios, etc.) que o NOEL usa para personalizar orientações';
  END IF;
END $$;
