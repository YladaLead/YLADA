-- =====================================================
-- CORRIGIR OBJECTIVE DO DIA 4
-- =====================================================

-- Primeiro, ver o texto atual
SELECT 
  day_number,
  title,
  objective as texto_atual
FROM journey_days
WHERE day_number = 4;

-- Corrigir "tração" no objective do Dia 4
UPDATE journey_days
SET
  objective = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(objective, ' tração e ', ' e '),
            ' tração,', ',')
          , ' tração ', ' ')
        , 'tração e ', 'e ')
      , 'tração,', ',')
    , 'tração.', '.')
  , 'tração;', ';'),
  updated_at = NOW()
WHERE day_number = 4;

-- Verificar se foi corrigido
SELECT 
  day_number,
  title,
  objective as texto_corrigido,
  CASE 
    WHEN objective ILIKE '%tração%' AND objective NOT ILIKE '%atração%' THEN '⚠️ Ainda tem "tração"'
    ELSE '✅ Corrigido'
  END as status
FROM journey_days
WHERE day_number = 4;

