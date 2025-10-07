-- Script para corrigir problemas de validação de slugs
-- Execute este script no Supabase SQL Editor se necessário

-- 1. Garantir que a coluna custom_slug existe e tem índice único
DO $$ 
BEGIN
    -- Adicionar coluna se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professional_links' 
        AND column_name = 'custom_slug'
    ) THEN
        ALTER TABLE professional_links 
        ADD COLUMN custom_slug TEXT;
    END IF;
    
    -- Criar índice único se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'professional_links' 
        AND indexname = 'idx_professional_links_custom_slug'
    ) THEN
        CREATE UNIQUE INDEX idx_professional_links_custom_slug 
        ON professional_links (custom_slug);
    END IF;
END $$;

-- 2. Verificar e ajustar políticas RLS se necessário
-- Primeiro, vamos ver se há políticas que podem estar causando problema
DO $$
BEGIN
    -- Se RLS estiver causando problemas, podemos temporariamente desabilitar
    -- ALTER TABLE professional_links DISABLE ROW LEVEL SECURITY;
    
    -- Ou criar política mais permissiva para leitura
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'professional_links' 
        AND policyname = 'allow_read_for_validation'
    ) THEN
        CREATE POLICY allow_read_for_validation ON professional_links
        FOR SELECT USING (true);
    END IF;
END $$;

-- 3. Verificar se há dados duplicados que podem estar causando conflito
SELECT custom_slug, COUNT(*) as count
FROM professional_links 
WHERE custom_slug IS NOT NULL
GROUP BY custom_slug 
HAVING COUNT(*) > 1;

-- 4. Limpar dados duplicados se existirem (CUIDADO: isso remove registros!)
-- DESCOMENTE APENAS SE NECESSÁRIO:
/*
DELETE FROM professional_links 
WHERE id IN (
    SELECT id FROM (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY custom_slug ORDER BY created_at DESC) as rn
        FROM professional_links 
        WHERE custom_slug IS NOT NULL
    ) t 
    WHERE rn > 1
);
*/

-- 5. Testar consulta final
SELECT 'Teste de consulta bem-sucedida' as status;
