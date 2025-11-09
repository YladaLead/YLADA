-- ============================================
-- ATUALIZAR CONTENT DO CARDÁPIO DETOX (WELLNESS)
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
        "title": "Café da Manhã",
        "content": "Opções de café da manhã detox com alimentos naturais e desintoxicantes",
        "items": [
          "Smoothie verde com espinafre, abacaxi e gengibre",
          "Aveia com frutas vermelhas e sementes",
          "Chá verde com limão e mel"
        ]
      },
      {
        "id": 2,
        "title": "Almoço",
        "content": "Refeições principais leves e nutritivas para desintoxicação",
        "items": [
          "Salada verde com legumes cozidos",
          "Sopa de legumes com ervas",
          "Quinoa com vegetais salteados"
        ]
      },
      {
        "id": 3,
        "title": "Jantar",
        "content": "Jantares leves que facilitam a digestão e desintoxicação",
        "items": [
          "Sopa de legumes",
          "Salada completa com proteína magra",
          "Vegetais grelhados com ervas"
        ]
      },
      {
        "id": 4,
        "title": "Lanches",
        "content": "Lanches saudáveis entre as refeições principais",
        "items": [
          "Frutas frescas",
          "Nozes e sementes",
          "Chá de ervas"
        ]
      },
      {
        "id": 5,
        "title": "Bebidas",
        "content": "Bebidas desintoxicantes e hidratantes",
        "items": [
          "Água com limão",
          "Chá verde",
          "Água de coco natural"
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%cardápio detox%' OR LOWER(name) LIKE '%cardapio detox%' OR slug LIKE '%cardapio-detox%' OR slug LIKE '%cardápio-detox%');

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
  AND (LOWER(name) LIKE '%cardápio detox%' OR LOWER(name) LIKE '%cardapio detox%' OR slug LIKE '%cardapio-detox%' OR slug LIKE '%cardápio-detox%');


