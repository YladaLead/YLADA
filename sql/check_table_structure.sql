-- Script para verificar a estrutura atual da tabela professional_links
-- Execute este script no Supabase SQL Editor para diagnosticar

-- Verificar se a tabela existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'professional_links' 
            AND table_schema = 'public'
        ) 
        THEN 'Tabela professional_links EXISTE' 
        ELSE 'Tabela professional_links NÃO EXISTE' 
    END as status_tabela;

-- Se a tabela existir, mostrar sua estrutura
SELECT 
    column_name as "Nome da Coluna",
    data_type as "Tipo de Dados",
    is_nullable as "Permite NULL",
    column_default as "Valor Padrão"
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar se as colunas específicas existem
SELECT 
    'custom_message' as coluna,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'professional_links' 
            AND column_name = 'custom_message'
            AND table_schema = 'public'
        ) 
        THEN 'EXISTE' 
        ELSE 'NÃO EXISTE' 
    END as status
UNION ALL
SELECT 
    'redirect_type' as coluna,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'professional_links' 
            AND column_name = 'redirect_type'
            AND table_schema = 'public'
        ) 
        THEN 'EXISTE' 
        ELSE 'NÃO EXISTE' 
    END as status
UNION ALL
SELECT 
    'secure_id' as coluna,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'professional_links' 
            AND column_name = 'secure_id'
            AND table_schema = 'public'
        ) 
        THEN 'EXISTE' 
        ELSE 'NÃO EXISTE' 
    END as status;




