-- =====================================================
-- AJUSTAR QUESTÃO 5 - QUIZ INTERATIVO NUTRI
-- Manter apenas "Não pratico" (remover "Quase nunca")
-- =====================================================

-- Ajustar opção A da questão 5
UPDATE templates_nutrition
SET 
  content = jsonb_set(
    content,
    '{questions,4,options,0,label}',
    '"(A) Não pratico"'::jsonb
  ),
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-interativo-nutri';

-- Verificar resultado
SELECT 
  '✅ VERIFICAÇÃO' as tipo_info,
  name,
  slug,
  content->'questions'->4->'options'->0->>'label' as questao_5_opcao_a_corrigida,
  '✅ Ajustado para "Não pratico"' as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-interativo-nutri';

