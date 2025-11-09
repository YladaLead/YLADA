-- ============================================
-- VERIFICAR TEMPLATES: Quiz Detox e Quiz Perfil Nutricional
-- ============================================

-- Verificar Quiz Detox
SELECT 
  name, 
  slug, 
  type, 
  content->>'template_type' as template_type,
  jsonb_array_length(content->'questions') as total_perguntas,
  CASE 
    WHEN content::text LIKE '%"questions"%' AND content::text LIKE '%"question":%' THEN '✅ Content completo com perguntas'
    WHEN content::text LIKE '%"questions"%' THEN '⚠️ Content tem questions mas sem array'
    WHEN content IS NULL OR content::text = '{}' THEN '❌ Sem content'
    ELSE '⚠️ Content desconhecido'
  END as status_content
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (
    slug = 'quiz-detox' OR
    LOWER(name) LIKE '%quiz detox%' OR
    (LOWER(name) LIKE '%detox%' AND LOWER(name) NOT LIKE '%checklist%' AND LOWER(name) NOT LIKE '%cardápio%' AND LOWER(name) NOT LIKE '%cardapio%')
  );

-- Verificar Quiz Perfil Nutricional
SELECT 
  name, 
  slug, 
  type, 
  content->>'template_type' as template_type,
  jsonb_array_length(content->'questions') as total_perguntas,
  CASE 
    WHEN content::text LIKE '%"questions"%' AND content::text LIKE '%"question":%' THEN '✅ Content completo com perguntas'
    WHEN content::text LIKE '%"questions"%' THEN '⚠️ Content tem questions mas sem array'
    WHEN content IS NULL OR content::text = '{}' THEN '❌ Sem content'
    ELSE '⚠️ Content desconhecido'
  END as status_content
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    slug = 'quiz-perfil-nutricional' OR
    LOWER(name) LIKE '%quiz perfil nutricional%' OR
    LOWER(name) LIKE '%perfil nutricional%'
  );

-- Verificar se as planilhas foram corrigidas
SELECT 
  name, 
  slug, 
  type, 
  content->>'template_type' as template_type,
  CASE 
    WHEN type = 'planilha' AND content->>'template_type' = 'checklist' THEN '✅ Content correto (Checklist)'
    WHEN type = 'planilha' AND content->>'template_type' = 'spreadsheet' THEN '✅ Content correto (Planilha)'
    WHEN type = 'planilha' AND content->>'template_type' = 'quiz' THEN '❌ Content incorreto (deveria ser checklist/spreadsheet)'
    ELSE '⚠️ Verificar manualmente'
  END as status_content
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (
    LOWER(name) LIKE '%checklist detox%' OR
    LOWER(name) LIKE '%cardápio detox%' OR
    LOWER(name) LIKE '%cardapio detox%'
  );

