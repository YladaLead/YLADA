-- =====================================================
-- IDENTIFICAR TEMPLATES SEM SLUG
-- =====================================================
-- Este script lista os templates que ainda não têm slug
-- para identificar quais precisam ser atualizados

SELECT 
  id,
  name,
  slug,
  type,
  is_active,
  profession,
  language,
  created_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND (slug IS NULL OR slug = '')
ORDER BY 
  CASE type
    WHEN 'calculadora' THEN 1
    WHEN 'guia' THEN 2
    WHEN 'planilha' THEN 3
    WHEN 'quiz' THEN 4
    ELSE 5
  END,
  name;

