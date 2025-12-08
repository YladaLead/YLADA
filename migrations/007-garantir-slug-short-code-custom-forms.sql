-- Migração para garantir que as colunas slug e short_code existam na tabela custom_forms
-- Esta migração é idempotente e pode ser executada múltiplas vezes

DO $$
BEGIN
  -- Adicionar coluna slug se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_forms'
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE custom_forms
    ADD COLUMN slug VARCHAR(255);
    
    COMMENT ON COLUMN custom_forms.slug IS 'Slug amigável para URL (ex: /pt/c/{user_slug}/formulario/{slug})';
    
    RAISE NOTICE 'Coluna slug adicionada à tabela custom_forms';
  ELSE
    RAISE NOTICE 'Coluna slug já existe na tabela custom_forms';
  END IF;

  -- Adicionar coluna short_code se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_forms'
    AND column_name = 'short_code'
  ) THEN
    ALTER TABLE custom_forms
    ADD COLUMN short_code VARCHAR(20) UNIQUE;
    
    -- Criar índice para short_code se não existir
    CREATE INDEX IF NOT EXISTS idx_custom_forms_short_code 
    ON custom_forms(short_code) 
    WHERE short_code IS NOT NULL;
    
    COMMENT ON COLUMN custom_forms.short_code IS 'Código curto para URL encurtada (ex: /p/{short_code})';
    
    RAISE NOTICE 'Coluna short_code adicionada à tabela custom_forms';
  ELSE
    RAISE NOTICE 'Coluna short_code já existe na tabela custom_forms';
  END IF;

  -- Criar índice para slug se não existir (para melhor performance em buscas)
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'custom_forms'
    AND indexname = 'idx_custom_forms_slug'
  ) THEN
    CREATE INDEX idx_custom_forms_slug 
    ON custom_forms(user_id, slug) 
    WHERE slug IS NOT NULL;
    
    RAISE NOTICE 'Índice idx_custom_forms_slug criado';
  ELSE
    RAISE NOTICE 'Índice idx_custom_forms_slug já existe';
  END IF;

END $$;

-- Verificar se as colunas foram criadas corretamente
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'custom_forms'
AND column_name IN ('slug', 'short_code')
ORDER BY column_name;


