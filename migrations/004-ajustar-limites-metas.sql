-- =====================================================
-- WELLNESS SYSTEM - AJUSTAR LIMITES DE METAS
-- Migração 004: Aumentar limites de meta_pv e meta_financeira
-- 
-- Meta PV: 100-10000 → 100-50000
-- Meta Financeira: 500-20000 → 500-200000
-- =====================================================

DO $$ 
BEGIN
  -- 1. AUMENTAR LIMITE DE META PV (de 10000 para 50000)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'meta_pv'
  ) THEN
    -- Remover constraint antiga
    ALTER TABLE wellness_noel_profile DROP CONSTRAINT IF EXISTS wellness_noel_profile_meta_pv_check;
    
    -- Adicionar nova constraint com limite maior
    ALTER TABLE wellness_noel_profile ADD CONSTRAINT wellness_noel_profile_meta_pv_check 
      CHECK (meta_pv >= 100 AND meta_pv <= 50000);
      
    -- Atualizar comentário
    COMMENT ON COLUMN wellness_noel_profile.meta_pv IS 'Meta de PV mensal (100-50000)';
  END IF;
  
  -- 2. AUMENTAR LIMITE DE META FINANCEIRA (de 20000 para 200000)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'meta_financeira'
  ) THEN
    -- Remover constraint antiga
    ALTER TABLE wellness_noel_profile DROP CONSTRAINT IF EXISTS wellness_noel_profile_meta_financeira_check;
    
    -- Adicionar nova constraint com limite maior
    ALTER TABLE wellness_noel_profile ADD CONSTRAINT wellness_noel_profile_meta_financeira_check 
      CHECK (meta_financeira >= 500 AND meta_financeira <= 200000);
      
    -- Atualizar comentário
    COMMENT ON COLUMN wellness_noel_profile.meta_financeira IS 'Meta financeira mensal (500-200000)';
  END IF;
END $$;
