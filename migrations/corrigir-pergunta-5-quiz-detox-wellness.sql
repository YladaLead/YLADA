-- ============================================
-- CORRIGIR PERGUNTA 5 DO QUIZ DETOX (WELLNESS)
-- Reformular pergunta sobre ambiente poluído para ser mais clara
-- ============================================

-- ⚠️ IMPORTANTE:
-- Este script corrige a pergunta 5 do Quiz Detox que estava confusa
-- Antes: "Faz uso de produtos de limpeza ou vive em ambiente poluído?"
-- Depois: "Você está frequentemente exposto a produtos químicos (limpeza, cosméticos) ou ambientes poluídos (trânsito, indústria)?"

-- ============================================
-- ATUALIZAR PERGUNTA 5 DO QUIZ DETOX
-- ============================================
UPDATE templates_nutrition
SET 
  content = jsonb_set(
    content,
    '{questions,4,question}',
    '"Você está frequentemente exposto a produtos químicos (limpeza, cosméticos) ou ambientes poluídos (trânsito, indústria)?"'::jsonb
  ),
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (
    slug = 'quiz-detox' OR
    LOWER(name) LIKE '%quiz detox%' OR
    (LOWER(name) LIKE '%detox%' AND LOWER(name) NOT LIKE '%checklist%' AND LOWER(name) NOT LIKE '%cardápio%' AND LOWER(name) NOT LIKE '%cardapio%')
  )
  AND content->'questions'->4->>'question' = 'Faz uso de produtos de limpeza ou vive em ambiente poluído?';

-- ============================================
-- VERIFICAR RESULTADO
-- ============================================
SELECT 
  name, 
  slug, 
  content->'questions'->4->>'question' as pergunta_5_atualizada
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (
    slug = 'quiz-detox' OR
    LOWER(name) LIKE '%quiz detox%' OR
    (LOWER(name) LIKE '%detox%' AND LOWER(name) NOT LIKE '%checklist%' AND LOWER(name) NOT LIKE '%cardápio%' AND LOWER(name) NOT LIKE '%cardapio%')
  );
