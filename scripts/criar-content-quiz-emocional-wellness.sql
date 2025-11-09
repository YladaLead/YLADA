-- ============================================
-- CRIAR CONTENT COMPLETO PARA QUIZ EMOCIONAL (WELLNESS)
-- Adiciona array completo de perguntas ao content JSONB
-- ============================================

-- ⚠️ IMPORTANTE:
-- Este script atualiza o content do Quiz Emocional com perguntas completas
-- Baseado no preview customizado existente

-- ============================================
-- ATUALIZAR CONTENT DO QUIZ EMOCIONAL
-- ============================================
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "profession": "wellness",
    "questions": [
      {
        "id": 1,
        "question": "Como você se sente em relação à sua autoestima hoje?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Baixa, tenho dificuldades com minha imagem"},
          {"id": "b", "label": "Média, algumas vezes me sinto inseguro(a)"},
          {"id": "c", "label": "Boa, geralmente me sinto bem comigo mesmo(a)"},
          {"id": "d", "label": "Excelente, me sinto muito confiante"}
        ]
      },
      {
        "id": 2,
        "question": "Quanto você se sente motivado(a) para cuidar da sua saúde e bem-estar?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Pouco motivado(a), tenho dificuldades para começar"},
          {"id": "b", "label": "Moderadamente, mas preciso de incentivo"},
          {"id": "c", "label": "Muito motivado(a), já tenho alguns hábitos"},
          {"id": "d", "label": "Extremamente motivado(a), estou sempre buscando melhorar"}
        ]
      },
      {
        "id": 3,
        "question": "Como você lida com os desafios e obstáculos da vida?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Tenho dificuldades, me sinto sobrecarregado(a)"},
          {"id": "b", "label": "Às vezes consigo, mas preciso de suporte"},
          {"id": "c", "label": "Consigo lidar bem na maioria das vezes"},
          {"id": "d", "label": "Lido muito bem, vejo desafios como oportunidades"}
        ]
      },
      {
        "id": 4,
        "question": "Você sente que tem o suporte necessário para alcançar seus objetivos de bem-estar?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Não, sinto que estou sozinho(a) nessa jornada"},
          {"id": "b", "label": "Parcialmente, mas preciso de mais orientação"},
          {"id": "c", "label": "Sim, tenho algum suporte, mas poderia ser melhor"},
          {"id": "d", "label": "Sim, tenho um excelente suporte e acompanhamento"}
        ]
      },
      {
        "id": 5,
        "question": "O quanto você valoriza ter um acompanhamento personalizado para sua transformação?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Não valorizo muito, prefiro fazer sozinho(a)"},
          {"id": "b", "label": "Valorizo um pouco, mas não é essencial"},
          {"id": "c", "label": "Valorizo bastante, faria toda diferença"},
          {"id": "d", "label": "Valorizo muito, é essencial para meu sucesso"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (
    slug = 'quiz-emocional' OR
    slug = 'avaliacao-emocional' OR
    slug = 'avaliação-emocional' OR
    LOWER(name) LIKE '%quiz emocional%' OR
    LOWER(name) LIKE '%avaliação emocional%' OR
    LOWER(name) LIKE '%avaliacao emocional%' OR
    LOWER(name) LIKE '%avaliação de forma emocional%' OR
    LOWER(name) LIKE '%forma emocional%' OR
    (LOWER(name) LIKE '%avaliação%' AND LOWER(name) LIKE '%emocional%')
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
  AND type = 'quiz'
  AND (
    slug = 'quiz-emocional' OR
    slug = 'avaliacao-emocional' OR
    slug = 'avaliação-emocional' OR
    LOWER(name) LIKE '%quiz emocional%' OR
    LOWER(name) LIKE '%avaliação emocional%' OR
    LOWER(name) LIKE '%avaliacao emocional%' OR
    LOWER(name) LIKE '%avaliação de forma emocional%' OR
    LOWER(name) LIKE '%forma emocional%' OR
    (LOWER(name) LIKE '%avaliação%' AND LOWER(name) LIKE '%emocional%')
  );

