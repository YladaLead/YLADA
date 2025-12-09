-- =====================================================
-- CORRIGIR FUNÇÃO GERAR_LINK_ATALHO_MATERIAL
-- Migração 028: Remover dependência de unaccent
-- =====================================================

BEGIN;

-- Recriar função sem dependência de unaccent
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

COMMENT ON FUNCTION gerar_link_atalho_material IS 'Gera um link de atalho único baseado no título do material, sem dependência de extensões externas';

COMMIT;
