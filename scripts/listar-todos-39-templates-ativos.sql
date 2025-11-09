-- ============================================
-- LISTAR TODOS OS 39 TEMPLATES ATIVOS WELLNESS
-- Para identificar quais são os templates extras
-- ============================================

-- LISTAR TODOS OS TEMPLATES ATIVOS POR TIPO
-- Calculadoras (4 esperadas)
SELECT 
  '🧮 CALCULADORAS' as categoria,
  ROW_NUMBER() OVER (ORDER BY name) as num,
  name as nome,
  slug,
  created_at as criado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'calculadora'
ORDER BY name;

-- Planilhas (2 esperadas: Cardápio Detox, Tabela Comparativa)
-- Mas temos 5 ativos + 1 inativo = 6 total
SELECT 
  '📊 PLANILHAS' as categoria,
  ROW_NUMBER() OVER (ORDER BY name) as num,
  name as nome,
  slug,
  is_active,
  created_at as criado_em,
  CASE 
    WHEN is_active THEN '✅ ATIVO'
    ELSE '❌ INATIVO'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
ORDER BY is_active DESC, name;

-- Quizzes (24 esperados: 22 quizzes + 2 desafios)
-- Mas temos 30 ativos
SELECT 
  '🎯 QUIZZES' as categoria,
  ROW_NUMBER() OVER (ORDER BY name) as num,
  name as nome,
  slug,
  created_at as criado_em,
  CASE 
    WHEN slug LIKE '%desafio%' OR name LIKE '%Desafio%' THEN '🚀 DESAFIO'
    ELSE '📝 QUIZ'
  END as tipo_quiz
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
ORDER BY 
  CASE 
    WHEN slug LIKE '%desafio%' OR name LIKE '%Desafio%' THEN 1
    ELSE 2
  END,
  name;

-- RESUMO FINAL
SELECT 
  '📊 RESUMO FINAL' as info,
  COUNT(*) as total_ativos,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;


