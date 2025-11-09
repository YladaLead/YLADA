-- ============================================
-- VERIFICAR CONTENT DO QUIZ BEM-ESTAR WELLNESS
-- ============================================

-- Verificar se Quiz Bem-Estar tem content completo
SELECT 
  name,
  slug,
  type,
  CASE 
    WHEN content IS NULL OR content::text = '{}' THEN '❌ Sem content'
    WHEN content::text LIKE '%"questions"%' AND content::text LIKE '%"question":%' THEN '✅ Content completo com perguntas'
    WHEN content::text LIKE '%"questions"%' THEN '⚠️ Content tem questions mas sem array'
    WHEN content::text LIKE '%"template_type"%' THEN '✅ Content criado'
    ELSE '⚠️ Content desconhecido'
  END as status_content,
  CASE 
    WHEN content::text LIKE '%"questions"%' AND content::text LIKE '%"question":%' THEN jsonb_array_length(content->'questions')
    ELSE NULL
  END as total_perguntas,
  CASE 
    WHEN content IS NULL OR content::text = '{}' THEN NULL
    ELSE jsonb_pretty(content)
  END as content_preview
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    slug = 'quiz-bem-estar' OR
    LOWER(name) LIKE '%quiz bem-estar%' OR
    LOWER(name) LIKE '%bem-estar%' OR
    LOWER(name) LIKE '%bem estar%'
  );

