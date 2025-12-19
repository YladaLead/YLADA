-- =====================================================
-- GERAR SLUGS PARA FORMULÁRIOS EXISTENTES
-- =====================================================
-- Esta migração gera slugs para todos os formulários que não têm slug
-- Segue a mesma lógica usada na API: normaliza o nome e garante unicidade por usuário
-- =====================================================

DO $$
DECLARE
  form_record RECORD;
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER;
  slug_exists BOOLEAN;
BEGIN
  -- Processar cada formulário sem slug
  FOR form_record IN 
    SELECT id, user_id, name
    FROM custom_forms
    WHERE slug IS NULL OR slug = ''
    ORDER BY created_at
  LOOP
    -- Normalizar nome para slug (mesma lógica da API)
    base_slug := lower(form_record.name);
    
    -- Remover acentos (substituições comuns)
    base_slug := replace(base_slug, 'á', 'a');
    base_slug := replace(base_slug, 'à', 'a');
    base_slug := replace(base_slug, 'ã', 'a');
    base_slug := replace(base_slug, 'â', 'a');
    base_slug := replace(base_slug, 'é', 'e');
    base_slug := replace(base_slug, 'ê', 'e');
    base_slug := replace(base_slug, 'í', 'i');
    base_slug := replace(base_slug, 'ó', 'o');
    base_slug := replace(base_slug, 'ô', 'o');
    base_slug := replace(base_slug, 'õ', 'o');
    base_slug := replace(base_slug, 'ú', 'u');
    base_slug := replace(base_slug, 'ç', 'c');
    
    -- Remover caracteres especiais e substituir por hífen
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
    base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');
    
    -- Se slug vazio, usar 'formulario'
    IF base_slug = '' OR base_slug IS NULL THEN
      base_slug := 'formulario';
    END IF;
    
    -- Limitar tamanho (255 caracteres é o máximo da coluna)
    base_slug := substring(base_slug from 1 for 200);
    
    -- Tentar usar o slug base
    final_slug := base_slug;
    counter := 0;
    slug_exists := TRUE;
    
    -- Verificar se slug já existe para este usuário e ajustar se necessário
    WHILE slug_exists LOOP
      SELECT EXISTS(
        SELECT 1 
        FROM custom_forms 
        WHERE user_id = form_record.user_id 
        AND slug = final_slug
        AND id != form_record.id
      ) INTO slug_exists;
      
      IF slug_exists THEN
        counter := counter + 1;
        -- Adicionar número ao final se já existe
        final_slug := base_slug || '-' || counter;
        -- Garantir que não ultrapasse o limite
        IF length(final_slug) > 200 THEN
          final_slug := substring(base_slug from 1 for (200 - length(counter::TEXT) - 1)) || '-' || counter;
        END IF;
      END IF;
    END LOOP;
    
    -- Atualizar formulário com o slug gerado
    UPDATE custom_forms
    SET slug = final_slug
    WHERE id = form_record.id;
    
    RAISE NOTICE '✅ Slug gerado para formulário % (ID: %): %', form_record.name, form_record.id, final_slug;
  END LOOP;
  
  RAISE NOTICE '✅ Migração concluída: Slugs gerados para todos os formulários sem slug';
END $$;

-- Verificar resultado
SELECT 
  COUNT(*) FILTER (WHERE slug IS NULL OR slug = '') as sem_slug,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as com_slug,
  COUNT(*) as total
FROM custom_forms;

-- Listar alguns exemplos de formulários atualizados
SELECT 
  id,
  name,
  slug,
  user_id,
  created_at
FROM custom_forms
WHERE slug IS NOT NULL AND slug != ''
ORDER BY updated_at DESC NULLS LAST, created_at DESC
LIMIT 10;
