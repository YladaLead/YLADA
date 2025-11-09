-- ============================================
-- ATUALIZAR CONTENT DA TABELA COMPARATIVA (WELLNESS)
-- Adiciona estrutura completa ao content JSONB
-- ============================================

UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "spreadsheet",
    "profession": "wellness",
    "sections": [
      {
        "id": 1,
        "title": "Comparação de Alimentos",
        "content": "Valor nutricional comparativo entre diferentes alimentos",
        "items": [
          "Tabela de calorias por porção",
          "Comparação de macronutrientes",
          "Densidade nutricional"
        ]
      },
      {
        "id": 2,
        "title": "Fontes de Proteína",
        "content": "Comparação entre diferentes fontes de proteína",
        "items": [
          "Proteínas animais vs vegetais",
          "Quantidade de proteína por 100g",
          "Aminoácidos essenciais"
        ]
      },
      {
        "id": 3,
        "title": "Fontes de Carboidratos",
        "content": "Comparação entre diferentes fontes de carboidratos",
        "items": [
          "Carboidratos simples vs complexos",
          "Índice glicêmico",
          "Fibras e nutrientes"
        ]
      },
      {
        "id": 4,
        "title": "Fontes de Gorduras",
        "content": "Comparação entre diferentes fontes de gorduras",
        "items": [
          "Gorduras saturadas vs insaturadas",
          "Ômega-3 e ômega-6",
          "Benefícios para saúde"
        ]
      },
      {
        "id": 5,
        "title": "Densidade Nutricional",
        "content": "Alimentos mais nutritivos por caloria",
        "items": [
          "Superalimentos",
          "Alimentos ricos em vitaminas",
          "Alimentos ricos em minerais"
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%tabela comparativa%' OR LOWER(name) LIKE '%tabela-comparativa%' OR slug LIKE '%tabela-comparativa%');

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
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%tabela comparativa%' OR LOWER(name) LIKE '%tabela-comparativa%' OR slug LIKE '%tabela-comparativa%');


