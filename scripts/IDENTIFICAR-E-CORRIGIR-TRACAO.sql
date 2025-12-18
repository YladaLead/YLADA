-- =====================================================
-- IDENTIFICAR E CORRIGIR "TRAÇÃO" INCORRETO
-- =====================================================

-- Primeiro, identificar qual dia tem "tração"
SELECT 
  day_number,
  title,
  'objective' as campo,
  objective as texto_completo
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND objective ILIKE '%tração%'
  AND objective NOT ILIKE '%atração%'

UNION ALL

SELECT 
  day_number,
  title,
  'guidance' as campo,
  guidance as texto_completo
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND guidance ILIKE '%tração%'
  AND guidance NOT ILIKE '%atração%'

UNION ALL

SELECT 
  day_number,
  title,
  'action_title' as campo,
  action_title as texto_completo
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND action_title ILIKE '%tração%'
  AND action_title NOT ILIKE '%atração%'

UNION ALL

SELECT 
  day_number,
  title,
  'motivational_phrase' as campo,
  motivational_phrase as texto_completo
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND motivational_phrase ILIKE '%tração%'
  AND motivational_phrase NOT ILIKE '%atração%'

ORDER BY day_number, campo;

-- =====================================================
-- CORRIGIR TODOS OS CASOS DE "TRAÇÃO" INCORRETO
-- =====================================================
UPDATE journey_days
SET
  objective = REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(objective, '\s+tração\s+e\s+', ' e ', 'gi'),
      '\s+tração\s*,', ',', 'gi'
    ),
    '\s+tração\s+', ' ', 'gi'
  ),
  guidance = REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(guidance, '\s+tração\s+e\s+', ' e ', 'gi'),
      '\s+tração\s*,', ',', 'gi'
    ),
    '\s+tração\s+', ' ', 'gi'
  ),
  action_title = REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(action_title, '\s+tração\s+e\s+', ' e ', 'gi'),
      '\s+tração\s*,', ',', 'gi'
    ),
    '\s+tração\s+', ' ', 'gi'
  ),
  motivational_phrase = REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(motivational_phrase, '\s+tração\s+e\s+', ' e ', 'gi'),
      '\s+tração\s*,', ',', 'gi'
    ),
    '\s+tração\s+', ' ', 'gi'
  ),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND (
    (objective ILIKE '%tração%' AND objective NOT ILIKE '%atração%') OR
    (guidance ILIKE '%tração%' AND guidance NOT ILIKE '%atração%') OR
    (action_title ILIKE '%tração%' AND action_title NOT ILIKE '%atração%') OR
    (motivational_phrase ILIKE '%tração%' AND motivational_phrase NOT ILIKE '%atração%')
  );

-- Verificar se foi corrigido
SELECT 
  COUNT(*) FILTER (WHERE (objective ILIKE '%tração%' AND objective NOT ILIKE '%atração%') OR 
                          (guidance ILIKE '%tração%' AND guidance NOT ILIKE '%atração%') OR
                          (action_title ILIKE '%tração%' AND action_title NOT ILIKE '%atração%') OR
                          (motivational_phrase ILIKE '%tração%' AND motivational_phrase NOT ILIKE '%atração%')) as dias_com_tracao_restante
FROM journey_days
WHERE day_number BETWEEN 1 AND 30;
-- Deve retornar 0

