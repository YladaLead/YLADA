-- =====================================================
-- RESTAURAR "FRUSTRAÇÃO" NO DIA 4
-- =====================================================
-- O script anterior removeu "tração" de dentro de "frustração"
-- Precisamos restaurar a palavra completa

UPDATE journey_days
SET
  objective = REPLACE(objective, 'frus.', 'frustração.'),
  objective = REPLACE(objective, 'frus,', 'frustração,'),
  objective = REPLACE(objective, 'frus ', 'frustração '),
  updated_at = NOW()
WHERE day_number = 4
  AND objective ILIKE '%frus%';

-- Verificar se foi corrigido
SELECT 
  day_number,
  title,
  objective as texto_corrigido,
  CASE 
    WHEN objective ILIKE '%frus%' THEN '⚠️ Ainda tem "frus"'
    WHEN objective ILIKE '%frustração%' THEN '✅ Corrigido'
    ELSE '✅ OK'
  END as status
FROM journey_days
WHERE day_number = 4;

-- Verificar se não há mais "tração" incorreto (exceto dentro de palavras válidas)
SELECT 
  day_number,
  title,
  CASE 
    WHEN (objective ILIKE '%tração%' AND objective NOT ILIKE '%atração%' AND objective NOT ILIKE '%frustração%') THEN '⚠️ Tem "tração" incorreto'
    ELSE '✅ OK'
  END as status
FROM journey_days
WHERE day_number = 4;

