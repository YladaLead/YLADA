-- ============================================
-- IDENTIFICAR QUIZ EXTRA - WELLNESS
-- Temos 25 quizzes ativos, esperado 24 (22 quizzes + 2 desafios)
-- ============================================

-- LISTAR TODOS OS QUIZZES ATIVOS COM NUMERAÇÃO
SELECT 
  ROW_NUMBER() OVER (ORDER BY 
    CASE 
      WHEN name LIKE '%Desafio%' THEN 1
      ELSE 2
    END,
    name
  ) as num,
  name as nome,
  slug,
  created_at,
  CASE 
    WHEN name LIKE '%Desafio%' THEN '🚀 DESAFIO'
    ELSE '📝 QUIZ'
  END as tipo
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
ORDER BY 
  CASE 
    WHEN name LIKE '%Desafio%' THEN 1
    ELSE 2
  END,
  name;

-- LISTA ESPERADA DE 24 QUIZZES (22 quizzes + 2 desafios)
-- Comparar manualmente com a lista acima para identificar o extra


