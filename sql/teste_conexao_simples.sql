-- Script simples para testar conexão com Supabase
-- Execute este script no Supabase SQL Editor quando conseguir acessar

-- 1. Teste básico de conectividade
SELECT 1 as teste_conexao;

-- 2. Listar todas as tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. Verificar se professional_links existe
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'professional_links'
) as tabela_existe;
