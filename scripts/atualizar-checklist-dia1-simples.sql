-- Script simples para atualizar checklist do Dia 1
-- Execute este script no Supabase SQL Editor

UPDATE journey_days
SET checklist_items = '[
  "Anotar o que mais fez sentido para você",
  "Pensar em 3 coisas que isso vai te ajudar no dia a dia"
]'::jsonb
WHERE day_number = 1;

-- Verificar se atualizou corretamente
SELECT 
  day_number,
  checklist_items
FROM journey_days
WHERE day_number = 1;
