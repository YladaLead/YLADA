-- ============================================
-- LISTAR TODOS OS 39 TEMPLATES ATIVOS - NOMES APENAS
-- Para identificar rapidamente os extras
-- ============================================

-- LISTAR TODOS OS TEMPLATES ATIVOS COM TIPO
SELECT 
  type as tipo,
  name as nome,
  slug,
  CASE 
    WHEN type = 'calculadora' THEN '🧮'
    WHEN type = 'planilha' THEN '📊'
    WHEN type = 'quiz' THEN '🎯'
  END as icon
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
ORDER BY type, name;


