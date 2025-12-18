-- =====================================================
-- CORRIGIR DIA 2 - IDENTIDADE & POSTURA
-- =====================================================
-- Problema: Dia 2 está mostrando o mesmo conteúdo do Dia 1 (Pilar 1 completo)
-- Solução: Remover referência ao Pilar 1 e focar apenas em reflexão sobre identidade

-- DIA 2: Identidade & Postura de Nutri-Empresária
UPDATE journey_days
SET
  title = 'Identidade & Postura de Nutri-Empresária',
  objective = 'Refletir sobre quem você é hoje como profissional e quem deseja se tornar como Nutri-Empresária. Isso é importante porque sua identidade define suas escolhas e resultados.',
  guidance = 'Hoje você vai olhar para si com mais consciência. Identidade não é sobre fingir ser algo, é sobre assumir uma direção. Observe como você se apresenta e como fala do seu trabalho. O erro comum aqui é tentar copiar outras profissionais. Construa uma identidade que seja verdadeira para você.',
  action_type = 'exercicio', -- Mudar de 'pilar' para não mostrar Pilar 1 completo
  action_id = NULL, -- Não apontar para conteúdo externo
  action_title = 'Refletir sobre sua identidade profissional e observar sua postura ao longo do dia.',
  checklist_items = '[
    "Como você se enxerga hoje como profissional?",
    "Quais 3 características você quer desenvolver como Nutri-Empresária?",
    "Se pudesse se definir em uma frase, qual seria?"
  ]'::jsonb,
  motivational_phrase = 'Quando sua identidade muda, seus resultados acompanham.',
  updated_at = NOW()
WHERE day_number = 2;

-- Verificar diferenças entre Dia 1 e Dia 2
SELECT 
  day_number,
  title,
  action_type,
  LEFT(objective, 80) as objective_preview,
  LEFT(guidance, 80) as guidance_preview,
  jsonb_array_length(checklist_items) as num_reflexoes
FROM journey_days
WHERE day_number IN (1, 2)
ORDER BY day_number;

