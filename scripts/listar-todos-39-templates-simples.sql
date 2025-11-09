-- ============================================
-- LISTAR TODOS OS 39 TEMPLATES ATIVOS - VERSÃO SIMPLES
-- Uma única query que lista tudo
-- ============================================

SELECT 
  type as tipo,
  name as nome,
  slug,
  created_at as criado_em,
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


