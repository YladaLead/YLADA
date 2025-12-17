-- Script para analisar conteúdos da Semana 1 da Jornada
-- Execute este script no Supabase SQL Editor para ver os conteúdos completos

-- Buscar todos os campos dos primeiros 7 dias (Semana 1)
SELECT 
  day_number,
  week_number,
  title,
  objective,
  guidance,
  action_type,
  action_title,
  checklist_items,
  motivational_phrase
FROM journey_days
WHERE week_number = 1
ORDER BY day_number;

-- Comparação lado a lado dos primeiros 3 dias
SELECT 
  day_number,
  title,
  LEFT(objective, 100) as objective_preview,
  LEFT(guidance, 100) as guidance_preview,
  action_title,
  array_length(checklist_items::jsonb::text::jsonb, 1) as num_checklist_items
FROM journey_days
WHERE day_number IN (1, 2, 3)
ORDER BY day_number;
