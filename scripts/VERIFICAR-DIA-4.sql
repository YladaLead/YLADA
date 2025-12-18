-- =====================================================
-- VERIFICAR DIA 4 COMPLETO
-- =====================================================

SELECT 
  day_number,
  week_number,
  title,
  objective,
  guidance,
  action_type,
  action_id,
  action_title,
  checklist_items,
  motivational_phrase,
  updated_at
FROM journey_days
WHERE day_number = 4;

-- Verificar se há problemas
SELECT 
  day_number,
  title,
  CASE 
    WHEN objective LIKE '% — %' OR objective ILIKE '%tração%' THEN '⚠️ Tem travessão/tração no objective'
    WHEN guidance LIKE '% — %' OR guidance ILIKE '%tração%' THEN '⚠️ Tem travessão/tração no guidance'
    WHEN action_title LIKE '% — %' OR action_title ILIKE '%tração%' THEN '⚠️ Tem travessão/tração no action_title'
    WHEN motivational_phrase LIKE '% — %' OR motivational_phrase ILIKE '%tração%' THEN '⚠️ Tem travessão/tração no motivational_phrase'
    ELSE '✅ OK'
  END as status
FROM journey_days
WHERE day_number = 4;

