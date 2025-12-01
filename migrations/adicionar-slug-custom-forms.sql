-- Migration: Adicionar campo slug na tabela custom_forms
-- Data: 2025-01-XX
-- Descrição: Adiciona campo slug para permitir URLs amigáveis para formulários
--             seguindo o mesmo padrão das ferramentas: /pt/nutri/{user-slug}/formulario/{slug}

-- Adicionar coluna slug
ALTER TABLE custom_forms
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Criar índice único para slug por usuário (um usuário não pode ter dois formulários com o mesmo slug)
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_forms_user_slug_unique 
ON custom_forms(user_id, slug) 
WHERE slug IS NOT NULL;

-- Criar índice para busca rápida por slug
CREATE INDEX IF NOT EXISTS idx_custom_forms_slug 
ON custom_forms(slug) 
WHERE slug IS NOT NULL;

-- Comentários
COMMENT ON COLUMN custom_forms.slug IS 'Slug único do formulário para URLs amigáveis. Formato: /pt/nutri/{user-slug}/formulario/{slug}';

