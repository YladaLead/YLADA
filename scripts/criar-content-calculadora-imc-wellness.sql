-- ============================================
-- ATUALIZAR CONTENT DA CALCULADORA IMC (WELLNESS)
-- Adiciona campos completos ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "calculator",
    "fields": [
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
        "id": "sexo",
        "label": "Selecione seu sexo",
        "type": "radio",
        "required": true,
        "options": [
          {"value": "masculino", "label": "👨 Masculino"},
          {"value": "feminino", "label": "👩 Feminino"}
        ],
        "trigger": "Personalização"
      },
      {
        "id": "atividade",
        "label": "Nível de atividade física (opcional)",
        "type": "radio",
        "required": false,
        "options": [
          {"value": "sedentario", "label": "Sedentário - Pouco ou nenhum exercício"},
          {"value": "leve", "label": "Leve - Exercício leve 1-3 dias/semana"},
          {"value": "moderado", "label": "Moderado - Exercício moderado 3-5 dias/semana"},
          {"value": "intenso", "label": "Intenso - Exercício intenso 6-7 dias/semana"}
        ],
        "trigger": "Contextualização"
      }
    ],
    "formula": "peso / (altura/100)²",
    "result_label": "IMC",
    "unit": "kg/m²",
    "categories": [
      {"min": 0, "max": 18.5, "label": "Baixo Peso", "color": "blue"},
      {"min": 18.5, "max": 24.9, "label": "Peso Normal", "color": "green"},
      {"min": 25, "max": 29.9, "label": "Sobrepeso", "color": "yellow"},
      {"min": 30, "max": 999, "label": "Obesidade", "color": "red"}
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%calculadora%imc%' OR LOWER(name) LIKE '%calculadora imc%' OR LOWER(name) LIKE '%imc%' OR slug LIKE '%imc%' OR slug LIKE '%calculadora-imc%');

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
  AND (LOWER(name) LIKE '%calculadora%imc%' OR LOWER(name) LIKE '%calculadora imc%' OR LOWER(name) LIKE '%imc%' OR slug LIKE '%imc%' OR slug LIKE '%calculadora-imc%');


