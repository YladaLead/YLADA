-- ============================================
-- VERIFICAR PLANILHAS WELLNESS
-- Identificar qual é a planilha extra (3 ativas, esperado 2)
-- ============================================

-- TODAS AS PLANILHAS (ATIVAS E INATIVAS)
SELECT 
  CASE WHEN is_active THEN '✅ ATIVA' ELSE '❌ INATIVA' END as status,
  name as nome,
  slug,
  created_at,
  CASE 
    WHEN name LIKE '%Checklist Alimentar%' THEN '✅ Esperado (Checklist)'
    WHEN name LIKE '%Checklist Detox%' THEN '✅ Esperado (Checklist)'
    WHEN name LIKE '%Cardápio Detox%' THEN '⚠️ Verificar - pode ser esperado mas está inativo'
    WHEN name LIKE '%Tabela%' THEN '⚠️ Verificar - pode ser esperado'
    WHEN name LIKE '%Guia de Hidratação%' THEN '⚠️ Verificar - pode ser guia, não planilha'
    WHEN name LIKE '%Desafio%' THEN '❌ Deveria ser quiz'
    ELSE '❓ Verificar'
  END as observacao
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
ORDER BY is_active DESC, name;

-- RESUMO
SELECT 
  '📊 RESUMO' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativas,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativas
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha';

