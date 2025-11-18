-- =====================================================
-- APENAS VERIFICAR STATUS - ROTAS PÚBLICAS NUTRI
-- =====================================================
-- Este script APENAS VERIFICA se tudo está OK
-- Não adiciona nada, apenas mostra o status
-- =====================================================

-- =====================================================
-- 1. VERIFICAR COLUNAS PROFESSION
-- =====================================================
SELECT 
    'RESUMO - COLUNAS PROFESSION:' as info,
    'user_templates' as tabela,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'user_templates' 
            AND column_name = 'profession'
        ) THEN '✅ Existe'
        ELSE '❌ Não existe'
    END as status
UNION ALL
SELECT 
    '',
    'quizzes',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'quizzes' 
            AND column_name = 'profession'
        ) THEN '✅ Existe'
        ELSE '❌ Não existe'
    END
UNION ALL
SELECT 
    '',
    'wellness_portals',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'wellness_portals' 
            AND column_name = 'profession'
        ) THEN '✅ Existe'
        ELSE '❌ Não existe'
    END;

-- =====================================================
-- 2. VERIFICAR ÍNDICES
-- =====================================================
SELECT 
    'ÍNDICES CRIADOS:' as info,
    indexname,
    tablename
FROM pg_indexes
WHERE schemaname = 'public'
AND (
    indexname LIKE '%quizzes_profession%' 
    OR indexname LIKE '%wellness_portals_profession%'
    OR indexname LIKE '%user_templates_profession%'
)
ORDER BY tablename, indexname;

-- =====================================================
-- 3. CONTAGEM POR PROFESSION
-- =====================================================

-- user_templates por profession
SELECT 
    'user_templates' as tabela,
    COALESCE(profession::text, 'NULL') as profession,
    COUNT(*) as total
FROM user_templates
GROUP BY profession
ORDER BY profession;

-- quizzes por profession
SELECT 
    'quizzes' as tabela,
    COALESCE(profession::text, 'NULL') as profession,
    COUNT(*) as total
FROM quizzes
GROUP BY profession
ORDER BY profession;

-- wellness_portals por profession
SELECT 
    'wellness_portals' as tabela,
    COALESCE(profession::text, 'NULL') as profession,
    COUNT(*) as total
FROM wellness_portals
GROUP BY profession
ORDER BY profession;

-- =====================================================
-- ✅ VERIFICAÇÃO CONCLUÍDA
-- =====================================================
-- Se todas as colunas mostram "✅ Existe", 
-- então está tudo configurado corretamente!
-- =====================================================



