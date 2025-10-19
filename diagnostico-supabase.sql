-- ========================================
-- DIAGNÓSTICO COMPLETO DO SUPABASE
-- ========================================
-- Execute este script para ver o que já existe no banco

-- ========================================
-- 1. VERIFICAR TODAS AS TABELAS EXISTENTES
-- ========================================

SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ========================================
-- 2. VERIFICAR ESTRUTURA DAS TABELAS PRINCIPAIS
-- ========================================

-- Estrutura da tabela users (se existir)
SELECT 
    'users' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Estrutura da tabela user_profiles (se existir)
SELECT 
    'user_profiles' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Estrutura da tabela leads (se existir)
SELECT 
    'leads' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'leads' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Estrutura da tabela tool_templates (se existir)
SELECT 
    'tool_templates' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'tool_templates' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Estrutura da tabela user_tools (se existir)
SELECT 
    'user_tools' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_tools' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- 3. VERIFICAR DADOS EXISTENTES
-- ========================================

-- Contar registros em cada tabela
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
    'tool_templates' as tabela,
    COUNT(*) as total_registros
FROM tool_templates
UNION ALL
SELECT 
    'user_tools' as tabela,
    COUNT(*) as total_registros
FROM user_tools;

-- ========================================
-- 4. VERIFICAR RELACIONAMENTOS (FOREIGN KEYS)
-- ========================================

SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ========================================
-- 5. VERIFICAR ÍNDICES EXISTENTES
-- ========================================

SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ========================================
-- 6. VERIFICAR TRIGGERS EXISTENTES
-- ========================================

SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ========================================
-- 7. VERIFICAR FUNÇÕES EXISTENTES
-- ========================================

SELECT
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ========================================
-- 8. VERIFICAR VIEWS EXISTENTES
-- ========================================

SELECT
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========================================
-- 9. VERIFICAR DADOS DE EXEMPLO (se existirem)
-- ========================================

-- Dados da tabela users
SELECT 'DADOS USERS:' as info;
SELECT * FROM users LIMIT 5;

-- Dados da tabela user_profiles
SELECT 'DADOS USER_PROFILES:' as info;
SELECT * FROM user_profiles LIMIT 5;

-- Dados da tabela leads
SELECT 'DADOS LEADS:' as info;
SELECT * FROM leads LIMIT 5;

-- Dados da tabela tool_templates
SELECT 'DADOS TOOL_TEMPLATES:' as info;
SELECT * FROM tool_templates LIMIT 5;

-- Dados da tabela user_tools
SELECT 'DADOS USER_TOOLS:' as info;
SELECT * FROM user_tools LIMIT 5;

-- ========================================
-- 10. RESUMO EXECUTIVO
-- ========================================

SELECT 
    'RESUMO EXECUTIVO' as categoria,
    'Tabelas existentes:' as item,
    COUNT(*)::text as valor
FROM pg_tables 
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'RESUMO EXECUTIVO' as categoria,
    'Índices existentes:' as item,
    COUNT(*)::text as valor
FROM pg_indexes
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'RESUMO EXECUTIVO' as categoria,
    'Triggers existentes:' as item,
    COUNT(*)::text as valor
FROM information_schema.triggers
WHERE trigger_schema = 'public'
UNION ALL
SELECT 
    'RESUMO EXECUTIVO' as categoria,
    'Funções existentes:' as item,
    COUNT(*)::text as valor
FROM information_schema.routines
WHERE routine_schema = 'public';

-- ========================================
-- COMENTÁRIOS FINAIS
-- ========================================

/*
ESTE SCRIPT VAI MOSTRAR:

✅ TODAS AS TABELAS existentes no Supabase
✅ ESTRUTURA das colunas de cada tabela
✅ DADOS existentes em cada tabela
✅ RELACIONAMENTOS entre tabelas
✅ ÍNDICES criados
✅ TRIGGERS ativos
✅ FUNÇÕES definidas
✅ VIEWS existentes

COM ESSAS INFORMAÇÕES PODEMOS:
1. Ver exatamente o que já existe
2. Decidir se devemos:
   - Dropar tabelas existentes
   - Adicionar colunas faltantes
   - Manter dados existentes
   - Criar apenas o que falta

EXECUTE ESTE SCRIPT E ME ENVIE O RESULTADO!
*/
