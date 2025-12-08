-- =====================================================
-- WELLNESS SYSTEM - ADICIONAR SHORT_CODE EM CUSTOM_FORMS
-- Migração 006: Adicionar coluna short_code para URLs encurtadas
-- =====================================================

DO $$
BEGIN
  -- Adicionar coluna short_code se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_forms'
    AND column_name = 'short_code'
  ) THEN
    ALTER TABLE custom_forms
    ADD COLUMN short_code VARCHAR(20) UNIQUE;

    -- Criar índice para busca rápida
    CREATE INDEX IF NOT EXISTS idx_custom_forms_short_code 
    ON custom_forms(short_code) 
    WHERE short_code IS NOT NULL;

    -- Comentário
    COMMENT ON COLUMN custom_forms.short_code IS 'Código curto para URL encurtada (ex: /p/{short_code})';
  END IF;
END $$;


