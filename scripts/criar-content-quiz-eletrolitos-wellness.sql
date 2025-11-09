-- ============================================
-- ATUALIZAR CONTENT DO QUIZ ELETRÓLITOS (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente cãibras musculares, fadiga ou desequilíbrio com frequência?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, tenho esses sintomas frequentemente"},
          {"id": "b", "label": "Sim, às vezes sinto esses problemas"},
          {"id": "c", "label": "Raramente, mas já aconteceu"},
          {"id": "d", "label": "Não, não tenho esses sintomas"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente que precisa de ajuda para equilibrar seus eletrólitos?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito de orientação profissional"},
          {"id": "b", "label": "Sim, seria útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for algo prático e eficaz"},
          {"id": "d", "label": "Não, consigo equilibrar sozinho(a)"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza produtos que ajudam a manter o equilíbrio eletrolítico?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é essencial para meu bem-estar"},
          {"id": "b", "label": "Bastante, procuro opções adequadas"},
          {"id": "c", "label": "Moderadamente, se for algo eficaz"},
          {"id": "d", "label": "Pouco, não me preocupo muito"}
        ]
      },
      {
        "id": 4,
        "question": "Você acredita que um plano personalizado pode melhorar seu equilíbrio eletrolítico?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, faria toda diferença e melhoraria muito"},
          {"id": "b", "label": "Sim, acredito que seria muito útil"},
          {"id": "c", "label": "Talvez, se for algo comprovado e eficaz"},
          {"id": "d", "label": "Não, não vejo necessidade"}
        ]
      },
      {
        "id": 5,
        "question": "Você está aberto(a) para ter um acompanhamento especializado em hidratação e eletrólitos?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, é exatamente o que preciso!"},
          {"id": "b", "label": "Sim, seria muito útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for alguém experiente e confiável"},
          {"id": "d", "label": "Não, prefiro fazer sozinho(a)"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%eletrólito%' OR LOWER(name) LIKE '%eletrolito%' OR LOWER(name) LIKE '%eletrólitos%' OR LOWER(name) LIKE '%eletrolitos%' OR slug LIKE '%eletrolito%' OR slug LIKE '%eletrolitos%');

-- Verificar o content atualizado
SELECT 
  name, 
  slug, 
  type, 
  content->>'template_type' as template_type,
  jsonb_array_length(content->'questions') as total_perguntas,
  content
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%eletrólito%' OR LOWER(name) LIKE '%eletrolito%' OR LOWER(name) LIKE '%eletrólitos%' OR LOWER(name) LIKE '%eletrolitos%' OR slug LIKE '%eletrolito%' OR slug LIKE '%eletrolitos%');

