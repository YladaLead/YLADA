-- Script para gerar slugs para todos os formulários existentes que não têm slug
-- Este script cria slugs baseados no nome do formulário

DO $$
DECLARE
  form_record RECORD;
  candidate_slug TEXT;
  final_slug TEXT;
  attempt_num INTEGER;
  slug_exists BOOLEAN;
  forms_updated INTEGER := 0;
BEGIN
  -- Função para normalizar slug
  -- Remove acentos, converte para minúsculas, substitui espaços por hífens
  FOR form_record IN 
    SELECT id, name, user_id
    FROM custom_forms
    WHERE slug IS NULL OR slug = ''
    ORDER BY created_at
  LOOP
    -- Normalizar o nome para criar o slug (sem usar UNACCENT que pode não existir)
    candidate_slug := LOWER(form_record.name);
    -- Remover acentos manualmente (substituições comuns)
    candidate_slug := REPLACE(candidate_slug, 'á', 'a');
    candidate_slug := REPLACE(candidate_slug, 'à', 'a');
    candidate_slug := REPLACE(candidate_slug, 'ã', 'a');
    candidate_slug := REPLACE(candidate_slug, 'â', 'a');
    candidate_slug := REPLACE(candidate_slug, 'é', 'e');
    candidate_slug := REPLACE(candidate_slug, 'ê', 'e');
    candidate_slug := REPLACE(candidate_slug, 'í', 'i');
    candidate_slug := REPLACE(candidate_slug, 'ó', 'o');
    candidate_slug := REPLACE(candidate_slug, 'ô', 'o');
    candidate_slug := REPLACE(candidate_slug, 'õ', 'o');
    candidate_slug := REPLACE(candidate_slug, 'ú', 'u');
    candidate_slug := REPLACE(candidate_slug, 'ü', 'u');
    candidate_slug := REPLACE(candidate_slug, 'ç', 'c');
    candidate_slug := REGEXP_REPLACE(candidate_slug, '[^a-z0-9]+', '-', 'g');
    candidate_slug := REGEXP_REPLACE(candidate_slug, '^-+|-+$', '', 'g');
    candidate_slug := TRIM(BOTH '-' FROM candidate_slug);
    
    -- Se ficou vazio, usar um padrão
    IF candidate_slug = '' OR candidate_slug IS NULL THEN
      candidate_slug := 'formulario';
    END IF;
    
    -- Verificar se já existe para este usuário
    SELECT EXISTS(
      SELECT 1 FROM custom_forms
      WHERE user_id = form_record.user_id
      AND slug = candidate_slug
      AND id != form_record.id
    ) INTO slug_exists;
    
    final_slug := candidate_slug;
    attempt_num := 2;
    
    -- Se já existe, tentar com número
    WHILE slug_exists AND attempt_num <= 50 LOOP
      final_slug := candidate_slug || '-' || attempt_num;
      
      SELECT EXISTS(
        SELECT 1 FROM custom_forms
        WHERE user_id = form_record.user_id
        AND slug = final_slug
        AND id != form_record.id
      ) INTO slug_exists;
      
      IF NOT slug_exists THEN
        EXIT;
      END IF;
      
      attempt_num := attempt_num + 1;
    END LOOP;
    
    -- Atualizar o formulário com o slug gerado
    UPDATE custom_forms
    SET slug = final_slug
    WHERE id = form_record.id;
    
    forms_updated := forms_updated + 1;
    
    RAISE NOTICE '✅ Slug gerado para formulário % (ID: %): %', form_record.name, form_record.id, final_slug;
  END LOOP;
  
  RAISE NOTICE '🎉 Total de formulários atualizados: %', forms_updated;
END $$;

-- Verificar resultados
SELECT 
  'Resultado após geração:' as info,
  COUNT(*) as total_formularios,
  COUNT(slug) as com_slug,
  COUNT(short_code) as com_short_code,
  COUNT(*) - COUNT(slug) as sem_slug
FROM custom_forms;

-- Mostrar alguns exemplos
SELECT 
  id,
  name,
  slug,
  user_id
FROM custom_forms
ORDER BY updated_at DESC
LIMIT 10;


