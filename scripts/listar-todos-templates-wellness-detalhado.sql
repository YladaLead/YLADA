-- ============================================
-- LISTAR TODOS OS TEMPLATES WELLNESS DETALHADO
-- Para identificar quais são os 39 templates ativos
-- ============================================

-- LISTAR TODOS OS TEMPLATES ATIVOS (39)
SELECT 
  ROW_NUMBER() OVER (ORDER BY type, name) as num,
  name as nome,
  slug,
  type as tipo,
  CASE 
    WHEN type = 'calculadora' THEN '🧮'
    WHEN type = 'quiz' THEN '🎯'
    WHEN type = 'planilha' THEN '📊'
    ELSE '📄'
  END as icon,
  is_active as ativo,
  created_at as criado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
ORDER BY type, name;

-- RESUMO POR TIPO (ATIVOS)
SELECT 
  type as tipo,
  COUNT(*) as total_ativos,
  STRING_AGG(name, ', ' ORDER BY name) as nomes
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
GROUP BY type
ORDER BY type;


