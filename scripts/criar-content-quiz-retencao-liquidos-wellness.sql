-- ============================================
-- ATUALIZAR CONTENT DO QUIZ RETENÇÃO DE LÍQUIDOS (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente que retém líquidos ou tem inchaço frequente?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, sinto muito inchaço e desconforto"},
          {"id": "b", "label": "Sim, às vezes sinto retenção leve"},
          {"id": "c", "label": "Às vezes, mas não sei se é retenção"},
          {"id": "d", "label": "Não, não tenho esse problema"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente que precisa de ajuda profissional para identificar e tratar retenção de líquidos?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito de orientação especializada"},
          {"id": "b", "label": "Sim, seria muito útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for algo prático e personalizado"},
          {"id": "d", "label": "Não, consigo resolver sozinho(a)"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza ter um plano personalizado para reduzir retenção de líquidos?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é essencial para meu bem-estar"},
          {"id": "b", "label": "Bastante, acredito que faria diferença"},
          {"id": "c", "label": "Moderadamente, se for algo eficaz"},
          {"id": "d", "label": "Pouco, prefiro seguir padrões gerais"}
        ]
      },
      {
        "id": 4,
        "question": "Você acredita que produtos e estratégias específicas podem ajudar na retenção de líquidos?",
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
        "question": "Você está aberto(a) para ter um acompanhamento especializado em redução de retenção de líquidos?",
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
  AND (LOWER(name) LIKE '%retenção%líquido%' OR LOWER(name) LIKE '%retencao%liquido%' OR LOWER(name) LIKE '%retenção%líquidos%' OR slug LIKE '%retencao-liquidos%' OR slug LIKE '%retencao-liquidos%');

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
  AND (LOWER(name) LIKE '%retenção%líquido%' OR LOWER(name) LIKE '%retencao%liquido%' OR LOWER(name) LIKE '%retenção%líquidos%' OR slug LIKE '%retencao-liquidos%' OR slug LIKE '%retencao-liquidos%');


