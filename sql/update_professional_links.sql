-- Script para atualizar a tabela professional_links com novos campos
-- Execute este script no Supabase SQL Editor

-- Adicionar novos campos à tabela professional_links
ALTER TABLE public.professional_links 
ADD COLUMN IF NOT EXISTS custom_message TEXT,
ADD COLUMN IF NOT EXISTS redirect_type TEXT DEFAULT 'whatsapp',
ADD COLUMN IF NOT EXISTS secure_id TEXT UNIQUE;

-- Criar índice para secure_id para melhor performance
CREATE INDEX IF NOT EXISTS idx_professional_links_secure_id ON public.professional_links(secure_id);

-- Atualizar registros existentes com secure_id se estiver vazio
UPDATE public.professional_links 
SET secure_id = CONCAT(
  SUBSTRING(professional_id::text, 1, 8), 
  '-', 
  EXTRACT(EPOCH FROM created_at)::bigint,
  '-',
  SUBSTRING(MD5(RANDOM()::text), 1, 10)
)
WHERE secure_id IS NULL OR secure_id = '';

-- Atualizar redirect_type para registros existentes se estiver vazio
UPDATE public.professional_links 
SET redirect_type = 'whatsapp'
WHERE redirect_type IS NULL OR redirect_type = '';

-- Comentários para documentação
COMMENT ON COLUMN public.professional_links.custom_message IS 'Mensagem personalizada que aparece antes do botão de ação';
COMMENT ON COLUMN public.professional_links.redirect_type IS 'Tipo de redirecionamento: whatsapp, website, instagram, telegram, email';
COMMENT ON COLUMN public.professional_links.secure_id IS 'ID único para proteção e controle de acesso do link';



