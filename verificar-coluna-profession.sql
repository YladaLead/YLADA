-- =====================================================
-- VERIFICAR SE TABELAS TÊM COLUNA profession
-- =====================================================

-- 1. Verificar se quizzes tem coluna profession
SELECT 
    'QUIZZES - Colunas da tabela:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quizzes'
AND column_name = 'profession';

-- Se não retornar nada, a coluna não existe
-- Se retornar, mostra o tipo de dado

-- 2. Verificar se wellness_portals tem coluna profession
SELECT 
    'WELLNESS_PORTALS - Colunas da tabela:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'wellness_portals'
AND column_name = 'profession';

-- Se não retornar nada, a coluna não existe
-- Se retornar, mostra o tipo de dado

-- 3. Listar TODAS as colunas de quizzes para referência
SELECT 
    'QUIZZES - Todas as colunas:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quizzes'
ORDER BY ordinal_position;

-- 4. Listar TODAS as colunas de wellness_portals para referência
SELECT 
    'WELLNESS_PORTALS - Todas as colunas:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'wellness_portals'
ORDER BY ordinal_position;

