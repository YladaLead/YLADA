-- ========================================
-- VER ESTRUTURA DAS TABELAS PRINCIPAIS
-- ========================================

-- Estrutura da tabela users
SELECT 
    'users' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Estrutura da tabela user_profiles
SELECT 
    'user_profiles' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Estrutura da tabela leads
SELECT 
    'leads' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'leads' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Estrutura da tabela templates_base (que tem 3 registros)
SELECT 
    'templates_base' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'templates_base' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- VER OS 3 REGISTROS DA TABELA TEMPLATES_BASE
-- ========================================

SELECT 
    'DADOS TEMPLATES_BASE:' as info,
    *
FROM templates_base
LIMIT 3;
