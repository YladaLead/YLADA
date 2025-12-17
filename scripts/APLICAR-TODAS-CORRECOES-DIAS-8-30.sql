-- =====================================================
-- APLICAR TODAS AS CORREÇÕES NOS DIAS 8-30
-- =====================================================
-- Este script aplica:
-- 1. Remoção de travessões (—)
-- 2. Remoção de "tração" incorreto
-- 3. Atualização com textos melhorados do ChatGPT

-- IMPORTANTE: Execute primeiro os scripts de atualização:
-- 1. scripts/ATUALIZAR-SEMANA2-COMPLETA.sql
-- 2. scripts/ATUALIZAR-SEMANA3-COMPLETA.sql
-- 3. scripts/ATUALIZAR-SEMANA4-COMPLETA.sql
-- Depois execute este script para garantir que não há travessões ou "tração"

-- =====================================================
-- REMOVER TODOS OS TRAVESSÕES DOS DIAS 8-30
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(objective, ' — ', ', '),
  guidance = REPLACE(guidance, ' — ', ', '),
  action_title = REPLACE(action_title, ' — ', ', '),
  motivational_phrase = REPLACE(motivational_phrase, ' — ', ', '),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 8 AND 30
  AND (
    objective LIKE '% — %' OR
    guidance LIKE '% — %' OR
    action_title LIKE '% — %' OR
    motivational_phrase LIKE '% — %'
  );

-- =====================================================
-- REMOVER "TRAÇÃO" INCORRETO DOS DIAS 8-30
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
  day_number BETWEEN 8 AND 30
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- VERIFICAÇÃO FINAL: Ver o que ainda tem problemas
-- =====================================================
SELECT 
  day_number,
  title,
  'objective' as campo,
  objective as texto
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
  AND (objective LIKE '% — %' OR objective ILIKE '%tração%')

UNION ALL

SELECT 
  day_number,
  title,
  'guidance' as campo,
  guidance as texto
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
  AND (guidance LIKE '% — %' OR guidance ILIKE '%tração%')

UNION ALL

SELECT 
  day_number,
  title,
  'action_title' as campo,
  action_title as texto
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
  AND (action_title LIKE '% — %' OR action_title ILIKE '%tração%')

UNION ALL

SELECT 
  day_number,
  title,
  'motivational_phrase' as campo,
  motivational_phrase as texto
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
  AND (motivational_phrase LIKE '% — %' OR motivational_phrase ILIKE '%tração%')

ORDER BY day_number, campo;
