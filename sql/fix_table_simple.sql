-- Script SIMPLES para corrigir a tabela professional_links
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar colunas que estão faltando
ALTER TABLE public.professional_links 
ADD COLUMN IF NOT EXISTS custom_message TEXT,
ADD COLUMN IF NOT EXISTS redirect_type TEXT DEFAULT 'whatsapp',
ADD COLUMN IF NOT EXISTS secure_id TEXT;

-- 2. Atualizar registros existentes
UPDATE public.professional_links 
SET redirect_type = 'whatsapp' 
WHERE redirect_type IS NULL;

-- 3. Gerar secure_id para registros existentes
UPDATE public.professional_links 
SET secure_id = CONCAT(
    SUBSTRING(professional_id::text, 1, 8), 
    '-', 
    EXTRACT(EPOCH FROM created_at)::bigint,
    '-',
    SUBSTRING(MD5(RANDOM()::text), 1, 10)
)
WHERE secure_id IS NULL OR secure_id = '';

-- 4. Tornar secure_id obrigatório
ALTER TABLE public.professional_links ALTER COLUMN secure_id SET NOT NULL;

-- 5. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_professional_links_secure_id ON public.professional_links(secure_id);

-- 6. Verificar resultado
SELECT 'Tabela atualizada com sucesso!' as status;


