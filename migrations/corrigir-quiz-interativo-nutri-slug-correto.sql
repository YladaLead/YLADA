-- =====================================================
-- CORRIGIR QUIZ INTERATIVO - ÁREA NUTRI (SLUG CORRETO)
-- Slug correto: quiz-interativo-nutri
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
    '"(A) Quase nunca Não pratico"'::jsonb
  ),
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-interativo-nutri';

-- Verificar resultado
SELECT 
  '✅ VERIFICAÇÃO FINAL' as tipo_info,
  name,
  slug,
  content->'questions'->2->>'question' as questao_3_corrigida,
  content->'questions'->2->'options'->0->>'label' as opcao_3a,
  content->'questions'->2->'options'->1->>'label' as opcao_3b,
  content->'questions'->2->'options'->2->>'label' as opcao_3c,
  content->'questions'->4->'options'->0->>'label' as questao_5_corrigida,
  '✅ Content corrigido' as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-interativo-nutri';

