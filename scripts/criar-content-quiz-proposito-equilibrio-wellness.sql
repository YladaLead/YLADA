-- ============================================
-- ATUALIZAR CONTENT DO QUIZ PROPÓSITO E EQUILÍBRIO (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente que seu dia a dia está alinhado com seus sonhos e propósito de vida?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Não, sinto que estou muito distante dos meus sonhos"},
          {"id": "b", "label": "Parcialmente, mas gostaria de estar mais alinhado"},
          {"id": "c", "label": "Bastante, mas sempre posso melhorar o equilíbrio"},
          {"id": "d", "label": "Sim, sinto que estou muito alinhado com meu propósito"}
        ]
      },
      {
        "id": 2,
        "question": "Você está aberto(a) para conhecer caminhos que podem te ajudar a viver mais alinhado com seu propósito?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, estou muito interessado(a) em descobrir!"},
          {"id": "b", "label": "Sim, gostaria de conhecer opções que me ajudem"},
          {"id": "c", "label": "Talvez, se for algo que realmente faça sentido"},
          {"id": "d", "label": "Não, prefiro manter como está"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza ter equilíbrio entre vida pessoal, profissional e tempo para o que realmente importa?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é um dos meus maiores objetivos"},
          {"id": "b", "label": "Bastante, gostaria de ter mais equilíbrio"},
          {"id": "c", "label": "Moderadamente, seria interessante"},
          {"id": "d", "label": "Pouco, não é uma prioridade para mim"}
        ]
      },
      {
        "id": 4,
        "question": "Você acredita que pode viver seu propósito trabalhando com algo que também transforma a vida de outras pessoas?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, acredito muito nessa possibilidade!"},
          {"id": "b", "label": "Sim, gostaria de entender como isso funciona"},
          {"id": "c", "label": "Talvez, se for algo genuíno e significativo"},
          {"id": "d", "label": "Não, não acredito nisso"}
        ]
      },
      {
        "id": 5,
        "question": "Você está interessado(a) em conversar com quem te enviou este quiz sobre propósito e equilíbrio?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, estou muito interessado(a) em saber mais!"},
          {"id": "b", "label": "Sim, gostaria de entender melhor as possibilidades"},
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
  AND (LOWER(name) LIKE '%propósito%equilíbrio%' OR LOWER(name) LIKE '%proposito%equilibrio%' OR LOWER(name) LIKE '%propósito e equilíbrio%' OR LOWER(name) LIKE '%proposito e equilibrio%' OR slug LIKE '%proposito-equilibrio%' OR slug LIKE '%proposito-equilibrio%');

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
  AND (LOWER(name) LIKE '%propósito%equilíbrio%' OR LOWER(name) LIKE '%proposito%equilibrio%' OR LOWER(name) LIKE '%propósito e equilíbrio%' OR LOWER(name) LIKE '%proposito e equilibrio%' OR slug LIKE '%proposito-equilibrio%' OR slug LIKE '%proposito-equilibrio%');


