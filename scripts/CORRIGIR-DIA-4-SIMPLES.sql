-- =====================================================
-- CORRIGIR DIA 4 - VERSÃO SIMPLES
-- =====================================================

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
  '✅ Corrigido' as status
FROM journey_days
WHERE day_number = 4;

