-- Script para executar a migração de slug e short_code
-- Execute este script no Supabase SQL Editor ou no seu cliente PostgreSQL

-- =====================================================
-- MIGRAÇÃO: Garantir colunas slug e short_code em custom_forms
-- =====================================================

-- Adicionar coluna slug se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_forms'
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE custom_forms
    ADD COLUMN slug VARCHAR(255);
    
    COMMENT ON COLUMN custom_forms.slug IS 'Slug amigável para URL (ex: /pt/c/{user_slug}/formulario/{slug})';
    
    RAISE NOTICE '✅ Coluna slug adicionada à tabela custom_forms';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna slug já existe na tabela custom_forms';
  END IF;
END $$;

-- Adicionar coluna short_code se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_forms'
    AND column_name = 'short_code'
  ) THEN
    ALTER TABLE custom_forms
    ADD COLUMN short_code VARCHAR(20) UNIQUE;
    
    COMMENT ON COLUMN custom_forms.short_code IS 'Código curto para URL encurtada (ex: /p/{short_code})';
    
    RAISE NOTICE '✅ Coluna short_code adicionada à tabela custom_forms';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna short_code já existe na tabela custom_forms';
  END IF;
END $$;

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_custom_forms_short_code 
ON custom_forms(short_code) 
WHERE short_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_custom_forms_slug 
ON custom_forms(user_id, slug) 
WHERE slug IS NOT NULL;

-- Verificar se as colunas foram criadas
SELECT 
  'Verificação das colunas:' as info,
  column_name,
  data_type,
  character_maximum_length as max_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'custom_forms'
AND column_name IN ('slug', 'short_code')
ORDER BY column_name;

-- Verificar quantos formulários já têm slug
SELECT 
  'Estatísticas:' as info,
  COUNT(*) as total_formularios,
  COUNT(slug) as com_slug,
  COUNT(short_code) as com_short_code,
  COUNT(*) - COUNT(slug) as sem_slug
FROM custom_forms;


