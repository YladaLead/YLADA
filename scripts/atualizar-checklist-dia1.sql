-- ATUALIZAR CHECKLIST DO DIA 1
-- Remove referências a vídeo e material externo
-- Alinha com linguagem simples da LYA e conteúdo inline
-- Execute esta query no Supabase SQL Editor

UPDATE journey_days
SET checklist_items = '[
  "Anotar o que mais fez sentido para você",
  "Pensar em 3 coisas que isso vai te ajudar no dia a dia"
]'::jsonb
WHERE day_number = 1;

-- Verificar resultado
SELECT 
  day_number,
  title,
  checklist_items
FROM journey_days
WHERE day_number = 1;
