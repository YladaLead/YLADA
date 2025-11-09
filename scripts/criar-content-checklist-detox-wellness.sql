-- ============================================
-- ATUALIZAR CONTENT DO CHECKLIST DETOX (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "checklist",
    "items": [
      {
        "id": 1,
        "question": "Você se sente cansado mesmo após dormir bem?",
        "type": "multiple_choice",
        "emoji": "😴",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ],
        "trigger": "Avaliação de Sinais",
        "alert": "Se você respondeu \"Frequentemente\" ou \"Sempre\", seu corpo pode estar pedindo ajuda para eliminar toxinas."
      },
      {
        "id": 2,
        "question": "Você tem dificuldade para perder peso mesmo com dieta?",
        "type": "multiple_choice",
        "emoji": "⚖️",
        "options": [
          {"id": "a", "label": "Não tenho dificuldade"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre tenho dificuldade"}
        ],
        "trigger": "Metabolismo comprometido",
        "alert": "Se você tem dificuldade para perder peso mesmo com dieta, pode ser que seu organismo esteja sobrecarregado com toxinas."
      },
      {
        "id": 3,
        "question": "Você tem problemas digestivos frequentes (constipação, gases)?",
        "type": "multiple_choice",
        "emoji": "💩",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ],
        "trigger": "Digestão comprometida",
        "alert": "Problemas digestivos frequentes podem estar impedindo seu organismo de eliminar toxinas adequadamente."
      },
      {
        "id": 4,
        "question": "Você nota sinais de inchaço ou retenção de líquidos?",
        "type": "multiple_choice",
        "emoji": "💧",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ],
        "trigger": "Sistema de eliminação",
        "alert": "Inchaço pode indicar que seu corpo está tendo dificuldade para eliminar toxinas e líquidos."
      },
      {
        "id": 5,
        "question": "Você consome alimentos processados ou vive em ambiente poluído?",
        "type": "multiple_choice",
        "emoji": "🏭",
        "options": [
          {"id": "a", "label": "Muito pouco"},
          {"id": "b", "label": "Ocasionalmente"},
          {"id": "c", "label": "Moderadamente"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Muito frequentemente"}
        ],
        "trigger": "Exposição tóxica",
        "alert": "Exposição constante a toxinas pode sobrecarregar seu sistema de eliminação natural."
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'checklist'
  AND (LOWER(name) LIKE '%checklist%detox%' OR LOWER(name) LIKE '%checklist detox%' OR LOWER(name) LIKE '%checklist%detox%' OR slug LIKE '%checklist-detox%' OR slug LIKE '%checklist-detox%');

-- Verificar o content atualizado
SELECT 
  name, 
  slug, 
  type, 
  content->>'template_type' as template_type,
  jsonb_array_length(COALESCE(content->'items', content->'questions')) as total_perguntas,
  content
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'checklist'
  AND (LOWER(name) LIKE '%checklist%detox%' OR LOWER(name) LIKE '%checklist detox%' OR LOWER(name) LIKE '%checklist%detox%' OR slug LIKE '%checklist-detox%' OR slug LIKE '%checklist-detox%');

