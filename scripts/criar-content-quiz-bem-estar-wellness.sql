-- ============================================
-- CRIAR CONTENT COMPLETO PARA QUIZ BEM-ESTAR WELLNESS
-- Adiciona array completo de perguntas ao content JSONB
-- ============================================

-- ⚠️ IMPORTANTE:
-- Este script atualiza o content do Quiz Bem-Estar com perguntas completas
-- Baseado no preview customizado existente

-- ============================================
-- ATUALIZAR CONTENT DO QUIZ BEM-ESTAR
-- ============================================
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "profession": "wellness",
    "questions": [
      {
        "id": 1,
        "question": "Você costuma priorizar o que come, mesmo com o dia corrido?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "as_vezes", "label": "Às vezes"},
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "sempre", "label": "Sempre"}
        ]
      },
      {
        "id": 2,
        "question": "Dorme bem e acorda com disposição?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "as_vezes", "label": "Às vezes"},
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "sempre", "label": "Sempre"}
        ]
      },
      {
        "id": 3,
        "question": "Pratica algum tipo de atividade física regularmente?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "as_vezes", "label": "Às vezes"},
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "sempre", "label": "Sempre"}
        ]
      },
      {
        "id": 4,
        "question": "Cuida mais da aparência física do que da saúde interna?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "as_vezes", "label": "Às vezes"},
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "sempre", "label": "Sempre"}
        ]
      },
      {
        "id": 5,
        "question": "Faz exames ou consultas de rotina com frequência?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "as_vezes", "label": "Às vezes"},
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "sempre", "label": "Sempre"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    slug = 'quiz-bem-estar' OR
    LOWER(name) LIKE '%quiz bem-estar%' OR
    LOWER(name) LIKE '%bem-estar%' OR
    LOWER(name) LIKE '%bem estar%' OR
    LOWER(name) LIKE '%perfil de bem-estar%'
  );

-- ============================================
-- VERIFICAR RESULTADO
-- ============================================
SELECT 
  name,
  slug,
  type,
  CASE 
    WHEN content::text LIKE '%"questions"%' AND content::text LIKE '%"question":%' THEN '✅ Content completo com perguntas'
    WHEN content::text LIKE '%"questions"%' THEN '⚠️ Content tem questions mas sem array'
    WHEN content IS NULL OR content::text = '{}' THEN '❌ Sem content'
    ELSE '⚠️ Content desconhecido'
  END as status_content,
  jsonb_array_length(content->'questions') as total_perguntas
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    slug = 'quiz-bem-estar' OR
    LOWER(name) LIKE '%quiz bem-estar%' OR
    LOWER(name) LIKE '%bem-estar%' OR
    LOWER(name) LIKE '%bem estar%' OR
    LOWER(name) LIKE '%perfil de bem-estar%'
  );

