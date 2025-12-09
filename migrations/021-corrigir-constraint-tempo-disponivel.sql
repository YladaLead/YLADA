-- =====================================================
-- CORRIGIR CONSTRAINT tempo_disponivel
-- Migração 021: Garantir que todos os valores válidos estejam na constraint
-- =====================================================

-- Remover constraint antiga se existir
DO $$ 
BEGIN
  -- Remover constraint antiga
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'wellness_noel_profile_tempo_disponivel_check'
    AND table_name = 'wellness_noel_profile'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    DROP CONSTRAINT wellness_noel_profile_tempo_disponivel_check;
  END IF;
END $$;

-- Adicionar nova constraint com TODOS os valores válidos
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'tempo_disponivel'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD CONSTRAINT wellness_noel_profile_tempo_disponivel_check 
    CHECK (tempo_disponivel IN (
      -- Valores novos (atualizados)
      '5min',
      '15min',
      '30min',
      '1h',
      '1h_plus',
      -- Valores antigos (manter compatibilidade)
      '15_minutos',
      '30_minutos',
      '1_hora',
      'mais_1_hora'
    ));
  END IF;
END $$;

-- Comentário
COMMENT ON CONSTRAINT wellness_noel_profile_tempo_disponivel_check 
ON wellness_noel_profile IS 'Valida os valores permitidos para tempo_disponivel';
