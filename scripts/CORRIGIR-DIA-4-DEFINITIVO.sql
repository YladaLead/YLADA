-- =====================================================
-- CORRIGIR DIA 4 DEFINITIVAMENTE
-- =====================================================
-- Restaurar o texto correto do objective do Dia 4

UPDATE journey_days
SET
  objective = 'Escolher uma prioridade profissional clara para os próximos 30 dias, evitando dispersão e frustração.',
  updated_at = NOW()
WHERE day_number = 4;

-- Verificar se está correto
SELECT 
  day_number,
  title,
  objective,
  CASE 
    WHEN objective ILIKE '%tração%' AND objective NOT ILIKE '%frustração%' AND objective NOT ILIKE '%atração%' THEN '⚠️ Tem "tração" incorreto'
    WHEN objective ILIKE '%frus%' THEN '⚠️ Tem "frus" (incompleto)'
    ELSE '✅ OK'
  END as status
FROM journey_days
WHERE day_number = 4;

