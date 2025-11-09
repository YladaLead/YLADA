-- ============================================
-- ATUALIZAR CONTENT DO QUIZ SÍNDROME METABÓLICA (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você está preocupado(a) com seu risco de desenvolver síndrome metabólica?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, estou muito preocupado(a) com isso"},
          {"id": "b", "label": "Sim, gostaria de entender melhor meu risco"},
          {"id": "c", "label": "Talvez, se for algo que possa me ajudar"},
          {"id": "d", "label": "Não, não me preocupo com isso"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente que precisa de ajuda profissional para prevenir síndrome metabólica?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito de orientação especializada"},
          {"id": "b", "label": "Sim, seria muito útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for algo prático e personalizado"},
          {"id": "d", "label": "Não, consigo prevenir sozinho(a)"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza ter um plano preventivo personalizado para reduzir riscos?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é essencial para minha saúde"},
          {"id": "b", "label": "Bastante, acredito que faria diferença"},
          {"id": "c", "label": "Moderadamente, se for algo eficaz"},
          {"id": "d", "label": "Pouco, prefiro seguir padrões gerais"}
        ]
      },
      {
        "id": 4,
        "question": "Você acredita que produtos e estratégias preventivas podem reduzir seu risco?",
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
        "question": "Você está aberto(a) para ter um acompanhamento especializado em prevenção metabólica?",
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
  AND (LOWER(name) LIKE '%síndrome metabólica%' OR LOWER(name) LIKE '%sindrome metabolica%' OR LOWER(name) LIKE '%síndrome%metabólica%' OR slug LIKE '%sindrome-metabolica%' OR slug LIKE '%sindrome-metabolica%');

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
  AND (LOWER(name) LIKE '%síndrome metabólica%' OR LOWER(name) LIKE '%sindrome metabolica%' OR LOWER(name) LIKE '%síndrome%metabólica%' OR slug LIKE '%sindrome-metabolica%' OR slug LIKE '%sindrome-metabolica%');


