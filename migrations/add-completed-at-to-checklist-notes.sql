-- =====================================================
-- Adicionar campo completed_at à tabela journey_checklist_notes
-- =====================================================

-- Adicionar coluna completed_at se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'journey_checklist_notes' 
    AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE journey_checklist_notes 
    ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    
    RAISE NOTICE 'Coluna completed_at adicionada à tabela journey_checklist_notes';
  ELSE
    RAISE NOTICE 'Coluna completed_at já existe na tabela journey_checklist_notes';
  END IF;
END $$;

