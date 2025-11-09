-- ============================================
-- ATUALIZAR CONTENT DO GUIA PROTEICO (WELLNESS)
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
        "title": "Importância das Proteínas",
        "content": "Funções das proteínas no organismo e por que são essenciais para saúde e bem-estar",
        "items": [
          "Construção e reparo de tecidos musculares",
          "Produção de enzimas e hormônios",
          "Fortalecimento do sistema imunológico",
          "Manutenção de massa muscular e metabolismo"
        ]
      },
      {
        "id": 2,
        "title": "Fontes de Proteína",
        "content": "Fontes animais e vegetais de proteína para uma alimentação variada e completa",
        "items": [
          "Proteínas animais: carnes, peixes, ovos, laticínios",
          "Proteínas vegetais: leguminosas, quinoa, tofu, tempeh",
          "Proteínas em pó: whey, caseína, proteína vegetal",
          "Como combinar fontes para proteína completa"
        ]
      },
      {
        "id": 3,
        "title": "Necessidades Diárias",
        "content": "Quanto de proteína você precisa por dia baseado no seu perfil",
        "items": [
          "Cálculo de necessidade proteica por peso corporal",
          "Ajustes por nível de atividade física",
          "Necessidades por objetivo (manter, ganhar ou perder peso)",
          "Distribuição ideal ao longo do dia"
        ]
      },
      {
        "id": 4,
        "title": "Distribuição ao Longo do Dia",
        "content": "Como distribuir proteína nas refeições para máxima absorção e benefícios",
        "items": [
          "Proteína em cada refeição principal",
          "Timing para otimização de síntese proteica",
          "Proteína antes e após exercícios",
          "Estratégias práticas para aumentar ingestão"
        ]
      },
      {
        "id": 5,
        "title": "Receitas Proteicas",
        "content": "Ideias práticas e receitas ricas em proteína para facilitar sua rotina",
        "items": [
          "Receitas de café da manhã proteico",
          "Opções de almoço e jantar ricas em proteína",
          "Lanches proteicos práticos",
          "Smoothies e shakes proteicos"
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%guia%proteico%' OR LOWER(name) LIKE '%guia%proteína%' OR LOWER(name) LIKE '%guia proteico%' OR LOWER(name) LIKE '%guia proteína%' OR LOWER(name) LIKE '%guia de proteína%' OR slug LIKE '%guia-proteico%' OR slug LIKE '%guia-proteina%');

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
  AND (LOWER(name) LIKE '%guia%proteico%' OR LOWER(name) LIKE '%guia%proteína%' OR LOWER(name) LIKE '%guia proteico%' OR LOWER(name) LIKE '%guia proteína%' OR LOWER(name) LIKE '%guia de proteína%' OR slug LIKE '%guia-proteico%' OR slug LIKE '%guia-proteina%');


