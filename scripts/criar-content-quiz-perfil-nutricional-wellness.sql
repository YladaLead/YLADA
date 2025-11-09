-- ============================================
-- CRIAR CONTENT COMPLETO PARA QUIZ PERFIL NUTRICIONAL (WELLNESS)
-- Adiciona array completo de perguntas ao content JSONB
-- ============================================

-- ⚠️ IMPORTANTE:
-- Este script atualiza o content do Quiz Perfil Nutricional com perguntas completas
-- Baseado no preview customizado existente

-- ============================================
-- ATUALIZAR CONTENT DO QUIZ PERFIL NUTRICIONAL
-- ============================================
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "profession": "wellness",
    "questions": [
      {
        "id": 1,
        "question": "Você costuma sentir desconforto digestivo após refeições?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ]
      },
      {
        "id": 2,
        "question": "Consome alimentos probióticos ou fermentados regularmente?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ]
      },
      {
        "id": 3,
        "question": "Nota que absorve bem os nutrientes (sem sintomas de deficiência)?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ]
      },
      {
        "id": 4,
        "question": "Costuma combinar alimentos estrategicamente (ex: ferro + vitamina C)?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ]
      },
      {
        "id": 5,
        "question": "Faz uso de suplementos vitamínicos ou minerais?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    slug = 'quiz-perfil-nutricional' OR
    LOWER(name) LIKE '%quiz perfil nutricional%' OR
    LOWER(name) LIKE '%perfil nutricional%'
  );

-- ============================================
-- VERIFICAR RESULTADO
-- ============================================
SELECT 
  name, 
  slug, 
  type, 
  content->>'template_type' as template_type,
  jsonb_array_length(content->'questions') as total_perguntas,
  CASE 
    WHEN content::text LIKE '%"questions"%' AND content::text LIKE '%"question":%' THEN '✅ Content completo com perguntas'
    WHEN content::text LIKE '%"questions"%' THEN '⚠️ Content tem questions mas sem array'
    WHEN content IS NULL OR content::text = '{}' THEN '❌ Sem content'
    ELSE '⚠️ Content desconhecido'
  END as status_content
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    slug = 'quiz-perfil-nutricional' OR
    LOWER(name) LIKE '%quiz perfil nutricional%' OR
    LOWER(name) LIKE '%perfil nutricional%'
  );

