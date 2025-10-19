-- ========================================
-- DIAGNÓSTICO SIMPLES DO SUPABASE
-- ========================================
-- Execute este script para ver apenas o que existe

-- ========================================
-- 1. VERIFICAR TODAS AS TABELAS EXISTENTES
-- ========================================

SELECT 
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ========================================
-- 2. VERIFICAR ESTRUTURA DAS TABELAS QUE EXISTEM
-- ========================================

-- Estrutura da tabela users (se existir)
SELECT 
    'users' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Estrutura da tabela user_profiles (se existir)
SELECT 
    'user_profiles' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Estrutura da tabela leads (se existir)
SELECT 
    'leads' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'leads' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- 3. CONTAR REGISTROS APENAS DAS TABELAS QUE EXISTEM
-- ========================================

-- Verificar se users existe e contar registros
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        RAISE NOTICE 'Tabela users existe';
    ELSE
        RAISE NOTICE 'Tabela users NÃO existe';
    END IF;
END $$;

-- Verificar se user_profiles existe e contar registros
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
        RAISE NOTICE 'Tabela user_profiles existe';
    ELSE
        RAISE NOTICE 'Tabela user_profiles NÃO existe';
    END IF;
END $$;

-- Verificar se leads existe e contar registros
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads' AND table_schema = 'public') THEN
        RAISE NOTICE 'Tabela leads existe';
    ELSE
        RAISE NOTICE 'Tabela leads NÃO existe';
    END IF;
END $$;

-- ========================================
-- 4. VERIFICAR DADOS EXISTENTES (apenas das tabelas que existem)
-- ========================================

-- Dados da tabela users (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        RAISE NOTICE 'DADOS DA TABELA USERS:';
        PERFORM * FROM users LIMIT 3;
    END IF;
END $$;

-- Dados da tabela user_profiles (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
        RAISE NOTICE 'DADOS DA TABELA USER_PROFILES:';
        PERFORM * FROM user_profiles LIMIT 3;
    END IF;
END $$;

-- Dados da tabela leads (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads' AND table_schema = 'public') THEN
        RAISE NOTICE 'DADOS DA TABELA LEADS:';
        PERFORM * FROM leads LIMIT 3;
    END IF;
END $$;

-- ========================================
-- 5. RESUMO FINAL
-- ========================================

SELECT 
    'RESUMO' as categoria,
    'Total de tabelas:' as item,
    COUNT(*)::text as valor
FROM pg_tables 
WHERE schemaname = 'public';
