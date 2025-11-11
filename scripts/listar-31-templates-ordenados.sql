-- =====================================================
-- LISTAR OS 31 TEMPLATES EM ORDEM
-- =====================================================
-- Este script lista os 31 templates da área demo
-- ordenados por tipo e nome para verificação

SELECT 
  ROW_NUMBER() OVER (
    ORDER BY 
      CASE type
        WHEN 'calculadora' THEN 1
        WHEN 'guia' THEN 2
        WHEN 'planilha' THEN 3
        WHEN 'quiz' THEN 4
        ELSE 5
      END,
      name
  ) as numero,
  id,
  name,
  slug,
  type,
  is_active,
  profession,
  language
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
ORDER BY 
  CASE type
    WHEN 'calculadora' THEN 1
    WHEN 'guia' THEN 2
    WHEN 'planilha' THEN 3
    WHEN 'quiz' THEN 4
    ELSE 5
  END,
  name;

