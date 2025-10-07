-- Adicionar coluna custom_slug para URLs personalizadas
-- Este script adiciona suporte a URLs mais curtas e personalizáveis

-- Adicionar coluna custom_slug
ALTER TABLE professional_links 
ADD COLUMN IF NOT EXISTS custom_slug VARCHAR(50);

-- Criar índice único para custom_slug para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_professional_links_custom_slug 
ON professional_links(custom_slug) 
WHERE custom_slug IS NOT NULL;

-- Comentário da coluna
COMMENT ON COLUMN professional_links.custom_slug IS 'Slug personalizado para URLs amigáveis (ex: meu-projeto-proteina)';

-- Exemplo de uso:
-- URL antiga: https://fitlead.ylada.com/tools/protein?ref=73839c5f-1759855603896-dtxm0isn9f4
-- URL nova: https://fitlead.ylada.com/link/meu-projeto-proteina

-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
AND column_name = 'custom_slug';
