-- ============================================
-- ATUALIZAR CONTENT DO QUIZ PERFIL METABÓLICO (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Como você descreveria seu metabolismo?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito lento, ganho peso facilmente"},
          {"id": "b", "label": "Lento, tenho dificuldade para perder peso"},
          {"id": "c", "label": "Moderado, equilibrado"},
          {"id": "d", "label": "Rápido, queimo calorias facilmente"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente que precisa de ajuda para otimizar seu metabolismo?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, preciso muito de orientação profissional"},
          {"id": "b", "label": "Sim, seria útil ter um acompanhamento"},
          {"id": "c", "label": "Talvez, se for algo prático e personalizado"},
          {"id": "d", "label": "Não, consigo otimizar sozinho(a)"}
        ]
      },
      {
        "id": 3,
        "question": "Você valoriza ter um plano personalizado baseado no seu perfil metabólico?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Muito, é essencial para resultados eficazes"},
          {"id": "b", "label": "Bastante, acredito que faria diferença"},
          {"id": "c", "label": "Moderadamente, se for algo prático"},
          {"id": "d", "label": "Pouco, prefiro seguir padrões gerais"}
        ]
      },
      {
        "id": 4,
        "question": "Você sente que produtos específicos para seu metabolismo ajudariam seus resultados?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, faria toda diferença e aceleraria resultados"},
          {"id": "b", "label": "Sim, acredito que seria muito útil"},
          {"id": "c", "label": "Talvez, se for algo comprovado e eficaz"},
          {"id": "d", "label": "Não, não vejo necessidade"}
        ]
      },
      {
        "id": 5,
        "question": "Você acredita que um acompanhamento especializado pode transformar seu metabolismo?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, absolutamente! Estou pronto(a) para mudanças"},
          {"id": "b", "label": "Sim, acredito que pode fazer diferença"},
          {"id": "c", "label": "Talvez, se for algo estruturado e eficaz"},
          {"id": "d", "label": "Não, acho que não é necessário"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%perfil metabólico%' OR LOWER(name) LIKE '%perfil metabolico%' OR LOWER(name) LIKE '%metabólico%' OR LOWER(name) LIKE '%metabolico%' OR slug LIKE '%perfil-metabolico%' OR slug LIKE '%metabolico%');

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
  AND (LOWER(name) LIKE '%perfil metabólico%' OR LOWER(name) LIKE '%perfil metabolico%' OR LOWER(name) LIKE '%metabólico%' OR LOWER(name) LIKE '%metabolico%' OR slug LIKE '%perfil-metabolico%' OR slug LIKE '%metabolico%');

