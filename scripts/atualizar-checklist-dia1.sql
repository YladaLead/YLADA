-- ATUALIZAR CHECKLIST DO DIA 1
-- Remove referências a vídeo e alinha com linguagem simples da LYA
-- Execute esta query no Supabase SQL Editor

UPDATE journey_days
SET checklist_items = '[
  "Ler o conteúdo do Pilar 1",
  "Anotar os 3 principais aprendizados",
  "Refletir sobre como aplicar na sua prática"
]'::jsonb
WHERE day_number = 1;

-- Verificar resultado
SELECT 
  day_number,
  title,
  checklist_items
FROM journey_days
WHERE day_number = 1;
