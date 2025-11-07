-- =====================================================
-- VERIFICAR QUANDO OS TEMPLATES FORAM INSERIDOS
-- =====================================================
-- Este script mostra quantos templates foram inseridos
-- hoje vs. ontem para entender o que aconteceu
-- =====================================================

-- 1. CONTAR TEMPLATES POR DATA DE CRIAÇÃO
SELECT 
  '📊 TEMPLATES POR DATA DE CRIAÇÃO' as info,
  DATE(created_at) as data_criacao,
  COUNT(*) as quantidade,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY DATE(created_at)
ORDER BY data_criacao DESC;

-- 2. TEMPLATES INSERIDOS ONTEM (2025-11-05)
SELECT 
  '📅 TEMPLATES INSERIDOS ONTEM (05/11)' as info,
  COUNT(*) as total,
  name as nome,
  type as tipo,
  created_at as criado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND DATE(created_at) = '2025-11-05'
GROUP BY name, type, created_at
ORDER BY created_at, type, name;

-- 3. TEMPLATES INSERIDOS HOJE (2025-11-06)
SELECT 
  '📅 TEMPLATES INSERIDOS HOJE (06/11)' as info,
  COUNT(*) as total,
  name as nome,
  type as tipo,
  created_at as criado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND DATE(created_at) = '2025-11-06'
GROUP BY name, type, created_at
ORDER BY created_at, type, name;

-- 4. RESUMO COMPARATIVO
SELECT 
  '📊 RESUMO COMPARATIVO' as info,
  COUNT(CASE WHEN DATE(created_at) = '2025-11-05' THEN 1 END) as inseridos_ontem,
  COUNT(CASE WHEN DATE(created_at) = '2025-11-06' THEN 1 END) as inseridos_hoje,
  COUNT(*) as total_geral,
  COUNT(CASE WHEN DATE(created_at) NOT IN ('2025-11-05', '2025-11-06') THEN 1 END) as outras_datas
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- 5. LISTAR TODOS OS TEMPLATES COM DATA DE CRIAÇÃO
SELECT 
  name as nome,
  type as tipo,
  DATE(created_at) as data_criacao,
  created_at as hora_exata,
  CASE 
    WHEN DATE(created_at) = '2025-11-05' THEN '✅ Ontem'
    WHEN DATE(created_at) = '2025-11-06' THEN '🆕 Hoje'
    ELSE '❓ Outra data'
  END as quando_foi_inserido
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY created_at DESC, type, name;

-- 6. VERIFICAR SE HÁ TEMPLATES COM DATAS DIFERENTES
SELECT 
  '🔍 TEMPLATES COM DATAS DIFERENTES DE 05/11 E 06/11' as info,
  COUNT(*) as quantidade,
  DATE(created_at) as data_criacao
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND DATE(created_at) NOT IN ('2025-11-05', '2025-11-06')
GROUP BY DATE(created_at)
ORDER BY data_criacao DESC;

-- 7. CONTAR TEMPLATES POR HORA DE CRIAÇÃO (PARA VER O HORÁRIO EXATO)
SELECT 
  '🕐 TEMPLATES POR HORA DE CRIAÇÃO' as info,
  DATE_TRUNC('hour', created_at) as hora_criacao,
  COUNT(*) as quantidade
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hora_criacao DESC;

