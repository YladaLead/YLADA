-- =====================================================
-- CORRIGIR "TRAÇÃO" INCORRETO - TODA A JORNADA
-- =====================================================
-- O ChatGPT está gerando "tração" onde deveria ser travessão (—) ou vírgula
-- Este script corrige TODOS os casos de "tração" incorreto em TODOS os dias

-- =====================================================
-- CORREÇÃO GENÉRICA PARA TODOS OS DIAS (1-30)
-- =====================================================
-- Substitui padrões comuns de "tração" incorreto

UPDATE journey_days
SET
  -- Objective: corrigir "negócio tração e" → "negócio e"
  objective = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(objective, 'negócio tração e', 'negócio e'),
          'negócio tração,', 'negócio e'
        ),
        'tração e como isso impacta', 'e como isso impacta'
      ),
      'tração e', ', e'
    ),
    'tração como', ', e como'
  ),
  
  -- Guidance: corrigir todos os padrões de "tração"
  guidance = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(guidance, 'tração e', ', e'),
            'tração,', ', e'
          ),
          'tração como', ', e como'
        ),
        'tração —', ','
      ),
      'tração.', '.'
    ),
    'tração;', ';'
  ),
  
  -- Action Title: corrigir "tração"
  action_title = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(action_title, 'tração e', ', e'),
        'tração,', ', e'
      ),
      'tração como', ', e como'
    ),
    'tração —', ','
  ),
  
  -- Motivational Phrase: corrigir "tração"
  motivational_phrase = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(motivational_phrase, 'tração e', ', e'),
        'tração,', ', e'
      ),
      'tração como', ', e como'
    ),
    'tração —', ','
  ),
  
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND (
    objective ILIKE '%tração%' OR
    guidance ILIKE '%tração%' OR
    action_title ILIKE '%tração%' OR
    motivational_phrase ILIKE '%tração%'
  );

-- =====================================================
-- CORREÇÕES ESPECÍFICAS PARA PADRÕES COMUNS
-- =====================================================

-- Padrão: "X tração e Y" → "X e Y"
UPDATE journey_days
SET
  objective = REGEXP_REPLACE(objective, '(\w+)\s+tração\s+e\s+', '\1 e ', 'gi'),
  guidance = REGEXP_REPLACE(guidance, '(\w+)\s+tração\s+e\s+', '\1 e ', 'gi'),
  action_title = REGEXP_REPLACE(action_title, '(\w+)\s+tração\s+e\s+', '\1 e ', 'gi'),
  motivational_phrase = REGEXP_REPLACE(motivational_phrase, '(\w+)\s+tração\s+e\s+', '\1 e ', 'gi'),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND (
    objective ~* 'tração\s+e' OR
    guidance ~* 'tração\s+e' OR
    action_title ~* 'tração\s+e' OR
    motivational_phrase ~* 'tração\s+e'
  );

-- Padrão: "X tração, Y" → "X, Y"
UPDATE journey_days
SET
  objective = REGEXP_REPLACE(objective, '(\w+)\s+tração\s*,', '\1,', 'gi'),
  guidance = REGEXP_REPLACE(guidance, '(\w+)\s+tração\s*,', '\1,', 'gi'),
  action_title = REGEXP_REPLACE(action_title, '(\w+)\s+tração\s*,', '\1,', 'gi'),
  motivational_phrase = REGEXP_REPLACE(motivational_phrase, '(\w+)\s+tração\s*,', '\1,', 'gi'),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND (
    objective ~* 'tração\s*,' OR
    guidance ~* 'tração\s*,' OR
    action_title ~* 'tração\s*,' OR
    motivational_phrase ~* 'tração\s*,'
  );

-- Padrão: "X tração Y" (sem vírgula) → "X, Y"
UPDATE journey_days
SET
  objective = REGEXP_REPLACE(objective, '(\w+)\s+tração\s+([a-záéíóúâêôãõç])', '\1, \2', 'gi'),
  guidance = REGEXP_REPLACE(guidance, '(\w+)\s+tração\s+([a-záéíóúâêôãõç])', '\1, \2', 'gi'),
  action_title = REGEXP_REPLACE(action_title, '(\w+)\s+tração\s+([a-záéíóúâêôãõç])', '\1, \2', 'gi'),
  motivational_phrase = REGEXP_REPLACE(motivational_phrase, '(\w+)\s+tração\s+([a-záéíóúâêôãõç])', '\1, \2', 'gi'),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND (
    objective ~* '\w+\s+tração\s+[a-záéíóúâêôãõç]' OR
    guidance ~* '\w+\s+tração\s+[a-záéíóúâêôãõç]' OR
    action_title ~* '\w+\s+tração\s+[a-záéíóúâêôãõç]' OR
    motivational_phrase ~* '\w+\s+tração\s+[a-záéíóúâêôãõç]'
  );

-- =====================================================
-- VERIFICAÇÃO FINAL - LISTAR TODOS OS CASOS RESTANTES
-- =====================================================
SELECT 
  day_number,
  title,
  'objective' as campo,
  objective as texto_completo,
  POSITION('tração' IN LOWER(objective)) as posicao
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND objective ILIKE '%tração%'

UNION ALL

SELECT 
  day_number,
  title,
  'guidance' as campo,
  guidance as texto_completo,
  POSITION('tração' IN LOWER(guidance)) as posicao
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND guidance ILIKE '%tração%'

UNION ALL

SELECT 
  day_number,
  title,
  'action_title' as campo,
  action_title as texto_completo,
  POSITION('tração' IN LOWER(action_title)) as posicao
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND action_title ILIKE '%tração%'

UNION ALL

SELECT 
  day_number,
  title,
  'motivational_phrase' as campo,
  motivational_phrase as texto_completo,
  POSITION('tração' IN LOWER(motivational_phrase)) as posicao
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND motivational_phrase ILIKE '%tração%'

ORDER BY day_number, campo;

-- =====================================================
-- RESUMO DE CORREÇÕES APLICADAS
-- =====================================================
SELECT 
  COUNT(*) FILTER (WHERE objective ILIKE '%tração%') as objective_com_tracao,
  COUNT(*) FILTER (WHERE guidance ILIKE '%tração%') as guidance_com_tracao,
  COUNT(*) FILTER (WHERE action_title ILIKE '%tração%') as action_title_com_tracao,
  COUNT(*) FILTER (WHERE motivational_phrase ILIKE '%tração%') as motivational_phrase_com_tracao,
  COUNT(*) as total_dias
FROM journey_days
WHERE day_number BETWEEN 1 AND 30;

