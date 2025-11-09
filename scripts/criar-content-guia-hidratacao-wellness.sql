-- ============================================
-- ATUALIZAR CONTENT DO GUIA DE HIDRATAÇÃO (WELLNESS)
-- Adiciona conteúdo completo ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "guide",
    "sections": [
      {
        "id": 1,
        "title": "Por que Hidratação é Fundamental?",
        "emoji": "💧",
        "description": "Entenda como a hidratação adequada impacta energia, metabolismo e saúde geral.",
        "color": "blue"
      },
      {
        "id": 2,
        "title": "Quanta Água Você Precisa?",
        "emoji": "📊",
        "description": "Aprenda a calcular sua necessidade hídrica diária baseada no seu perfil.",
        "color": "cyan"
      },
      {
        "id": 3,
        "title": "Sinais de Desidratação",
        "emoji": "⚠️",
        "description": "Identifique os sinais de que seu corpo precisa de mais hidratação.",
        "color": "sky"
      },
      {
        "id": 4,
        "title": "Estratégias de Hidratação",
        "emoji": "🎯",
        "description": "Como manter-se hidratado ao longo do dia de forma eficiente.",
        "color": "blue"
      },
      {
        "id": 5,
        "title": "Hidratação e Performance",
        "emoji": "⚡",
        "description": "Como otimizar hidratação para atletas e pessoas ativas.",
        "color": "cyan"
      }
    ],
    "form": {
      "fields": [
        {
          "id": "peso",
          "label": "Seu peso (kg)",
          "type": "number",
          "required": true,
          "placeholder": "Ex: 70"
        },
        {
          "id": "atividade",
          "label": "Nível de atividade física",
          "type": "select",
          "required": true,
          "options": [
            {"value": "sedentario", "label": "Sedentário - Pouco ou nenhum exercício"},
            {"value": "leve", "label": "Leve - Exercício leve 1-3x por semana"},
            {"value": "moderada", "label": "Moderada - Exercício moderado 3-5x por semana"},
            {"value": "intensa", "label": "Intensa - Exercício intenso 5-7x por semana"}
          ]
        },
        {
          "id": "clima",
          "label": "Clima onde você vive/trabalha",
          "type": "select",
          "required": true,
          "options": [
            {"value": "temperado", "label": "Temperado - Clima ameno"},
            {"value": "quente", "label": "Quente - Calor moderado"},
            {"value": "muito-quente", "label": "Muito Quente - Calor intenso"}
          ]
        },
        {
          "id": "aguaAtual",
          "label": "Quanto de água você bebe atualmente? (litros/dia)",
          "type": "number",
          "required": true,
          "placeholder": "Ex: 1.5",
          "help": "Não precisa ser exato, apenas uma estimativa"
        },
        {
          "id": "sintomas",
          "label": "Você já sentiu algum destes sintomas? (opcional)",
          "type": "multiselect",
          "required": false,
          "options": [
            "Sede frequente",
            "Boca seca",
            "Urina escura",
            "Cansaço",
            "Dor de cabeça",
            "Pele seca"
          ]
        }
      ]
    }
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (LOWER(name) LIKE '%guia%hidratação%' OR LOWER(name) LIKE '%guia%hidratacao%' OR LOWER(name) LIKE '%guia hidratação%' OR LOWER(name) LIKE '%guia hidratacao%' OR slug LIKE '%guia-hidratacao%' OR slug LIKE '%guia-hidratacao%');

-- Verificar o content atualizado
SELECT 
  name, 
  slug, 
  type, 
  content->>'template_type' as template_type,
  jsonb_array_length(content->'sections') as total_secoes,
  content
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (LOWER(name) LIKE '%guia%hidratação%' OR LOWER(name) LIKE '%guia%hidratacao%' OR LOWER(name) LIKE '%guia hidratação%' OR LOWER(name) LIKE '%guia hidratacao%' OR slug LIKE '%guia-hidratacao%' OR slug LIKE '%guia-hidratacao%');


