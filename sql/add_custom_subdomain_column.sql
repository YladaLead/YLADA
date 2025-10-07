-- Script para adicionar campo custom_subdomain na tabela professionals
-- Execute este script no Supabase SQL Editor

-- Adicionar coluna custom_subdomain
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS custom_subdomain VARCHAR(50) UNIQUE;

-- Comentário para documentação
COMMENT ON COLUMN public.professionals.custom_subdomain IS 'Subdomínio personalizado escolhido pelo usuário (ex: fitlead, minhaacademia)';

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_professionals_custom_subdomain ON public.professionals(custom_subdomain);

-- Adicionar constraint para formato válido (apenas letras, números e hífens)
ALTER TABLE public.professionals
ADD CONSTRAINT check_custom_subdomain_format 
CHECK (custom_subdomain ~ '^[a-z0-9-]+$' AND length(custom_subdomain) >= 3 AND length(custom_subdomain) <= 30);

-- Função para gerar subdomínio padrão baseado no nome
CREATE OR REPLACE FUNCTION generate_default_subdomain(name TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Converter para minúsculo, remover acentos e caracteres especiais
  RETURN lower(regexp_replace(
    regexp_replace(
      regexp_replace(name, '[áàâãä]', 'a', 'g'),
      '[éèêë]', 'e', 'g'
    ),
    '[^a-z0-9]', '', 'g'
  ));
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso:
-- SELECT generate_default_subdomain('FitLead Academia') -- retorna 'fitleadacademia'
-- SELECT generate_default_subdomain('Minha Academia') -- retorna 'minhaacademia'
