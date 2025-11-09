-- ============================================
-- LISTAR APENAS PLANILHAS ATIVAS WELLNESS
-- Para identificar qual é a extra (3 ativas, esperado 2)
-- ============================================

SELECT 
  name as nome,
  slug,
  created_at,
  CASE 
    WHEN name LIKE '%Checklist Alimentar%' THEN '✅ Esperado'
    WHEN name LIKE '%Checklist Detox%' THEN '✅ Esperado'
    WHEN name LIKE '%Guia de Hidratação%' THEN '⚠️ EXTRA - pode ser guia, não planilha'
    WHEN name LIKE '%Cardápio%' THEN '⚠️ EXTRA - Cardápio Detox está inativo'
    WHEN name LIKE '%Tabela%' THEN '⚠️ EXTRA - pode ser esperado'
    WHEN name LIKE '%Desafio%' THEN '❌ EXTRA - Deveria ser quiz'
    ELSE '❓ EXTRA - Verificar'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND is_active = true
ORDER BY name;


