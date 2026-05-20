-- ============================================
-- LISTAR TODOS OS TEMPLATES WELLNESS NO BANCO
-- ============================================

-- Listar todos os templates Wellness ativos ordenados por tipo e nome
SELECT 
  id,
  name,
  type,
  specialization,
  objective,
  is_active,
  language,
  profession,
  created_at,
  updated_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY 
  type ASC,
  name ASC;

-- Resumo por tipo
SELECT 
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY type
ORDER BY type;

-- Total geral
SELECT 
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as templates_ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as templates_inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

