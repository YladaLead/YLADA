-- =====================================================
-- ADICIONAR COLUNAS FALTANTES NA TABELA user_profiles
-- Script seguro - Preserva dados existentes
-- =====================================================

-- Função helper para adicionar coluna se não existir
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
    p_table_name TEXT,
    p_column_name TEXT,
    p_column_definition TEXT
)
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns c
        WHERE c.table_schema = 'public' 
          AND c.table_name = p_table_name
          AND c.column_name = p_column_name
    ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
            p_table_name,
            p_column_name,
            p_column_definition
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Adicionar colunas necessárias para Wellness
SELECT add_column_if_not_exists('user_profiles', 'bio', 'TEXT');
SELECT add_column_if_not_exists('user_profiles', 'telefone', 'VARCHAR(20)');
SELECT add_column_if_not_exists('user_profiles', 'whatsapp', 'VARCHAR(20)');
SELECT add_column_if_not_exists('user_profiles', 'user_slug', 'VARCHAR(255)');
SELECT add_column_if_not_exists('user_profiles', 'country_code', 'VARCHAR(2) DEFAULT ''BR''');

-- Criar índice único para user_slug (para garantir slugs únicos)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_user_slug_unique 
ON user_profiles(user_slug) 
WHERE user_slug IS NOT NULL;

-- Criar índice para busca por user_slug
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_slug 
ON user_profiles(user_slug);

-- Remover função auxiliar após uso (opcional)
-- DROP FUNCTION IF EXISTS add_column_if_not_exists;

