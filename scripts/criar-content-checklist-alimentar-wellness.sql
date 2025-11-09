-- ============================================
-- ATUALIZAR CONTENT DO CHECKLIST ALIMENTAR (WELLNESS)
-- Adiciona perguntas completas ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "checklist",
    "items": [
      {
        "id": 1,
        "question": "Quantas refeições você faz por dia?",
        "type": "multiple_choice",
        "emoji": "🥗",
        "options": [
          {"id": "a", "label": "5-6 refeições pequenas"},
          {"id": "b", "label": "3-4 refeições principais"},
          {"id": "c", "label": "1-2 refeições por dia"}
        ],
        "trigger": "Consciência alimentar"
      },
      {
        "id": 2,
        "question": "Quantos vegetais você consome por dia?",
        "type": "multiple_choice",
        "emoji": "🥕",
        "options": [
          {"id": "a", "label": "5+ porções de vegetais"},
          {"id": "b", "label": "3-4 porções de vegetais"},
          {"id": "c", "label": "Menos de 3 porções de vegetais"}
        ],
        "trigger": "Consciência nutricional"
      },
      {
        "id": 3,
        "question": "Quantas frutas você consome por dia?",
        "type": "multiple_choice",
        "emoji": "🍎",
        "options": [
          {"id": "a", "label": "3+ porções de frutas"},
          {"id": "b", "label": "1-2 porções de frutas"},
          {"id": "c", "label": "Raramente como frutas"}
        ],
        "trigger": "Consciência de micronutrientes"
      },
      {
        "id": 4,
        "question": "Com que frequência você come alimentos processados?",
        "type": "multiple_choice",
        "emoji": "🍔",
        "options": [
          {"id": "a", "label": "Raramente como processados"},
          {"id": "b", "label": "Às vezes como processados"},
          {"id": "c", "label": "Frequentemente como processados"}
        ],
        "trigger": "Consciência de qualidade"
      },
      {
        "id": 5,
        "question": "Como está sua hidratação?",
        "type": "multiple_choice",
        "emoji": "💧",
        "options": [
          {"id": "a", "label": "Bebo 2-3L de água por dia"},
          {"id": "b", "label": "Bebo 1-2L de água por dia"},
          {"id": "c", "label": "Bebo menos de 1L de água por dia"}
        ],
        "trigger": "Consciência hidratacional"
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'checklist'
  AND (LOWER(name) LIKE '%checklist%alimentar%' OR LOWER(name) LIKE '%checklist alimentar%' OR LOWER(name) LIKE '%checklist%alimentar%' OR slug LIKE '%checklist-alimentar%' OR slug LIKE '%checklist-alimentar%');

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
  AND (LOWER(name) LIKE '%checklist%alimentar%' OR LOWER(name) LIKE '%checklist alimentar%' OR LOWER(name) LIKE '%checklist%alimentar%' OR slug LIKE '%checklist-alimentar%' OR slug LIKE '%checklist-alimentar%');

