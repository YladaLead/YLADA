-- =====================================================
-- CORRIGIR QUIZ INTERATIVO - ÁREA NUTRI
-- Corrige erros de digitação e texto duplicado nas questões
-- =====================================================

-- Corrigir content do Quiz Interativo na área Nutri
UPDATE templates_nutrition
SET 
  content = jsonb_set(
    jsonb_set(
      jsonb_set(
        content,
        '{questions,2,question}',
        '"Qual a quantidade de água você costuma beber por dia?"'::jsonb
      ),
      '{questions,2,options}',
      '[
        {"id": "a", "label": "(A) Quase nenhuma"},
        {"id": "b", "label": "(B) Mais ou menos 1 litro"},
        {"id": "c", "label": "(C) Acima de 2 litros"}
      ]'::jsonb
    ),
    '{questions,4,options,0,label}',
    '"(A) Quase nunca"'::jsonb
  ),
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND (
    slug = 'quiz-interativo' OR
    LOWER(name) LIKE '%quiz interativo%' OR
    LOWER(name) LIKE '%interativo%'
  );

-- Verificar resultado
SELECT 
  name,
  slug,
  content->'questions'->2->>'question' as questao_3_corrigida,
  content->'questions'->4->'options'->0->>'label' as questao_5_corrigida,
  '✅ Content corrigido' as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND (
    slug = 'quiz-interativo' OR
    LOWER(name) LIKE '%quiz interativo%' OR
    LOWER(name) LIKE '%interativo%'
  );

