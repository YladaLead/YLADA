-- =====================================================
-- ADICIONAR LINK DE ATALHO AOS MATERIAIS WELLNESS
-- Migração 027: Adicionar campo link_atalho para links curtos
-- =====================================================

BEGIN;

-- Adicionar campo link_atalho (slug único baseado no título)
ALTER TABLE wellness_materiais
ADD COLUMN IF NOT EXISTS link_atalho TEXT UNIQUE;

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_materiais_link_atalho ON wellness_materiais(link_atalho);
CREATE INDEX IF NOT EXISTS idx_materiais_titulo_busca ON wellness_materiais USING gin(to_tsvector('portuguese', titulo || ' ' || COALESCE(descricao, '')));

-- Função para gerar link_atalho único baseado no título
CREATE OR REPLACE FUNCTION gerar_link_atalho_material(titulo_input TEXT, material_id_input UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  contador INTEGER := 0;
  slug_final TEXT;
BEGIN
  -- Normalizar título: minúsculas, substituir espaços por hífens
  -- Remover acentos manualmente (substituições comuns)
  slug := lower(titulo_input);
  -- Substituir acentos comuns
  slug := replace(slug, 'á', 'a');
  slug := replace(slug, 'à', 'a');
  slug := replace(slug, 'ã', 'a');
  slug := replace(slug, 'â', 'a');
  slug := replace(slug, 'é', 'e');
  slug := replace(slug, 'ê', 'e');
  slug := replace(slug, 'í', 'i');
  slug := replace(slug, 'ó', 'o');
  slug := replace(slug, 'ô', 'o');
  slug := replace(slug, 'õ', 'o');
  slug := replace(slug, 'ú', 'u');
  slug := replace(slug, 'ç', 'c');
  -- Remover caracteres especiais e substituir por hífen
  slug := regexp_replace(slug, '[^a-z0-9]+', '-', 'g');
  slug := regexp_replace(slug, '^-+|-+$', '', 'g');
  slug := substring(slug from 1 for 50); -- Limitar a 50 caracteres
  
  -- Se slug vazio, usar 'material'
  IF slug = '' OR slug IS NULL THEN
    slug := 'material';
  END IF;
  
  slug_final := slug;
  
  -- Verificar se já existe (exceto o próprio material se estiver editando)
  WHILE EXISTS (
    SELECT 1 FROM wellness_materiais 
    WHERE link_atalho = slug_final 
    AND (material_id_input IS NULL OR id != material_id_input)
  ) LOOP
    contador := contador + 1;
    slug_final := slug || '-' || contador;
  END LOOP;
  
  RETURN slug_final;
END;
$$ LANGUAGE plpgsql;

-- Atualizar materiais existentes que não têm link_atalho
UPDATE wellness_materiais
SET link_atalho = gerar_link_atalho_material(titulo, id)
WHERE link_atalho IS NULL;

-- Trigger para gerar link_atalho automaticamente ao inserir/atualizar
CREATE OR REPLACE FUNCTION trigger_gerar_link_atalho_material()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.link_atalho IS NULL OR NEW.link_atalho = '' THEN
    NEW.link_atalho := gerar_link_atalho_material(NEW.titulo, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gerar_link_atalho_material ON wellness_materiais;
CREATE TRIGGER trg_gerar_link_atalho_material
  BEFORE INSERT OR UPDATE OF titulo ON wellness_materiais
  FOR EACH ROW
  EXECUTE FUNCTION trigger_gerar_link_atalho_material();

COMMENT ON COLUMN wellness_materiais.link_atalho IS 'Link de atalho único para acesso rápido ao material (ex: /m/bebida-funcional)';

COMMIT;
