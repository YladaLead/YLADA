-- ============================================
-- ATUALIZAR CONTENT DO QUIZ TIPO DE FOME (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente que precisa entender melhor seu tipo de fome para controlar melhor sua alimentação?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito entender meu padrão de fome"},
          {"id": "b", "label": "Sim, seria muito útil ter essa informação"},
          {"id": "c", "label": "Talvez, se for algo prático e útil"},
          {"id": "d", "label": "Não, não vejo necessidade"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente que precisa de ajuda para identificar se sua fome é física ou emocional?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito de orientação profissional"},
          {"id": "b", "label": "Sim, seria muito útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for algo prático e personalizado"},
          {"id": "d", "label": "Não, consigo identificar sozinho(a)"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza ter estratégias personalizadas baseadas no seu tipo de fome?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é essencial para controlar minha alimentação"},
          {"id": "b", "label": "Bastante, acredito que faria diferença"},
          {"id": "c", "label": "Moderadamente, se for algo eficaz"},
          {"id": "d", "label": "Pouco, prefiro seguir padrões gerais"}
        ]
      },
      {
        "id": 4,
        "question": "Você acredita que produtos e estratégias específicas para seu tipo de fome podem ajudar?",
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
        "question": "Você está aberto(a) para ter um acompanhamento especializado em controle de fome?",
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
  AND (LOWER(name) LIKE '%tipo%fome%' OR LOWER(name) LIKE '%tipo de fome%' OR slug LIKE '%tipo-fome%' OR slug LIKE '%tipo-fome%');

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
  AND (LOWER(name) LIKE '%tipo%fome%' OR LOWER(name) LIKE '%tipo de fome%' OR slug LIKE '%tipo-fome%' OR slug LIKE '%tipo-fome%');


