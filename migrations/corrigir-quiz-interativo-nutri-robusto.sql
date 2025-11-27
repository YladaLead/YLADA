-- =====================================================
-- CORRIGIR QUIZ INTERATIVO - ÁREA NUTRI (VERSÃO ROBUSTA)
-- Corrige erros de digitação e texto duplicado nas questões
-- Esta versão é mais robusta e verifica todos os templates
-- =====================================================

-- 1. PRIMEIRO: Verificar quais templates existem
SELECT 
  '🔍 TEMPLATES ENCONTRADOS' as tipo_info,
  id,
  name,
  slug,
  profession,
  language,
  CASE 
    WHEN content IS NULL THEN '❌ SEM CONTENT'
    WHEN content::text LIKE '%"questions"%' THEN '✅ TEM QUESTIONS'
    ELSE '⚠️ CONTENT DIFERENTE'
  END as status_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND (
    slug LIKE '%interativo%' OR
    LOWER(name) LIKE '%quiz interativo%' OR
    LOWER(name) LIKE '%interativo%'
  )
ORDER BY name;

-- 2. CORRIGIR: Questão 3 - "Quanta Qual" → "Qual" e opções limpas
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
  AND (
    slug = 'quiz-interativo-nutri' OR
    slug LIKE '%interativo%' OR
    LOWER(name) LIKE '%quiz interativo%' OR
    LOWER(name) LIKE '%interativo%'
  )
  AND content IS NOT NULL
  AND content::text LIKE '%"questions"%';

-- 3. VERIFICAR RESULTADO
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
  AND (
    slug = 'quiz-interativo-nutri' OR
    slug LIKE '%interativo%' OR
    LOWER(name) LIKE '%quiz interativo%' OR
    LOWER(name) LIKE '%interativo%'
  )
  AND content IS NOT NULL
  AND content::text LIKE '%"questions"%';

-- 4. SE NÃO ENCONTROU NENHUM TEMPLATE, LISTAR TODOS OS TEMPLATES NUTRI
SELECT 
  '⚠️ TODOS OS TEMPLATES NUTRI (para referência)' as tipo_info,
  id,
  name,
  slug,
  type,
  CASE 
    WHEN content IS NULL THEN '❌ SEM CONTENT'
    WHEN content::text LIKE '%"questions"%' THEN '✅ TEM QUESTIONS'
    ELSE '⚠️ CONTENT DIFERENTE'
  END as status_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
ORDER BY name
LIMIT 50;

