-- ============================================
-- ATUALIZAR CONTENT DA CALCULADORA DE HIDRATAÇÃO (WELLNESS)
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
        "id": "altura",
        "label": "Altura (cm)",
        "type": "number",
        "required": true,
        "placeholder": "Ex: 175",
        "min": 100,
        "max": 250,
        "trigger": "Precisão científica"
      },
      {
        "id": "atividade",
        "label": "Nível de atividade física",
        "type": "radio",
        "required": true,
        "options": [
          {"value": "sedentario", "label": "Sedentário - Pouco ou nenhum exercício"},
          {"value": "leve", "label": "Leve - Exercício leve 1-3 dias/semana"},
          {"value": "moderado", "label": "Moderado - Exercício moderado 3-5 dias/semana"},
          {"value": "intenso", "label": "Intenso - Exercício intenso 6-7 dias/semana"}
        ],
        "trigger": "Personalização"
      },
      {
        "id": "clima",
        "label": "Condições climáticas (opcional)",
        "type": "radio",
        "required": false,
        "options": [
          {"value": "frio", "label": "❄️ Clima frio/temperado"},
          {"value": "quente", "label": "☀️ Clima quente/seco"},
          {"value": "altitude", "label": "🏔️ Altitude elevada"},
          {"value": "umido", "label": "🏖️ Clima úmido"}
        ],
        "trigger": "Contextualização"
      }
    ],
    "formula": "baseWater (35ml/kg) + activityAdjustment + climateAdjustment",
    "result_label": "Água Diária Recomendada",
    "unit": "litros/dia",
    "categories": [
      {"min": 0, "max": 1.5, "label": "Baixa Hidratação", "color": "red"},
      {"min": 1.5, "max": 2.5, "label": "Hidratação Moderada", "color": "yellow"},
      {"min": 2.5, "max": 999, "label": "Alta Hidratação", "color": "green"}
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%calculadora%hidratação%' OR LOWER(name) LIKE '%calculadora%hidratacao%' OR LOWER(name) LIKE '%calculadora%água%' OR LOWER(name) LIKE '%calculadora%agua%' OR LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR slug LIKE '%hidratacao%' OR slug LIKE '%hidratação%' OR slug LIKE '%agua%' OR slug LIKE '%água%' OR slug LIKE '%calculadora-hidratacao%');

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
  AND (LOWER(name) LIKE '%calculadora%hidratação%' OR LOWER(name) LIKE '%calculadora%hidratacao%' OR LOWER(name) LIKE '%calculadora%água%' OR LOWER(name) LIKE '%calculadora%agua%' OR LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR slug LIKE '%hidratacao%' OR slug LIKE '%hidratação%' OR slug LIKE '%agua%' OR slug LIKE '%água%' OR slug LIKE '%calculadora-hidratacao%');


