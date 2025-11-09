-- ============================================
-- ATUALIZAR CONTENT DO QUIZ CONHECE SEU CORPO (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente que conhece bem seu corpo e como ele funciona?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Não, preciso muito entender melhor meu corpo"},
          {"id": "b", "label": "Parcialmente, mas quero conhecer mais"},
          {"id": "c", "label": "Bastante, mas sempre há o que aprender"},
          {"id": "d", "label": "Sim, conheço muito bem meu corpo"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente que precisa de ajuda profissional para entender melhor seu corpo?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito de orientação especializada"},
          {"id": "b", "label": "Sim, seria muito útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for algo prático e personalizado"},
          {"id": "d", "label": "Não, consigo entender sozinho(a)"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza ter um conhecimento profundo sobre seu corpo e saúde?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é essencial para meu bem-estar"},
          {"id": "b", "label": "Bastante, acredito que faria diferença"},
          {"id": "c", "label": "Moderadamente, se for algo útil"},
          {"id": "d", "label": "Pouco, prefiro ir no automático"}
        ]
      },
      {
        "id": 4,
        "question": "Você acredita que produtos e estratégias personalizadas podem ajudar você a conhecer melhor seu corpo?",
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
        "question": "Você está aberto(a) para ter um acompanhamento especializado para conhecer melhor seu corpo?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, é exatamente o que preciso!"},
          {"id": "b", "label": "Sim, seria muito útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for alguém experiente e confiável"},
          {"id": "d", "label": "Não, prefiro descobrir sozinho(a)"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%conhece%corpo%' OR LOWER(name) LIKE '%conhece seu corpo%' OR LOWER(name) LIKE '%você conhece%' OR slug LIKE '%conhece-seu-corpo%' OR slug LIKE '%conhece-corpo%');

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
  AND (LOWER(name) LIKE '%conhece%corpo%' OR LOWER(name) LIKE '%conhece seu corpo%' OR LOWER(name) LIKE '%você conhece%' OR slug LIKE '%conhece-seu-corpo%' OR slug LIKE '%conhece-corpo%');


