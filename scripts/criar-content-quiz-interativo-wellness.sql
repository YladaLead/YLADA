-- ============================================
-- CRIAR CONTENT COMPLETO PARA QUIZ INTERATIVO WELLNESS
-- Adiciona array completo de perguntas ao content JSONB
-- ============================================

-- ⚠️ IMPORTANTE:
-- Este script atualiza o content do Quiz Interativo com perguntas completas
-- Baseado no preview customizado existente

-- ============================================
-- ATUALIZAR CONTENT DO QUIZ INTERATIVO
-- ============================================
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "profession": "wellness",
    "questions": [
      {
        "id": 1,
        "question": "Como é seu nível de energia ao longo do dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "(A) Vivo cansado, mesmo dormindo bem"},
          {"id": "b", "label": "(B) Tenho altos e baixos"},
          {"id": "c", "label": "(C) Energia constante o dia inteiro"}
        ]
      },
      {
        "id": 2,
        "question": "Como costuma ser sua fome?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "(A) Forte, com vontade de comer o tempo todo"},
          {"id": "b", "label": "(B) Varia conforme o dia"},
          {"id": "c", "label": "(C) Como de forma leve, sem exagerar"}
        ]
      },
      {
        "id": 3,
        "question": "Quanta água você costuma beber por dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "(A) Quase nenhuma"},
          {"id": "b", "label": "(B) Mais ou menos 1 litro"},
          {"id": "c", "label": "(C) Sempre carrego minha garrafinha"}
        ]
      },
      {
        "id": 4,
        "question": "Como anda a qualidade do seu sono?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "(A) Péssima, acordo cansado"},
          {"id": "b", "label": "(B) Regular, depende do dia"},
          {"id": "c", "label": "(C) Durmo bem e acordo disposto"}
        ]
      },
      {
        "id": 5,
        "question": "Você pratica atividade física com qual frequência?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "(A) Quase nunca"},
          {"id": "b", "label": "(B) 2 a 3 vezes por semana"},
          {"id": "c", "label": "(C) Quase todos os dias"}
        ]
      },
      {
        "id": 6,
        "question": "Qual dessas opções melhor descreve você?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "(A) Tenho dificuldade em perder peso"},
          {"id": "b", "label": "(B) Mantenho o peso com esforço"},
          {"id": "c", "label": "(C) Emagreço facilmente"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    slug = 'quiz-interativo' OR
    LOWER(name) LIKE '%quiz interativo%' OR
    LOWER(name) LIKE '%interativo%'
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
    slug = 'quiz-interativo' OR
    LOWER(name) LIKE '%quiz interativo%' OR
    LOWER(name) LIKE '%interativo%'
  );

