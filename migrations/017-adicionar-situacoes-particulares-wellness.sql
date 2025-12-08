-- ============================================
-- MIGRAÇÃO 017: Adicionar Campo de Situações Particulares
-- Data: 2025-01-27
-- Objetivo: Adicionar campo para o usuário descrever situações pessoais importantes para o NOEL
-- ============================================

-- Adicionar coluna situacoes_particulares
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'situacoes_particulares'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN situacoes_particulares TEXT;
    
    COMMENT ON COLUMN wellness_noel_profile.situacoes_particulares IS 
    'Situações pessoais particulares que podem ser importantes para o NOEL ser um bom orientador (ex: mudança de cidade, novo emprego, desafios pessoais, objetivos específicos)';
  END IF;
END $$;
