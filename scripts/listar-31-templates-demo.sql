-- =====================================================
-- LISTAR OS 31 TEMPLATES DA ÁREA DE DEMONSTRAÇÃO
-- =====================================================
-- Este script lista TODOS os 31 templates ativos
-- que aparecem na área de demonstração

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
    WHEN 'guia' THEN 2
    WHEN 'planilha' THEN 3
    WHEN 'quiz' THEN 4
    ELSE 5
  END,
  name;

-- Resultado esperado: 31 templates
-- 4 calculadoras
-- 1 guia
-- 2 planilhas
-- 24 quizzes

