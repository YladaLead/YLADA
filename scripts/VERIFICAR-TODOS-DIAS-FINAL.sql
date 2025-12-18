-- =====================================================
-- VERIFICAÇÃO FINAL COMPLETA - TODOS OS DIAS
-- =====================================================
-- Verifica se há travessões ou "tração" em todos os dias 1-30

-- Verificar travessões (—)
SELECT 
  day_number,
  title,
  'objective' as campo,
  '⚠️ Tem travessão' as problema
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND objective LIKE '% — %'

UNION ALL

SELECT 
  day_number,
  title,
  'guidance' as campo,
  '⚠️ Tem travessão' as problema
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND guidance LIKE '% — %'

UNION ALL

SELECT 
  day_number,
  title,
  'action_title' as campo,
  '⚠️ Tem travessão' as problema
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND action_title LIKE '% — %'

UNION ALL

SELECT 
  day_number,
  title,
  'motivational_phrase' as campo,
  '⚠️ Tem travessão' as problema
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND motivational_phrase LIKE '% — %'

UNION ALL

-- Verificar "tração" incorreto
SELECT 
  day_number,
  title,
  'objective' as campo,
  '⚠️ Tem "tração"' as problema
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND objective ILIKE '%tração%'
  AND objective NOT ILIKE '%atração%'
  AND objective NOT ILIKE '%frustração%' -- Excluir "atração" que é palavra válida

UNION ALL

SELECT 
  day_number,
  title,
  'guidance' as campo,
  '⚠️ Tem "tração"' as problema
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND guidance ILIKE '%tração%'
  AND guidance NOT ILIKE '%atração%'
  AND guidance NOT ILIKE '%frustração%'

UNION ALL

SELECT 
  day_number,
  title,
  'action_title' as campo,
  '⚠️ Tem "tração"' as problema
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND action_title ILIKE '%tração%'
  AND action_title NOT ILIKE '%atração%'
  AND action_title NOT ILIKE '%frustração%'

UNION ALL

SELECT 
  day_number,
  title,
  'motivational_phrase' as campo,
  '⚠️ Tem "tração"' as problema
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND motivational_phrase ILIKE '%tração%'
  AND motivational_phrase NOT ILIKE '%atração%'
  AND motivational_phrase NOT ILIKE '%frustração%'

ORDER BY day_number, campo;

-- Resumo geral (excluindo palavras válidas: "atração" e "frustração")
SELECT 
  COUNT(DISTINCT day_number) FILTER (WHERE objective LIKE '% — %' OR guidance LIKE '% — %' OR action_title LIKE '% — %' OR motivational_phrase LIKE '% — %') as dias_com_travessao,
  COUNT(DISTINCT day_number) FILTER (WHERE (objective ILIKE '%tração%' AND objective NOT ILIKE '%atração%' AND objective NOT ILIKE '%frustração%') OR 
                          (guidance ILIKE '%tração%' AND guidance NOT ILIKE '%atração%' AND guidance NOT ILIKE '%frustração%') OR
                          (action_title ILIKE '%tração%' AND action_title NOT ILIKE '%atração%' AND action_title NOT ILIKE '%frustração%') OR
                          (motivational_phrase ILIKE '%tração%' AND motivational_phrase NOT ILIKE '%atração%' AND motivational_phrase NOT ILIKE '%frustração%')) as dias_com_tracao,
  COUNT(*) as total_dias
FROM journey_days
WHERE day_number BETWEEN 1 AND 30;

