-- =====================================================
-- CORRIGIR TODOS OS TRAVESSÕES (—) - EXECUTAR AGORA
-- =====================================================
-- Substitui TODOS os travessões por vírgulas em TODOS os dias

-- =====================================================
-- DIA 1: Corrigir especificamente
-- =====================================================
UPDATE journey_days
SET
  -- "esforço — é" → "esforço, é" e depois qualquer outro travessão
  guidance = REPLACE(REPLACE(guidance, 'esforço — é', 'esforço, é'), ' — ', ', '),
  -- Objective
  objective = REPLACE(objective, ' — ', ', '),
  -- Action Title
  action_title = REPLACE(action_title, ' — ', ', '),
  -- Motivational Phrase
  motivational_phrase = REPLACE(motivational_phrase, ' — ', ', '),
  updated_at = NOW()
WHERE day_number = 1;

-- =====================================================
-- TODOS OS DIAS (1-30): Remover TODOS os travessões
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(objective, ' — ', ', '),
  guidance = REPLACE(guidance, ' — ', ', '),
  action_title = REPLACE(action_title, ' — ', ', '),
  motivational_phrase = REPLACE(motivational_phrase, ' — ', ', '),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND (
    objective LIKE '% — %' OR
    guidance LIKE '% — %' OR
    action_title LIKE '% — %' OR
    motivational_phrase LIKE '% — %'
  );

-- =====================================================
-- VERIFICAÇÃO: Ver o Dia 1 após correção
-- =====================================================
SELECT 
  day_number,
  title,
  'objective' as campo,
  objective as texto
FROM journey_days
WHERE day_number = 1

UNION ALL

SELECT 
  day_number,
  title,
  'guidance' as campo,
  guidance as texto
FROM journey_days
WHERE day_number = 1

UNION ALL

SELECT 
  day_number,
  title,
  'action_title' as campo,
  action_title as texto
FROM journey_days
WHERE day_number = 1

UNION ALL

SELECT 
  day_number,
  title,
  'motivational_phrase' as campo,
  motivational_phrase as texto
FROM journey_days
WHERE day_number = 1;
