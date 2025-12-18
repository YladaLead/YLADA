-- =====================================================
-- CORRIGIR "TRAÇÃO" INCORRETO NA SEMANA 1
-- =====================================================
-- O ChatGPT está gerando "tração" onde deveria ser travessão (—) ou vírgula
-- Este script corrige todos os casos de "tração" incorreto nos textos

-- =====================================================
-- DIA 1: Corrigir "negócio tração e" → "negócio — e"
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(objective, 'negócio tração e', 'negócio — e'),
      'negócio tração,', 'negócio — e'
    ),
    'tração e como isso impacta', '— e como isso impacta'
  ),
  guidance = REPLACE(
    REPLACE(
      REPLACE(guidance, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  action_title = REPLACE(
    REPLACE(
      REPLACE(action_title, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(motivational_phrase, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  updated_at = NOW()
WHERE day_number = 1
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- DIA 2: Corrigir "tração" incorreto
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(objective, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  guidance = REPLACE(
    REPLACE(
      REPLACE(guidance, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  action_title = REPLACE(
    REPLACE(
      REPLACE(action_title, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(motivational_phrase, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  updated_at = NOW()
WHERE day_number = 2
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- DIA 3: Corrigir "tração" incorreto
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(objective, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  guidance = REPLACE(
    REPLACE(
      REPLACE(guidance, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  action_title = REPLACE(
    REPLACE(
      REPLACE(action_title, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(motivational_phrase, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  updated_at = NOW()
WHERE day_number = 3
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- DIA 4: Corrigir "tração" incorreto
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(objective, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  guidance = REPLACE(
    REPLACE(
      REPLACE(guidance, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  action_title = REPLACE(
    REPLACE(
      REPLACE(action_title, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(motivational_phrase, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  updated_at = NOW()
WHERE day_number = 4
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- DIA 5: Corrigir "tração" incorreto
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(objective, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  guidance = REPLACE(
    REPLACE(
      REPLACE(guidance, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  action_title = REPLACE(
    REPLACE(
      REPLACE(action_title, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(motivational_phrase, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  updated_at = NOW()
WHERE day_number = 5
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- DIA 6: Corrigir "tração" incorreto
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(objective, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  guidance = REPLACE(
    REPLACE(
      REPLACE(guidance, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  action_title = REPLACE(
    REPLACE(
      REPLACE(action_title, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(motivational_phrase, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  updated_at = NOW()
WHERE day_number = 6
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- DIA 7: Corrigir "tração" incorreto
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(objective, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  guidance = REPLACE(
    REPLACE(
      REPLACE(guidance, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  action_title = REPLACE(
    REPLACE(
      REPLACE(action_title, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(motivational_phrase, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  updated_at = NOW()
WHERE day_number = 7
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- CORREÇÃO GENÉRICA PARA TODOS OS DIAS (caso tenha sobrado algo)
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(objective, 'negócio tração e', 'negócio — e'),
        'tração e como isso impacta', '— e como isso impacta'
      ),
      'tração e', '— e'
    ),
    'tração,', '— e'
  ),
  guidance = REPLACE(
    REPLACE(
      REPLACE(guidance, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  action_title = REPLACE(
    REPLACE(
      REPLACE(action_title, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(motivational_phrase, 'tração e', '— e'),
      'tração,', '— e'
    ),
    'tração como', '— e como'
  ),
  updated_at = NOW()
WHERE day_number BETWEEN 1 AND 7
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
-- Verificar se ainda há "tração" incorreto nos textos
SELECT 
  day_number,
  title,
  CASE 
    WHEN objective ILIKE '%tração%' THEN '⚠️ Tem "tração" no objective'
    WHEN guidance ILIKE '%tração%' THEN '⚠️ Tem "tração" no guidance'
    WHEN action_title ILIKE '%tração%' THEN '⚠️ Tem "tração" no action_title'
    WHEN motivational_phrase ILIKE '%tração%' THEN '⚠️ Tem "tração" no motivational_phrase'
    ELSE '✅ Sem "tração"'
  END as verificacao_tracao,
  LEFT(objective, 80) as objective_preview,
  LEFT(guidance, 80) as guidance_preview
FROM journey_days
WHERE day_number BETWEEN 1 AND 7
ORDER BY day_number;

