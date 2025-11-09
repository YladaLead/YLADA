-- ============================================
-- VERIFICAR ESTADO ATUAL APÓS CORREÇÕES
-- ============================================

-- 1. PLANILHAS ATIVAS (esperado 2, temos 3)
SELECT 
  '📊 PLANILHAS ATIVAS' as categoria,
  name as nome,
  slug,
  created_at,
  CASE 
    WHEN name LIKE '%Checklist Alimentar%' THEN '✅ Esperado'
    WHEN name LIKE '%Checklist Detox%' THEN '✅ Esperado'
    WHEN name LIKE '%Guia de Hidratação%' THEN '⚠️ Verificar tipo'
    WHEN name LIKE '%Desafio%' THEN '❌ Deveria ser quiz'
    WHEN name LIKE '%Cardápio%' OR name LIKE '%Tabela%' THEN '✅ Esperado'
    ELSE '❓ Verificar'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'planilha'
ORDER BY name;

-- 2. DESAFIOS (verificar se ainda estão duplicados)
SELECT 
  '🚀 DESAFIOS' as categoria,
  type as tipo,
  name as nome,
  slug,
  is_active,
  created_at,
  CASE 
    WHEN type = 'quiz' AND is_active = true THEN '✅ Correto'
    WHEN type = 'planilha' AND is_active = true THEN '❌ Deve ser desativado'
    WHEN type = 'planilha' AND is_active = false THEN '✅ Desativado corretamente'
    ELSE '⚠️ Verificar'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    name LIKE '%Desafio%'
    OR slug LIKE '%desafio%'
  )
ORDER BY type, is_active DESC, name;

-- 3. QUIZZES - LISTAR TODOS PARA IDENTIFICAR EXTRAS
SELECT 
  '🎯 QUIZZES' as categoria,
  name as nome,
  slug,
  created_at,
  CASE 
    WHEN name LIKE '%Desafio%' THEN '🚀 DESAFIO'
    WHEN name LIKE '%Bem-Estar%' OR name LIKE '%bem-estar%' OR name LIKE '%Bem Estar%' THEN '⚠️ Possível duplicata Bem-Estar'
    WHEN name LIKE '%Detox%' AND name != 'Quiz Detox' THEN '⚠️ Possível duplicata Detox'
    WHEN name LIKE '%Metabolismo%' AND name != 'Quiz Interativo' THEN '⚠️ Possível duplicata Interativo'
    WHEN name LIKE '%Sono%' OR name LIKE '%Energia%' THEN '⚠️ Possível duplicata Energético'
    ELSE '✅ OK'
  END as observacao
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
ORDER BY 
  CASE 
    WHEN name LIKE '%Desafio%' THEN 1
    WHEN name LIKE '%Bem-Estar%' OR name LIKE '%bem-estar%' OR name LIKE '%Bem Estar%' THEN 2
    WHEN name LIKE '%Detox%' THEN 3
    WHEN name LIKE '%Metabolismo%' THEN 4
    WHEN name LIKE '%Sono%' OR name LIKE '%Energia%' THEN 5
    ELSE 6
  END,
  name;


