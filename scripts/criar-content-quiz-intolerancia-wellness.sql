-- ============================================
-- ATUALIZAR CONTENT DO QUIZ INTOLERÂNCIA (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente desconforto digestivo após consumir certos alimentos?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sempre, me sinto muito mal"},
          {"id": "b", "label": "Frequentemente, tenho vários desconfortos"},
          {"id": "c", "label": "Às vezes, depende do alimento"},
          {"id": "d", "label": "Raramente ou nunca sinto desconforto"}
        ]
      },
      {
        "id": 2,
        "question": "Você já percebeu que alguns alimentos causam inchaço, gases ou dores abdominais?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, tenho esses sintomas regularmente"},
          {"id": "b", "label": "Sim, acontece com alguns alimentos específicos"},
          {"id": "c", "label": "Às vezes, mas não sei identificar o que causa"},
          {"id": "d", "label": "Não, não tenho esses sintomas"}
        ]
      },
      {
        "id": 3,
        "question": "Você sente que precisa de ajuda para identificar alimentos que te fazem mal?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito de orientação profissional"},
          {"id": "b", "label": "Sim, seria útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for algo prático e personalizado"},
          {"id": "d", "label": "Não, consigo identificar sozinho(a)"}
        ]
      },
      {
        "id": 4,
        "question": "Você valoriza produtos alimentares que sejam seguros e adequados para seu organismo?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é essencial para minha saúde"},
          {"id": "b", "label": "Bastante, procuro opções adequadas"},
          {"id": "c", "label": "Moderadamente, mas não priorizo"},
          {"id": "d", "label": "Pouco, não me preocupo muito"}
        ]
      },
      {
        "id": 5,
        "question": "Você sente que ter um plano alimentar personalizado faria diferença na sua qualidade de vida?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, faria toda diferença e melhoraria muito"},
          {"id": "b", "label": "Sim, acredito que seria muito útil"},
          {"id": "c", "label": "Talvez, se for algo prático e eficaz"},
          {"id": "d", "label": "Não, não vejo necessidade"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%intolerância%' OR LOWER(name) LIKE '%intolerancia%' OR slug LIKE '%intolerancia%');

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
  AND (LOWER(name) LIKE '%intolerância%' OR LOWER(name) LIKE '%intolerancia%' OR slug LIKE '%intolerancia%');

