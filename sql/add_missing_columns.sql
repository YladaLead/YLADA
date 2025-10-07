-- Script para adicionar colunas que estão faltando na tabela professional_links
-- Execute este script no Supabase SQL Editor

-- Verificar se a tabela existe
DO $$
BEGIN
    -- Adicionar coluna custom_message se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professional_links' 
        AND column_name = 'custom_message'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.professional_links ADD COLUMN custom_message TEXT;
        RAISE NOTICE 'Coluna custom_message adicionada';
    ELSE
        RAISE NOTICE 'Coluna custom_message já existe';
    END IF;

    -- Adicionar coluna redirect_type se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professional_links' 
        AND column_name = 'redirect_type'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.professional_links ADD COLUMN redirect_type TEXT DEFAULT 'whatsapp';
        RAISE NOTICE 'Coluna redirect_type adicionada';
    ELSE
        RAISE NOTICE 'Coluna redirect_type já existe';
    END IF;

    -- Adicionar coluna secure_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professional_links' 
        AND column_name = 'secure_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.professional_links ADD COLUMN secure_id TEXT UNIQUE;
        RAISE NOTICE 'Coluna secure_id adicionada';
    ELSE
        RAISE NOTICE 'Coluna secure_id já existe';
    END IF;
END $$;

-- Atualizar registros existentes com valores padrão
UPDATE public.professional_links 
SET redirect_type = 'whatsapp' 
WHERE redirect_type IS NULL;

-- Gerar secure_id para registros existentes que não têm
UPDATE public.professional_links 
SET secure_id = CONCAT(
    SUBSTRING(professional_id::text, 1, 8), 
    '-', 
    EXTRACT(EPOCH FROM created_at)::bigint,
    '-',
    SUBSTRING(MD5(RANDOM()::text), 1, 10)
)
WHERE secure_id IS NULL OR secure_id = '';

-- Tornar secure_id NOT NULL após popular
ALTER TABLE public.professional_links ALTER COLUMN secure_id SET NOT NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_professional_links_secure_id ON public.professional_links(secure_id);

-- Verificar estrutura final da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
AND table_schema = 'public'
ORDER BY ordinal_position;



