-- =====================================================
-- REMOVER "TRAÇÃO" INCORRETO - EXECUTAR AGORA
-- =====================================================
-- Este script remove TODAS as ocorrências de "tração" incorreto
-- Substitui por vírgula ou remove conforme o contexto

-- =====================================================
-- CORREÇÃO PARA TODOS OS DIAS (1-30)
-- =====================================================

UPDATE journey_days
SET
  -- Objective: remover "tração" e ajustar pontuação
  objective = REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(objective, '\s+tração\s+e\s+', ' e ', 'gi'),
          '\s+tração\s*,', ',', 'gi'
        ),
        '\s+tração\s+', ' ', 'gi'
      ),
      'tração\s+e\s+', 'e ', 'gi'
    ),
    'tração\s*,', ',', 'gi'
  ),
  
  -- Guidance: remover "tração" e ajustar pontuação
  guidance = REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(guidance, '\s+tração\s+e\s+', ' e ', 'gi'),
          '\s+tração\s*,', ',', 'gi'
        ),
        '\s+tração\s+', ' ', 'gi'
      ),
      'tração\s+e\s+', 'e ', 'gi'
    ),
    'tração\s*,', ',', 'gi'
  ),
  
  -- Action Title: remover "tração" e ajustar pontuação
  action_title = REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(action_title, '\s+tração\s+e\s+', ' e ', 'gi'),
          '\s+tração\s*,', ',', 'gi'
        ),
        '\s+tração\s+', ' ', 'gi'
      ),
      'tração\s+e\s+', 'e ', 'gi'
    ),
    'tração\s*,', ',', 'gi'
  ),
  
  -- Motivational Phrase: remover "tração" e ajustar pontuação
  motivational_phrase = REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(motivational_phrase, '\s+tração\s+e\s+', ' e ', 'gi'),
          '\s+tração\s*,', ',', 'gi'
        ),
        '\s+tração\s+', ' ', 'gi'
      ),
      'tração\s+e\s+', 'e ', 'gi'
    ),
    'tração\s*,', ',', 'gi'
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

-- Padrão específico: "negócio tração e" → "negócio e"
UPDATE journey_days
SET
  objective = REPLACE(REPLACE(objective, 'negócio tração e', 'negócio e'), 'negócio tração,', 'negócio e'),
  guidance = REPLACE(REPLACE(guidance, 'negócio tração e', 'negócio e'), 'negócio tração,', 'negócio e'),
  updated_at = NOW()
WHERE 
  (objective ILIKE '%negócio tração%' OR guidance ILIKE '%negócio tração%');

-- Padrão: "tração e como isso impacta" → "e como isso impacta"
UPDATE journey_days
SET
  objective = REPLACE(objective, 'tração e como isso impacta', 'e como isso impacta'),
  guidance = REPLACE(guidance, 'tração e como isso impacta', 'e como isso impacta'),
  updated_at = NOW()
WHERE 
  (objective ILIKE '%tração e como isso impacta%' OR guidance ILIKE '%tração e como isso impacta%');

-- Padrão: "esforço tração é" → "esforço, é"
UPDATE journey_days
SET
  guidance = REPLACE(guidance, 'esforço tração é', 'esforço, é'),
  updated_at = NOW()
WHERE 
  guidance ILIKE '%esforço tração é%';

-- Padrão: "mudança tração e" → "mudança, e"
UPDATE journey_days
SET
  motivational_phrase = REPLACE(motivational_phrase, 'mudança tração e', 'mudança, e'),
  updated_at = NOW()
WHERE 
  motivational_phrase ILIKE '%mudança tração e%';

-- Padrão: "pessoa tração é" → "pessoa, é"
UPDATE journey_days
SET
  guidance = REPLACE(guidance, 'pessoa tração é', 'pessoa, é'),
  updated_at = NOW()
WHERE 
  guidance ILIKE '%pessoa tração é%';

-- Padrão: "livres tração e" → "livres, e"
UPDATE journey_days
SET
  guidance = REPLACE(guidance, 'livres tração e', 'livres, e'),
  updated_at = NOW()
WHERE 
  guidance ILIKE '%livres tração e%';

-- Padrão: "cobrança tração é" → "cobrança, é"
UPDATE journey_days
SET
  guidance = REPLACE(guidance, 'cobrança tração é', 'cobrança, é'),
  updated_at = NOW()
WHERE 
  guidance ILIKE '%cobrança tração é%';

-- Padrão: "difícil tração é" → "difícil, é"
UPDATE journey_days
SET
  guidance = REPLACE(guidance, 'difícil tração é', 'difícil, é'),
  updated_at = NOW()
WHERE 
  guidance ILIKE '%difícil tração é%';

-- Padrão: "diferente tração e" → "diferente, e"
UPDATE journey_days
SET
  guidance = REPLACE(guidance, 'diferente tração e', 'diferente, e'),
  updated_at = NOW()
WHERE 
  guidance ILIKE '%diferente tração e%';

-- =====================================================
-- VERIFICAÇÃO: LISTAR O QUE AINDA TEM "TRAÇÃO"
-- =====================================================
SELECT 
  day_number,
  title,
  'objective' as campo,
  objective as texto
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND objective ILIKE '%tração%'

UNION ALL

SELECT 
  day_number,
  title,
  'guidance' as campo,
  guidance as texto
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND guidance ILIKE '%tração%'

UNION ALL

SELECT 
  day_number,
  title,
  'action_title' as campo,
  action_title as texto
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND action_title ILIKE '%tração%'

UNION ALL

SELECT 
  day_number,
  title,
  'motivational_phrase' as campo,
  motivational_phrase as texto
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
  AND motivational_phrase ILIKE '%tração%'

ORDER BY day_number, campo;

