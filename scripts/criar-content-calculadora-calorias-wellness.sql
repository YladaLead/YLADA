-- ============================================
-- ATUALIZAR CONTENT DA CALCULADORA DE CALORIAS (WELLNESS)
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
        "id": "idade",
        "label": "Idade (anos)",
        "type": "number",
        "required": true,
        "placeholder": "Ex: 30",
        "min": 1,
        "max": 120,
        "trigger": "Precisão"
      },
      {
        "id": "sexo",
        "label": "Sexo",
        "type": "select",
        "required": true,
        "options": [
          {"value": "masculino", "label": "Masculino"},
          {"value": "feminino", "label": "Feminino"}
        ],
        "trigger": "Personalização"
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
          {"value": "perder", "label": "Perder peso"},
          {"value": "manter", "label": "Manter peso"},
          {"value": "ganhar", "label": "Ganhar peso/massa"}
        ],
        "trigger": "Personalização"
      }
    ],
    "formula": "TMB (Harris-Benedict ou Mifflin-St Jeor) * Fator de Atividade + Ajuste por Objetivo",
    "result_label": "Calorias Diárias Recomendadas",
    "unit": "kcal/dia",
    "categories": [
      {"min": 0, "max": 1200, "label": "Déficit Calórico", "color": "blue"},
      {"min": 1200, "max": 2500, "label": "Manutenção Calórica", "color": "green"},
      {"min": 2500, "max": 9999, "label": "Superávit Calórico", "color": "orange"}
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%calculadora%caloria%' OR LOWER(name) LIKE '%calculadora%calorias%' OR LOWER(name) LIKE '%caloria%' OR LOWER(name) LIKE '%calorias%' OR slug LIKE '%caloria%' OR slug LIKE '%calorias%' OR slug LIKE '%calculadora-calorias%');

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
  AND (LOWER(name) LIKE '%calculadora%caloria%' OR LOWER(name) LIKE '%calculadora%calorias%' OR LOWER(name) LIKE '%caloria%' OR LOWER(name) LIKE '%calorias%' OR slug LIKE '%caloria%' OR slug LIKE '%calorias%' OR slug LIKE '%calculadora-calorias%');


