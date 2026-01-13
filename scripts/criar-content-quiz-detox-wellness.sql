-- ============================================
-- CRIAR CONTENT COMPLETO PARA QUIZ DETOX (WELLNESS)
-- Adiciona array completo de perguntas ao content JSONB
-- ============================================

-- ⚠️ IMPORTANTE:
-- Este script atualiza o content do Quiz Detox com perguntas completas
-- Baseado no preview customizado existente

-- ============================================
-- ATUALIZAR CONTENT DO QUIZ DETOX
-- ============================================
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "profession": "wellness",
    "questions": [
      {
        "id": 1,
        "question": "Você se sente cansado mesmo após dormir bem?",
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
        "question": "Tem dificuldade para perder peso mesmo com dieta?",
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
        "question": "Consome alimentos processados com frequência?",
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
        "question": "Nota sinais de inchaço ou retenção de líquidos?",
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
        "question": "Você está frequentemente exposto a produtos químicos (limpeza, cosméticos) ou ambientes poluídos (trânsito, indústria)?",
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
  AND type = 'quiz'  -- ⚠️ IMPORTANTE: Apenas quizzes
  AND (
    slug = 'quiz-detox' OR
    LOWER(name) LIKE '%quiz detox%' OR
    (LOWER(name) LIKE '%detox%' AND LOWER(name) NOT LIKE '%checklist%' AND LOWER(name) NOT LIKE '%cardápio%' AND LOWER(name) NOT LIKE '%cardapio%')
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
  AND type = 'quiz'  -- ⚠️ IMPORTANTE: Apenas quizzes
  AND (
    slug = 'quiz-detox' OR
    LOWER(name) LIKE '%quiz detox%' OR
    (LOWER(name) LIKE '%detox%' AND LOWER(name) NOT LIKE '%checklist%' AND LOWER(name) NOT LIKE '%cardápio%' AND LOWER(name) NOT LIKE '%cardapio%')
  );

