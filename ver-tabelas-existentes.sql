-- ========================================
-- VER TODAS AS 19 TABELAS EXISTENTES
-- ========================================

-- Listar todas as tabelas com detalhes
SELECT 
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ========================================
-- VERIFICAR ESTRUTURA DAS TABELAS PRINCIPAIS
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

-- ========================================
-- CONTAR REGISTROS EM CADA TABELA
-- ========================================

-- Contar registros em todas as tabelas principais
SELECT 
    'users' as tabela,
    COUNT(*) as total_registros
FROM users
UNION ALL
SELECT 
    'user_profiles' as tabela,
    COUNT(*) as total_registros
FROM user_profiles
UNION ALL
SELECT 
    'leads' as tabela,
    COUNT(*) as total_registros
FROM leads
UNION ALL
SELECT 
    'generated_tools' as tabela,
    COUNT(*) as total_registros
FROM generated_tools
UNION ALL
SELECT 
    'templates_base' as tabela,
    COUNT(*) as total_registros
FROM templates_base
UNION ALL
SELECT 
    'ai_conversations' as tabela,
    COUNT(*) as total_registros
FROM ai_conversations
UNION ALL
SELECT 
    'ai_response_cache' as tabela,
    COUNT(*) as total_registros
FROM ai_response_cache
UNION ALL
SELECT 
    'user_metrics' as tabela,
    COUNT(*) as total_registros
FROM user_metrics;
