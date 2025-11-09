-- ============================================
-- ATUALIZAR CONTENT DO QUIZ NUTRIDO VS ALIMENTADO (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente que está apenas alimentado ou realmente nutrido?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Apenas alimentado, não sinto que estou nutrido adequadamente"},
          {"id": "b", "label": "Parcialmente nutrido, mas preciso melhorar"},
          {"id": "c", "label": "Bastante nutrido, mas posso otimizar"},
          {"id": "d", "label": "Sim, me sinto muito bem nutrido"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente que precisa de ajuda profissional para entender a diferença entre se alimentar e se nutrir?",
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
        "question": "Você valoriza ter um plano personalizado para garantir nutrição adequada?",
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
        "question": "Você acredita que produtos e estratégias específicas podem ajudar você a estar nutrido e não apenas alimentado?",
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
        "question": "Você está aberto(a) para ter um acompanhamento especializado em nutrição adequada?",
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
  AND (LOWER(name) LIKE '%nutrido%alimentado%' OR LOWER(name) LIKE '%nutrido vs alimentado%' OR LOWER(name) LIKE '%nutrido%vs%alimentado%' OR slug LIKE '%nutrido-vs-alimentado%' OR slug LIKE '%nutrido-alimentado%');

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
  AND (LOWER(name) LIKE '%nutrido%alimentado%' OR LOWER(name) LIKE '%nutrido vs alimentado%' OR LOWER(name) LIKE '%nutrido%vs%alimentado%' OR slug LIKE '%nutrido-vs-alimentado%' OR slug LIKE '%nutrido-alimentado%');


