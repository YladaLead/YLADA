-- ============================================
-- VERIFICAR SE DESAFIOS ESTÃO DUPLICADOS
-- Verifica se Desafio 7 Dias e 21 Dias aparecem como planilha E quiz
-- ============================================

-- Verificar Desafio 7 Dias
SELECT 
  'Desafio 7 Dias' as template,
  type as tipo,
  name as nome,
  slug,
  is_active as ativo,
  created_at as criado_em,
  id
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    name LIKE '%Desafio 7 Dias%' 
    OR name LIKE '%Desafio 7%'
    OR slug = 'desafio-7-dias'
    OR slug LIKE '%desafio-7%'
  )
ORDER BY type, created_at;

-- Verificar Desafio 21 Dias
SELECT 
  'Desafio 21 Dias' as template,
  type as tipo,
  name as nome,
  slug,
  is_active as ativo,
  created_at as criado_em,
  id
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    name LIKE '%Desafio 21 Dias%' 
    OR name LIKE '%Desafio 21%'
    OR slug = 'desafio-21-dias'
    OR slug LIKE '%desafio-21%'
  )
ORDER BY type, created_at;

-- RESUMO: Contar quantos Desafios temos
SELECT 
  'RESUMO DESAFIOS' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as como_quiz,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as como_planilha,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    name LIKE '%Desafio%'
    OR slug LIKE '%desafio%'
  );


