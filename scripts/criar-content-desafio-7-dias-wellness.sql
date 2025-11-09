-- ============================================
-- CRIAR/ATUALIZAR CONTENT DO DESAFIO 7 DIAS (WELLNESS)
-- Adiciona estrutura completa ao content JSONB
-- Usa INSERT ... ON CONFLICT para criar se não existir ou atualizar se existir
-- ============================================

INSERT INTO templates_nutrition (
  name,
  type,
  language,
  profession,
  title,
  description,
  content,
  is_active,
  slug,
  created_at,
  updated_at
)
VALUES (
  'Desafio 7 Dias',
  'quiz',
  'pt',
  'wellness',
  'Desafio 7 Dias',
  'Um desafio de 7 dias para transformar seus hábitos e ver resultados rápidos.',
  '{
    "template_type": "quiz",
    "profession": "wellness",
    "questions": [
      {
        "id": 1,
        "question": "Você precisa de resultados rápidos e visíveis?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Sim, preciso ver resultados logo"},
          {"id": "op2", "label": "Quero resultados mas posso esperar"},
          {"id": "op3", "label": "Prefiro resultados consistentes e duradouros"},
          {"id": "op4", "label": "Resultados rápidos me motivam mais"},
          {"id": "op5", "label": "Preciso ver progresso logo para manter motivação"}
        ]
      },
      {
        "id": 2,
        "question": "Quanto tempo você tem disponível para focar no seu bem-estar?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Muito pouco tempo, preciso de algo rápido"},
          {"id": "op2", "label": "Tenho alguns minutos por dia"},
          {"id": "op3", "label": "Tenho tempo moderado para dedicar"},
          {"id": "op4", "label": "Tenho bastante tempo disponível"},
          {"id": "op5", "label": "Posso dedicar o tempo necessário"}
        ]
      },
      {
        "id": 3,
        "question": "O que você mais espera conseguir em 7 dias?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Ver resultados visíveis rápidos"},
          {"id": "op2", "label": "Criar hábitos básicos"},
          {"id": "op3", "label": "Sentir mais energia e disposição"},
          {"id": "op4", "label": "Começar uma transformação"},
          {"id": "op5", "label": "Ganhar motivação e confiança"}
        ]
      },
      {
        "id": 4,
        "question": "Você prefere um desafio intenso ou progressivo?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Intenso, quero desafio completo"},
          {"id": "op2", "label": "Progressivo, prefiro começar devagar"},
          {"id": "op3", "label": "Moderado, algo equilibrado"},
          {"id": "op4", "label": "Depende do suporte que tiver"},
          {"id": "op5", "label": "Quero o que der mais resultados"}
        ]
      },
      {
        "id": 5,
        "question": "O que mais te motivaria a completar um desafio de 7 dias?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Ver resultados rápidos"},
          {"id": "op2", "label": "Ter acompanhamento diário"},
          {"id": "op3", "label": "Ter um plano claro e estruturado"},
          {"id": "op4", "label": "Sentir que estou progredindo"},
          {"id": "op5", "label": "Saber que tem suporte profissional"}
        ]
      }
    ]
  }'::jsonb,
  true,
  'desafio-7-dias',
  NOW(),
  NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Verificar o content atualizado
SELECT 
  name, 
  slug, 
  type, 
  profession,
  content->>'template_type' as template_type,
  jsonb_array_length(content->'questions') as total_perguntas,
  CASE 
    WHEN content IS NULL THEN '❌ Content vazio'
    WHEN content->>'template_type' IS NULL THEN '⚠️ Content sem template_type'
    WHEN jsonb_array_length(content->'questions') = 0 THEN '⚠️ Content sem perguntas'
    ELSE '✅ Content completo'
  END as status_content
FROM templates_nutrition
WHERE slug = 'desafio-7-dias'
  AND profession = 'wellness'
  AND language = 'pt';


