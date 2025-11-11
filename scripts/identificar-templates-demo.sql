-- =====================================================
-- IDENTIFICAR OS 31 TEMPLATES DA ÁREA DE DEMONSTRAÇÃO
-- =====================================================
-- Este script lista os templates ativos no banco de dados
-- que devem corresponder aos 31 templates da área de demo

-- Listar todos os templates Wellness ativos
SELECT 
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
    WHEN 'quiz' THEN 2
    WHEN 'planilha' THEN 3
    ELSE 4
  END,
  name;

-- Contar total
SELECT 
  COUNT(*) as total_templates,
  type,
  COUNT(*) as quantidade
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
GROUP BY type
ORDER BY 
  CASE type
    WHEN 'calculadora' THEN 1
    WHEN 'quiz' THEN 2
    WHEN 'planilha' THEN 3
    ELSE 4
  END;

