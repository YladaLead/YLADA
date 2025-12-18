-- =====================================================
-- MELHORAR FORMATAÇÃO DA ORIENTAÇÃO - TODOS OS DIAS
-- =====================================================
-- Adiciona quebras de linha e negrito para "Exemplo prático:" e "Erro comum:"
-- Torna o texto menos "amuado" e mais visual

-- =====================================================
-- ATUALIZAR TODOS OS DIAS (1-30)
-- =====================================================

-- Primeiro, adicionar quebra de linha e negrito antes de "Exemplo prático:"
-- Usar REPLACE para garantir que funcione mesmo se já tiver algum formato
UPDATE journey_days
SET
  guidance = CASE
    -- Se já tem **Exemplo prático:** mas sem quebra de linha antes
    WHEN guidance LIKE '%**Exemplo prático:**%' THEN
      REGEXP_REPLACE(
        guidance,
        '([^\n])(\*\*Exemplo prático:\*\*)',
        E'\\1\n\n\\2',
        'g'
      )
    -- Se tem "Exemplo prático:" sem formatação
    WHEN guidance LIKE '%Exemplo prático:%' THEN
      REGEXP_REPLACE(
        guidance,
        '(\s+)(Exemplo prático:)',
        E'\n\n**\\2**',
        'g'
      )
    ELSE guidance
  END,
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND guidance ILIKE '%Exemplo prático:%';

-- Depois, adicionar quebra de linha e negrito antes de "Erro comum:"
UPDATE journey_days
SET
  guidance = CASE
    -- Se já tem **Erro comum:** mas sem quebra de linha antes
    WHEN guidance LIKE '%**Erro comum:**%' THEN
      REGEXP_REPLACE(
        guidance,
        '([^\n])(\*\*Erro comum:\*\*)',
        E'\\1\n\n\\2',
        'g'
      )
    -- Se tem "Erro comum:" sem formatação
    WHEN guidance LIKE '%Erro comum:%' THEN
      REGEXP_REPLACE(
        guidance,
        '(\s+)(Erro comum:)',
        E'\n\n**\\2**',
        'g'
      )
    ELSE guidance
  END,
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND guidance ILIKE '%Erro comum:%';

-- =====================================================
-- VERIFICAÇÃO: Ver como ficou (amostra dos primeiros 7 dias)
-- =====================================================
SELECT 
  day_number,
  title,
  guidance
FROM journey_days
WHERE day_number BETWEEN 1 AND 7
ORDER BY day_number;

