-- ============================================
-- ATUALIZAR CONTENT DO QUIZ POTENCIAL E CRESCIMENTO (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente que seu potencial está sendo bem aproveitado atualmente?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Não, sinto que tenho muito mais potencial não explorado"},
          {"id": "b", "label": "Parcialmente, mas vejo muito espaço para crescimento"},
          {"id": "c", "label": "Bastante, mas sempre posso melhorar"},
          {"id": "d", "label": "Sim, sinto que estou aproveitando bem meu potencial"}
        ]
      },
      {
        "id": 2,
        "question": "Você está aberto(a) para conhecer caminhos que podem ajudar você a alcançar seu máximo potencial?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, estou muito interessado(a) em descobrir!"},
          {"id": "b", "label": "Sim, gostaria de conhecer opções de crescimento"},
          {"id": "c", "label": "Talvez, se for algo que realmente me ajude"},
          {"id": "d", "label": "Não, prefiro manter como está"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza ter suporte e mentoria para acelerar seu crescimento pessoal e profissional?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é essencial para meu crescimento"},
          {"id": "b", "label": "Bastante, acredito que faria diferença"},
          {"id": "c", "label": "Moderadamente, pode ser útil"},
          {"id": "d", "label": "Pouco, prefiro fazer sozinho(a)"}
        ]
      },
      {
        "id": 4,
        "question": "Você acredita que pode crescer trabalhando com algo que também ajuda outras pessoas a melhorarem de vida?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, acredito muito nessa possibilidade!"},
          {"id": "b", "label": "Sim, gostaria de entender como isso funciona"},
          {"id": "c", "label": "Talvez, se for algo genuíno e comprovado"},
          {"id": "d", "label": "Não, não acredito nisso"}
        ]
      },
      {
        "id": 5,
        "question": "Você está interessado(a) em conversar com quem te enviou este quiz sobre seu potencial de crescimento?",
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
  AND (LOWER(name) LIKE '%potencial%crescimento%' OR LOWER(name) LIKE '%potencial e crescimento%' OR LOWER(name) LIKE '%potencial%crescimento%' OR slug LIKE '%potencial-crescimento%' OR slug LIKE '%potencial-crescimento%');

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
  AND (LOWER(name) LIKE '%potencial%crescimento%' OR LOWER(name) LIKE '%potencial e crescimento%' OR LOWER(name) LIKE '%potencial%crescimento%' OR slug LIKE '%potencial-crescimento%' OR slug LIKE '%potencial-crescimento%');


