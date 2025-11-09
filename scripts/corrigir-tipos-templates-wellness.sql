-- ============================================
-- CORRIGIR TIPOS DE TEMPLATES WELLNESS
-- Corrige templates que estão com tipo incorreto
-- ============================================

-- 1. CORRIGIR DESAFIOS: planilha → quiz
UPDATE templates_nutrition
SET 
  type = 'quiz',
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    (name LIKE '%Desafio 21 Dias%' OR slug = 'desafio-21-dias')
    OR (name LIKE '%Desafio 7 Dias%' OR slug = 'desafio-7-dias')
  )
  AND type = 'planilha';

-- 2. CORRIGIR GUIA DE HIDRATAÇÃO: planilha → quiz (ou manter como planilha se for guia)
-- Verificar primeiro qual é o tipo correto baseado no content
-- Se tiver sections/form, pode ser planilha. Se tiver questions, deve ser quiz.
-- Por enquanto, vamos deixar como está e verificar depois

-- 3. VERIFICAR DUPLICATAS DE QUIZZES
-- Identificar quizzes que são duplicatas ou nomes diferentes do mesmo quiz

-- Verificar se há duplicatas por nome similar
SELECT 
  name,
  slug,
  type,
  created_at,
  CASE 
    WHEN name LIKE '%Bem-Estar%' OR name LIKE '%bem-estar%' OR name LIKE '%Bem Estar%' THEN '⚠️ Possível duplicata: Quiz Bem-Estar'
    WHEN name LIKE '%Detox%' AND name != 'Quiz Detox' THEN '⚠️ Possível duplicata: Quiz Detox'
    WHEN name LIKE '%Metabolismo%' OR name LIKE '%metabolismo%' THEN '⚠️ Possível duplicata: Quiz Interativo'
    WHEN name LIKE '%Sono%' OR name LIKE '%Energia%' OR name LIKE '%energia%' THEN '⚠️ Possível duplicata: Quiz Energético'
    ELSE '✅ OK'
  END as observacao
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (
    name LIKE '%Bem-Estar%' OR name LIKE '%bem-estar%' OR name LIKE '%Bem Estar%'
    OR (name LIKE '%Detox%' AND name != 'Quiz Detox')
    OR name LIKE '%Metabolismo%' OR name LIKE '%metabolismo%'
    OR name LIKE '%Sono%' OR name LIKE '%Energia%' OR name LIKE '%energia%'
  )
ORDER BY name;

-- 4. VERIFICAR RESULTADO APÓS CORREÇÃO
SELECT 
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY type
ORDER BY type;


