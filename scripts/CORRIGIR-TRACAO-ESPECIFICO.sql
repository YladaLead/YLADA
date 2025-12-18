-- =====================================================
-- CORRIGIR "TRAÇÃO" - VERSÃO MAIS AGRESSIVA
-- =====================================================

-- Primeiro, mostrar EXATAMENTE onde está o problema
SELECT 
  day_number,
  title,
  'objective' as campo,
  objective as texto_original,
  POSITION('tração' IN LOWER(objective)) as posicao
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND objective ILIKE '%tração%'
  AND objective NOT ILIKE '%atração%'

UNION ALL

SELECT 
  day_number,
  title,
  'guidance' as campo,
  guidance as texto_original,
  POSITION('tração' IN LOWER(guidance)) as posicao
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND guidance ILIKE '%tração%'
  AND guidance NOT ILIKE '%atração%'

UNION ALL

SELECT 
  day_number,
  title,
  'action_title' as campo,
  action_title as texto_original,
  POSITION('tração' IN LOWER(action_title)) as posicao
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND action_title ILIKE '%tração%'
  AND action_title NOT ILIKE '%atração%'

UNION ALL

SELECT 
  day_number,
  title,
  'motivational_phrase' as campo,
  motivational_phrase as texto_original,
  POSITION('tração' IN LOWER(motivational_phrase)) as posicao
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND motivational_phrase ILIKE '%tração%'
  AND motivational_phrase NOT ILIKE '%atração%'

ORDER BY day_number, campo;

-- =====================================================
-- CORREÇÃO AGRESSIVA - REMOVER TODAS AS OCORRÊNCIAS
-- =====================================================

-- Objective
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(objective, ' tração e ', ' e '),
          ' tração,', ',')
        , ' tração ', ' ')
      , 'tração e ', 'e ')
    , 'tração,', ','),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND objective ILIKE '%tração%'
  AND objective NOT ILIKE '%atração%';

-- Guidance
UPDATE journey_days
SET
  guidance = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(guidance, ' tração e ', ' e '),
          ' tração,', ',')
        , ' tração ', ' ')
      , 'tração e ', 'e ')
    , 'tração,', ','),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND guidance ILIKE '%tração%'
  AND guidance NOT ILIKE '%atração%';

-- Action Title
UPDATE journey_days
SET
  action_title = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(action_title, ' tração e ', ' e '),
          ' tração,', ',')
        , ' tração ', ' ')
      , 'tração e ', 'e ')
    , 'tração,', ','),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND action_title ILIKE '%tração%'
  AND action_title NOT ILIKE '%atração%';

-- Motivational Phrase
UPDATE journey_days
SET
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(motivational_phrase, ' tração e ', ' e '),
          ' tração,', ',')
        , ' tração ', ' ')
      , 'tração e ', 'e ')
    , 'tração,', ','),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND motivational_phrase ILIKE '%tração%'
  AND motivational_phrase NOT ILIKE '%atração%';

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
SELECT 
  day_number,
  title,
  CASE 
    WHEN (objective ILIKE '%tração%' AND objective NOT ILIKE '%atração%') THEN '⚠️ objective'
    WHEN (guidance ILIKE '%tração%' AND guidance NOT ILIKE '%atração%') THEN '⚠️ guidance'
    WHEN (action_title ILIKE '%tração%' AND action_title NOT ILIKE '%atração%') THEN '⚠️ action_title'
    WHEN (motivational_phrase ILIKE '%tração%' AND motivational_phrase NOT ILIKE '%atração%') THEN '⚠️ motivational_phrase'
    ELSE '✅ OK'
  END as status
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND (
    (objective ILIKE '%tração%' AND objective NOT ILIKE '%atração%') OR
    (guidance ILIKE '%tração%' AND guidance NOT ILIKE '%atração%') OR
    (action_title ILIKE '%tração%' AND action_title NOT ILIKE '%atração%') OR
    (motivational_phrase ILIKE '%tração%' AND motivational_phrase NOT ILIKE '%atração%')
  );

