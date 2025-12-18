-- =====================================================
-- CORRIGIR TRAVESSÃO NO DIA 4
-- =====================================================
-- O guidance do Dia 4 ainda tem "Meta não é cobrança — é direção"
-- Precisa ser "Meta não é cobrança, é direção"

UPDATE journey_days
SET
  guidance = REPLACE(guidance, 'Meta não é cobrança — é direção', 'Meta não é cobrança, é direção'),
  updated_at = NOW()
WHERE day_number = 4;

-- Verificar se foi corrigido
SELECT 
  day_number,
  title,
  guidance,
  CASE 
    WHEN guidance LIKE '% — %' THEN '⚠️ Ainda tem travessão'
    ELSE '✅ Corrigido'
  END as status
FROM journey_days
WHERE day_number = 4;

