-- ============================================
-- CRIAR/ATUALIZAR CONTENT DO DESAFIO 21 DIAS (WELLNESS)
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
  'Desafio 21 Dias',
  'quiz',
  'pt',
  'wellness',
  'Desafio 21 Dias',
  'Um desafio completo de 21 dias para transformação profunda e duradoura.',
  '{
    "template_type": "quiz",
    "profession": "wellness",
    "questions": [
      {
        "id": 1,
        "question": "Qual é seu principal objetivo nos próximos 21 dias?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Emagrecer e perder gordura"},
          {"id": "op2", "label": "Ganhar mais energia e disposição"},
          {"id": "op3", "label": "Melhorar saúde e bem-estar geral"},
          {"id": "op4", "label": "Criar hábitos saudáveis duradouros"},
          {"id": "op5", "label": "Transformação completa de vida"}
        ]
      },
      {
        "id": 2,
        "question": "O que te impede de alcançar seus objetivos hoje?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Falta de tempo e organização"},
          {"id": "op2", "label": "Falta de conhecimento sobre nutrição"},
          {"id": "op3", "label": "Falta de motivação e disciplina"},
          {"id": "op4", "label": "Não tenho um plano estruturado"},
          {"id": "op5", "label": "Já tentei antes e não consegui"}
        ]
      },
      {
        "id": 3,
        "question": "Você já tentou fazer mudanças sozinho antes?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Nunca tentei de forma séria"},
          {"id": "op2", "label": "Tentei algumas vezes sem sucesso"},
          {"id": "op3", "label": "Tentei e consegui parcialmente"},
          {"id": "op4", "label": "Tentei mas desisti rápido"},
          {"id": "op5", "label": "Sempre faço sozinho mas quero algo melhor"}
        ]
      },
      {
        "id": 4,
        "question": "Quanto tempo por dia você pode dedicar ao seu bem-estar?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Menos de 15 minutos"},
          {"id": "op2", "label": "15-30 minutos"},
          {"id": "op3", "label": "30-60 minutos"},
          {"id": "op4", "label": "1-2 horas"},
          {"id": "op5", "label": "Mais de 2 horas"}
        ]
      },
      {
        "id": 5,
        "question": "O que seria mais importante para você ter sucesso?",
        "type": "multiple_choice",
        "options": [
          {"id": "op1", "label": "Um plano claro e estruturado"},
          {"id": "op2", "label": "Acompanhamento e suporte"},
          {"id": "op3", "label": "Produtos que facilitem o processo"},
          {"id": "op4", "label": "Educação sobre nutrição"},
          {"id": "op5", "label": "Uma comunidade que me motive"}
        ]
      }
    ]
  }'::jsonb,
  true,
  'desafio-21-dias',
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
WHERE slug = 'desafio-21-dias'
  AND profession = 'wellness'
  AND language = 'pt';


