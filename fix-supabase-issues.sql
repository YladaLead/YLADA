-- Script para corrigir problemas detectados no Supabase
-- Execute este script no Supabase SQL Editor

-- 1. Criar tabela translation_quality se não existir
CREATE TABLE IF NOT EXISTS translation_quality (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text TEXT NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  quality_score DECIMAL(3,2) DEFAULT 0.5,
  ai_model VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela ai_translations_cache se não existir
CREATE TABLE IF NOT EXISTS ai_translations_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text_hash VARCHAR(64) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  ai_model VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_text_hash, target_language)
);

-- 3. Criar função get_table_info se não existir
CREATE OR REPLACE FUNCTION get_table_info(table_name TEXT)
RETURNS TABLE(
  column_name TEXT,
  data_type TEXT,
  is_nullable TEXT,
  column_default TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::TEXT,
    c.data_type::TEXT,
    c.is_nullable::TEXT,
    COALESCE(c.column_default::TEXT, '')
  FROM information_schema.columns c
  WHERE c.table_name = $1
  AND c.table_schema = 'public'
  ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql;

-- 4. Criar função get_indexes se não existir
CREATE OR REPLACE FUNCTION get_indexes(table_name TEXT)
RETURNS TABLE(
  index_name TEXT,
  index_type TEXT,
  column_names TEXT,
  is_unique BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.indexname::TEXT,
    CASE 
      WHEN i.indexdef LIKE '%UNIQUE%' THEN 'UNIQUE'
      ELSE 'BTREE'
    END::TEXT,
    STRING_AGG(a.attname, ', ' ORDER BY a.attnum)::TEXT,
    i.indexdef LIKE '%UNIQUE%'
  FROM pg_indexes i
  JOIN pg_class c ON c.relname = i.tablename
  JOIN pg_index idx ON idx.indexrelid = (i.schemaname||'.'||i.indexname)::regclass
  JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = ANY(idx.indkey)
  WHERE i.tablename = $1
  AND i.schemaname = 'public'
  GROUP BY i.indexname, i.indexdef
  ORDER BY i.indexname;
END;
$$ LANGUAGE plpgsql;

-- 5. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_translation_quality_language ON translation_quality(target_language);
CREATE INDEX IF NOT EXISTS idx_translation_quality_created_at ON translation_quality(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_translations_cache_hash ON ai_translations_cache(source_text_hash);
CREATE INDEX IF NOT EXISTS idx_ai_translations_cache_language ON ai_translations_cache(target_language);

-- 6. Habilitar RLS nas novas tabelas
ALTER TABLE translation_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_translations_cache ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas RLS básicas (permitir tudo por enquanto)
CREATE POLICY "Allow all operations on translation_quality" ON translation_quality
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on ai_translations_cache" ON ai_translations_cache
  FOR ALL USING (true);

-- 8. Verificar se tudo foi criado corretamente
SELECT 'translation_quality' as table_name, COUNT(*) as row_count FROM translation_quality
UNION ALL
SELECT 'ai_translations_cache' as table_name, COUNT(*) as row_count FROM ai_translations_cache;

-- 9. Testar as funções
SELECT * FROM get_table_info('translation_quality') LIMIT 5;
SELECT * FROM get_indexes('translation_quality') LIMIT 5;
