-- =====================================================
-- MELHORAR FORMATAÇÃO DA ORIENTAÇÃO - TODOS OS DIAS
-- =====================================================
-- Adiciona quebras de linha e negrito para "Exemplo prático:" e "Erro comum:"
-- Torna o texto menos "amuado" e mais visual

-- =====================================================
-- ATUALIZAR TODOS OS DIAS (1-30)
-- =====================================================

UPDATE journey_days
SET
  guidance = REGEXP_REPLACE(
    REGEXP_REPLACE(
      guidance,
      '(\s+)(Exemplo prático:)',
      E'\n\n**\\2**',
      'g'
    ),
    '(\s+)(Erro comum:)',
    E'\n\n**\\2**',
    'g'
  ),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND (
    guidance ILIKE '%Exemplo prático:%' OR
    guidance ILIKE '%Erro comum:%'
  );

-- =====================================================
-- VERIFICAÇÃO: Ver como ficou (amostra)
-- =====================================================
SELECT 
  day_number,
  title,
  guidance
FROM journey_days
WHERE day_number BETWEEN 1 AND 7
ORDER BY day_number;

