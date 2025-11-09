-- ============================================
-- DESATIVAR QUIZ EXTRA - WELLNESS
-- IMPORTANTE: Execute primeiro o script identificar-e-remover-quiz-extra-wellness.sql
-- para identificar qual quiz é o extra, depois substitua 'NOME_DO_QUIZ_EXTRA' abaixo
-- ============================================

-- 1. VERIFICAR ANTES
SELECT 
  'ANTES' as etapa,
  name as nome,
  id,
  slug,
  is_active,
  created_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND name NOT LIKE '%Desafio%'
  -- SUBSTITUIR 'NOME_DO_QUIZ_EXTRA' pelo nome identificado no script anterior
  AND name = 'NOME_DO_QUIZ_EXTRA';

-- 2. DESATIVAR QUIZ EXTRA
-- SUBSTITUIR 'NOME_DO_QUIZ_EXTRA' pelo nome identificado no script anterior
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND name NOT LIKE '%Desafio%'
  -- SUBSTITUIR 'NOME_DO_QUIZ_EXTRA' pelo nome identificado no script anterior
  AND name = 'NOME_DO_QUIZ_EXTRA';

-- 3. VERIFICAR DEPOIS
SELECT 
  'DEPOIS' as etapa,
  name as nome,
  id,
  slug,
  is_active,
  updated_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND name NOT LIKE '%Desafio%'
  -- SUBSTITUIR 'NOME_DO_QUIZ_EXTRA' pelo nome identificado no script anterior
  AND name = 'NOME_DO_QUIZ_EXTRA';

-- 4. CONTAGEM FINAL
SELECT 
  '📊 RESUMO FINAL' as info,
  COUNT(*) as total_ativos,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN type = 'guia' THEN 1 END) as guias,
  COUNT(CASE WHEN type = 'quiz' AND name LIKE '%Desafio%' THEN 1 END) as desafios,
  COUNT(CASE WHEN type = 'quiz' AND name NOT LIKE '%Desafio%' THEN 1 END) as quizzes_normais,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as total_quizzes
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;


