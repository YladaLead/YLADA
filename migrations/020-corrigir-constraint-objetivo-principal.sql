-- =====================================================
-- CORRIGIR CONSTRAINT objetivo_principal
-- Migração 020: Garantir que todos os valores válidos estejam na constraint
-- =====================================================

-- Remover constraint antiga se existir
DO $$ 
BEGIN
  -- Remover constraint antiga
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'wellness_noel_profile_objetivo_principal_check'
    AND table_name = 'wellness_noel_profile'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    DROP CONSTRAINT wellness_noel_profile_objetivo_principal_check;
  END IF;
END $$;

-- Adicionar nova constraint com TODOS os valores válidos
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'objetivo_principal'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD CONSTRAINT wellness_noel_profile_objetivo_principal_check 
    CHECK (objetivo_principal IN (
      -- Valores novos (atualizados)
      'usar_recomendar',
      'renda_extra',
      'carteira',
      'plano_presidente',
      'fechado',
      'funcional',
      -- Valores antigos (manter compatibilidade)
      'vender_mais',
      'construir_carteira',
      'melhorar_rotina',
      'voltar_ritmo',
      'aprender_divulgar'
    ));
  END IF;
END $$;

-- Comentário
COMMENT ON CONSTRAINT wellness_noel_profile_objetivo_principal_check 
ON wellness_noel_profile IS 'Valida os valores permitidos para objetivo_principal';
