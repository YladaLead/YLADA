-- ============================================
-- ATUALIZAR CONTENT DO QUIZ GANHOS E PROSPERIDADE (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente que seu estilo de vida atual permite ganhar mais e prosperar financeiramente?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Não, sinto que preciso de novas oportunidades para prosperar"},
          {"id": "b", "label": "Parcialmente, mas vejo potencial para ganhar muito mais"},
          {"id": "c", "label": "Bastante, mas sempre há espaço para crescimento"},
          {"id": "d", "label": "Sim, estou muito satisfeito com minha situação financeira"}
        ]
      },
      {
        "id": 2,
        "question": "Você está aberto(a) para conhecer oportunidades que podem melhorar sua situação financeira?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, estou muito aberto(a) para novas oportunidades!"},
          {"id": "b", "label": "Sim, gostaria de conhecer opções que podem me ajudar"},
          {"id": "c", "label": "Talvez, se for algo que realmente faça sentido"},
          {"id": "d", "label": "Não, prefiro manter minha situação atual"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza ter liberdade financeira e tempo para dedicar às coisas que realmente importam?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é um dos meus maiores objetivos"},
          {"id": "b", "label": "Bastante, gostaria de ter mais liberdade"},
          {"id": "c", "label": "Moderadamente, seria interessante"},
          {"id": "d", "label": "Pouco, não é uma prioridade para mim"}
        ]
      },
      {
        "id": 4,
        "question": "Você acredita que pode criar uma renda adicional trabalhando com algo que também melhora a vida das pessoas?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, acredito muito nessa possibilidade!"},
          {"id": "b", "label": "Sim, gostaria de conhecer como isso funciona"},
          {"id": "c", "label": "Talvez, se for algo confiável e comprovado"},
          {"id": "d", "label": "Não, não acredito nisso"}
        ]
      },
      {
        "id": 5,
        "question": "Você está interessado(a) em conversar com quem te enviou este quiz sobre oportunidades de crescimento?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, estou muito interessado(a) em saber mais!"},
          {"id": "b", "label": "Sim, gostaria de entender melhor as oportunidades"},
          {"id": "c", "label": "Talvez, se for algo que realmente possa me ajudar"},
          {"id": "d", "label": "Não, não tenho interesse no momento"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%ganhos%prosperidade%' OR LOWER(name) LIKE '%ganhos e prosperidade%' OR LOWER(name) LIKE '%ganhos%prosperidade%' OR slug LIKE '%ganhos-prosperidade%' OR slug LIKE '%ganhos-prosperidade%');

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
  AND (LOWER(name) LIKE '%ganhos%prosperidade%' OR LOWER(name) LIKE '%ganhos e prosperidade%' OR LOWER(name) LIKE '%ganhos%prosperidade%' OR slug LIKE '%ganhos-prosperidade%' OR slug LIKE '%ganhos-prosperidade%');


