-- Script para verificar estrutura da tabela professional_links
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
ORDER BY ordinal_position;

-- 2. Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'professional_links'
);

-- 3. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'professional_links';

-- 4. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'professional_links';
