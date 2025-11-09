-- ============================================
-- ATUALIZAR CONTENT DA CALCULADORA DE PROTEÍNA (WELLNESS)
-- Adiciona campos completos ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "calculator",
    "fields": [
      {
        "id": "peso",
        "label": "Peso (kg)",
        "type": "number",
        "required": true,
        "placeholder": "Ex: 70",
        "min": 30,
        "max": 300,
        "step": 0.1,
        "trigger": "Precisão científica"
      },
      {
        "id": "atividade",
        "label": "Nível de atividade física",
        "type": "select",
        "required": true,
        "options": [
          {"value": "sedentario", "label": "Sedentário - Pouco ou nenhum exercício"},
          {"value": "leve", "label": "Leve - Exercício leve 1-3 dias/semana"},
          {"value": "moderado", "label": "Moderado - Exercício moderado 3-5 dias/semana"},
          {"value": "intenso", "label": "Intenso - Exercício intenso 6-7 dias/semana"},
          {"value": "muito-intenso", "label": "Muito Intenso - Exercício muito intenso diário"}
        ],
        "trigger": "Contextualização"
      },
      {
        "id": "objetivo",
        "label": "Objetivo",
        "type": "select",
        "required": true,
        "options": [
          {"value": "manter", "label": "Manter peso"},
          {"value": "perder", "label": "Perder peso"},
          {"value": "ganhar", "label": "Ganhar massa muscular"}
        ],
        "trigger": "Personalização"
      },
      {
        "id": "idade",
        "label": "Idade (anos)",
        "type": "number",
        "required": false,
        "placeholder": "Ex: 30",
        "min": 1,
        "max": 120,
        "trigger": "Precisão"
      }
    ],
    "formula": "peso * proteinPerKg (variável baseado em atividade: sedentário=0.8, leve=1.0, moderado=1.2, intenso=1.6, muito=2.0; ajustado por objetivo)",
    "result_label": "Proteína Diária Recomendada",
    "unit": "gramas/dia",
    "categories": [
      {"min": 0, "max": 50, "label": "Baixa", "color": "red"},
      {"min": 50, "max": 100, "label": "Moderada", "color": "yellow"},
      {"min": 100, "max": 150, "label": "Adequada", "color": "green"},
      {"min": 150, "max": 999, "label": "Alta", "color": "blue"}
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%calculadora%proteína%' OR LOWER(name) LIKE '%calculadora%proteina%' OR LOWER(name) LIKE '%calculadora proteína%' OR LOWER(name) LIKE '%calculadora proteina%' OR slug LIKE '%proteina%' OR slug LIKE '%proteína%' OR slug LIKE '%calculadora-proteina%');

-- Verificar o content atualizado
SELECT 
  name, 
  slug, 
  type, 
  content->>'template_type' as template_type,
  jsonb_array_length(content->'fields') as total_campos,
  content
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%calculadora%proteína%' OR LOWER(name) LIKE '%calculadora%proteina%' OR LOWER(name) LIKE '%calculadora proteína%' OR LOWER(name) LIKE '%calculadora proteina%' OR slug LIKE '%proteina%' OR slug LIKE '%proteína%' OR slug LIKE '%calculadora-proteina%');


