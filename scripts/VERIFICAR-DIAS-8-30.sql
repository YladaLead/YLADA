-- =====================================================
-- VERIFICAR ESTADO DOS DIAS 8-30
-- =====================================================
-- Verificar quais dias existem e se têm travessões ou "tração"

-- Verificar quantos dias existem
SELECT 
  COUNT(*) as total_dias,
  MIN(day_number) as primeiro_dia,
  MAX(day_number) as ultimo_dia
FROM journey_days;

-- Listar todos os dias 8-30
SELECT 
  day_number,
  week_number,
  title,
  CASE 
    WHEN objective LIKE '% — %' OR objective ILIKE '%tração%' THEN '⚠️ Tem travessão/tração'
    WHEN guidance LIKE '% — %' OR guidance ILIKE '%tração%' THEN '⚠️ Tem travessão/tração'
    WHEN action_title LIKE '% — %' OR action_title ILIKE '%tração%' THEN '⚠️ Tem travessão/tração'
    WHEN motivational_phrase LIKE '% — %' OR motivational_phrase ILIKE '%tração%' THEN '⚠️ Tem travessão/tração'
    ELSE '✅ OK'
  END as status_textos,
  LEFT(objective, 60) as objective_preview
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
ORDER BY day_number;

-- Verificar especificamente travessões e "tração"
SELECT 
  day_number,
  title,
  'objective' as campo,
  objective as texto_completo
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
  AND (objective LIKE '% — %' OR objective ILIKE '%tração%')

UNION ALL

SELECT 
  day_number,
  title,
  'guidance' as campo,
  guidance as texto_completo
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
  AND (guidance LIKE '% — %' OR guidance ILIKE '%tração%')

UNION ALL

SELECT 
  day_number,
  title,
  'action_title' as campo,
  action_title as texto_completo
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
  AND (action_title LIKE '% — %' OR action_title ILIKE '%tração%')

UNION ALL

SELECT 
  day_number,
  title,
  'motivational_phrase' as campo,
  motivational_phrase as texto_completo
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
  AND (motivational_phrase LIKE '% — %' OR motivational_phrase ILIKE '%tração%')

ORDER BY day_number, campo;

