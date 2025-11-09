-- ============================================
-- ATUALIZAR CONTENT DO QUIZ ALIMENTAÇÃO SAUDÁVEL (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente que precisa melhorar seus hábitos alimentares?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito melhorar minha alimentação"},
          {"id": "b", "label": "Sim, gostaria de ter uma alimentação mais saudável"},
          {"id": "c", "label": "Talvez, se for algo prático e eficaz"},
          {"id": "d", "label": "Não, minha alimentação já está boa"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente que precisa de ajuda profissional para criar uma alimentação saudável?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito de orientação especializada"},
          {"id": "b", "label": "Sim, seria muito útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for algo prático e personalizado"},
          {"id": "d", "label": "Não, consigo fazer sozinho(a)"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza ter um plano alimentar personalizado e saudável?",
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
        "question": "Você acredita que produtos de qualidade podem ajudar na sua alimentação saudável?",
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
        "question": "Você está aberto(a) para ter um acompanhamento especializado em alimentação saudável?",
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
  AND (LOWER(name) LIKE '%alimentação saudável%' OR LOWER(name) LIKE '%alimentacao saudavel%' OR LOWER(name) LIKE '%alimentação%saudável%' OR slug LIKE '%alimentacao-saudavel%' OR slug LIKE '%alimentacao-saudavel%');

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
  AND (LOWER(name) LIKE '%alimentação saudável%' OR LOWER(name) LIKE '%alimentacao saudavel%' OR LOWER(name) LIKE '%alimentação%saudável%' OR slug LIKE '%alimentacao-saudavel%' OR slug LIKE '%alimentacao-saudavel%');


