-- ============================================
-- ATUALIZAR CONTENT DO GUIA NUTRACÊUTICO (WELLNESS)
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
        "title": "O que são Nutracêuticos",
        "content": "Definição e benefícios dos nutracêuticos para saúde e bem-estar",
        "items": [
          "Definição de nutracêuticos e diferença de suplementos",
          "Benefícios para saúde e prevenção",
          "Como nutracêuticos podem otimizar sua saúde",
          "Integração com alimentação saudável"
        ]
      },
      {
        "id": 2,
        "title": "Tipos de Nutracêuticos",
        "content": "Vitaminas, minerais, probióticos e outros nutracêuticos essenciais",
        "items": [
          "Vitaminas essenciais (A, C, D, E, complexo B)",
          "Minerais importantes (ferro, cálcio, magnésio, zinco)",
          "Probióticos e prebióticos",
          "Antioxidantes e fitonutrientes"
        ]
      },
      {
        "id": 3,
        "title": "Quando Usar",
        "content": "Indicações e contraindicações para uso de nutracêuticos",
        "items": [
          "Quando suplementação é necessária",
          "Sinais de deficiências nutricionais",
          "Contraindicações e precauções",
          "Interações com medicamentos"
        ]
      },
      {
        "id": 4,
        "title": "Como Escolher",
        "content": "Critérios de qualidade para seleção de nutracêuticos",
        "items": [
          "Critérios de qualidade e pureza",
          "Biodisponibilidade e absorção",
          "Marcas confiáveis e certificações",
          "Como ler rótulos e ingredientes"
        ]
      },
      {
        "id": 5,
        "title": "Dosagem e Segurança",
        "content": "Orientações importantes sobre dosagem e uso seguro",
        "items": [
          "Dosagens recomendadas por idade e necessidade",
          "Como tomar para melhor absorção",
          "Sinais de excesso ou toxicidade",
          "Importância do acompanhamento profissional"
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%guia%nutracêutico%' OR LOWER(name) LIKE '%guia%nutraceutico%' OR LOWER(name) LIKE '%guia nutracêutico%' OR LOWER(name) LIKE '%guia nutraceutico%' OR slug LIKE '%guia-nutraceutico%' OR slug LIKE '%guia-nutracêutico%');

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
  AND (LOWER(name) LIKE '%guia%nutracêutico%' OR LOWER(name) LIKE '%guia%nutraceutico%' OR LOWER(name) LIKE '%guia nutracêutico%' OR LOWER(name) LIKE '%guia nutraceutico%' OR slug LIKE '%guia-nutraceutico%' OR slug LIKE '%guia-nutracêutico%');


