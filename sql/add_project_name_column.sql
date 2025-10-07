-- Script para adicionar coluna project_name na tabela professional_links
-- Execute este script no Supabase SQL Editor

-- Adicionar coluna project_name se não existir
ALTER TABLE public.professional_links 
ADD COLUMN IF NOT EXISTS project_name TEXT;

-- Adicionar comentário para documentação
COMMENT ON COLUMN public.professional_links.project_name IS 'Nome do projeto/estratégia para identificar o link';

-- Atualizar registros existentes com valor padrão se estiver vazio
UPDATE public.professional_links 
SET project_name = COALESCE(project_name, '')
WHERE project_name IS NULL;

-- Criar índice para melhor performance (opcional)
CREATE INDEX IF NOT EXISTS idx_professional_links_project_name ON public.professional_links(project_name);
