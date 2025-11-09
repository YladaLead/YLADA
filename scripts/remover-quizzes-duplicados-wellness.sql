-- ============================================
-- REMOVER QUIZZES DUPLICADOS - WELLNESS
-- Desativa versões duplicadas, mantendo apenas as corretas
-- ============================================

-- 1. VERIFICAR ANTES DE REMOVER
SELECT 
  'ANTES' as etapa,
  name as nome,
  slug,
  is_active,
  id,
  created_at,
  CASE 
    WHEN name LIKE '%Desafio 21 Dias%' AND slug = 'desafio-21-dias' THEN '✅ MANTER'
    WHEN name LIKE '%Desafio 21 Dias%' AND slug IS NULL THEN '❌ REMOVER'
    WHEN name LIKE '%Desafio 7 Dias%' AND slug = 'desafio-7-dias' THEN '✅ MANTER'
    WHEN name LIKE '%Desafio 7 Dias%' AND slug IS NULL THEN '❌ REMOVER'
    WHEN name = 'Quiz de Bem-Estar' THEN '✅ MANTER (verificar se tem slug)'
    WHEN name = 'Descubra seu Perfil de Bem-Estar' THEN '❌ REMOVER'
    WHEN name = 'Quiz: Perfil de Bem-Estar' THEN '❌ REMOVER'
    WHEN name = 'Quiz Detox' THEN '✅ MANTER'
    WHEN name = 'Seu corpo está pedindo Detox?' THEN '❌ REMOVER'
    WHEN name = 'Quiz Interativo' AND slug = 'quiz-interativo' THEN '✅ MANTER'
    WHEN name = 'Diagnóstico do Tipo de Metabolismo' THEN '❌ REMOVER'
    WHEN name = 'Quiz Energético' THEN '✅ MANTER'
    WHEN name = 'Avaliação do Sono e Energia' THEN '❌ REMOVER'
    ELSE '⚠️ VERIFICAR'
  END as acao
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND (
    -- Desafios
    name LIKE '%Desafio 21 Dias%'
    OR name LIKE '%Desafio 7 Dias%'
    -- Bem-Estar
    OR name = 'Quiz de Bem-Estar'
    OR name = 'Descubra seu Perfil de Bem-Estar'
    OR name = 'Quiz: Perfil de Bem-Estar'
    -- Detox
    OR name = 'Quiz Detox'
    OR name = 'Seu corpo está pedindo Detox?'
    -- Metabolismo/Interativo
    OR name = 'Quiz Interativo'
    OR name = 'Diagnóstico do Tipo de Metabolismo'
    -- Energia/Sono
    OR name = 'Quiz Energético'
    OR name = 'Avaliação do Sono e Energia'
  )
ORDER BY 
  CASE 
    WHEN name LIKE '%Desafio%' THEN 1
    WHEN name LIKE '%Bem-Estar%' THEN 2
    WHEN name LIKE '%Detox%' THEN 3
    WHEN name LIKE '%Metabolismo%' OR name = 'Quiz Interativo' THEN 4
    WHEN name LIKE '%Energia%' OR name LIKE '%Sono%' THEN 5
    ELSE 6
  END,
  name;

-- 2. DESATIVAR DESAFIOS DUPLICADOS (sem slug)
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND (
    (name LIKE '%Desafio 21 Dias%' AND slug IS NULL)
    OR (name LIKE '%Desafio 7 Dias%' AND slug IS NULL)
  );

-- 3. DESATIVAR QUIZZES BEM-ESTAR DUPLICADOS
-- Manter apenas "Quiz de Bem-Estar", remover os outros
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND (
    name = 'Descubra seu Perfil de Bem-Estar'
    OR name = 'Quiz: Perfil de Bem-Estar'
  );

-- 4. DESATIVAR QUIZ DETOX DUPLICADO
-- Manter "Quiz Detox", remover "Seu corpo está pedindo Detox?"
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND name = 'Seu corpo está pedindo Detox?';

-- 5. DESATIVAR QUIZ METABOLISMO DUPLICADO
-- Manter "Quiz Interativo" (com slug), remover "Diagnóstico do Tipo de Metabolismo"
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND name = 'Diagnóstico do Tipo de Metabolismo';

-- 6. DESATIVAR QUIZ ENERGIA/SONO DUPLICADO
-- Manter "Quiz Energético", remover "Avaliação do Sono e Energia"
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND is_active = true
  AND name = 'Avaliação do Sono e Energia';

-- 7. VERIFICAR DEPOIS
SELECT 
  'DEPOIS' as etapa,
  name as nome,
  slug,
  is_active,
  id,
  created_at,
  CASE 
    WHEN is_active = true THEN '✅ ATIVO'
    ELSE '❌ DESATIVADO'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (
    -- Desafios
    name LIKE '%Desafio 21 Dias%'
    OR name LIKE '%Desafio 7 Dias%'
    -- Bem-Estar
    OR name = 'Quiz de Bem-Estar'
    OR name = 'Descubra seu Perfil de Bem-Estar'
    OR name = 'Quiz: Perfil de Bem-Estar'
    -- Detox
    OR name = 'Quiz Detox'
    OR name = 'Seu corpo está pedindo Detox?'
    -- Metabolismo/Interativo
    OR name = 'Quiz Interativo'
    OR name = 'Diagnóstico do Tipo de Metabolismo'
    -- Energia/Sono
    OR name = 'Quiz Energético'
    OR name = 'Avaliação do Sono e Energia'
  )
ORDER BY 
  CASE 
    WHEN name LIKE '%Desafio%' THEN 1
    WHEN name LIKE '%Bem-Estar%' THEN 2
    WHEN name LIKE '%Detox%' THEN 3
    WHEN name LIKE '%Metabolismo%' OR name = 'Quiz Interativo' THEN 4
    WHEN name LIKE '%Energia%' OR name LIKE '%Sono%' THEN 5
    ELSE 6
  END,
  is_active DESC,
  name;

-- 8. CONTAGEM FINAL
SELECT 
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY type
ORDER BY type;

-- 9. TOTAL DE TEMPLATES ATIVOS
SELECT 
  '📊 RESUMO FINAL' as info,
  COUNT(*) as total_ativos,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

