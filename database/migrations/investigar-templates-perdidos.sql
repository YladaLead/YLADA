-- =====================================================
-- INVESTIGAR ONDE ESTÃO OS TEMPLATES PERDIDOS
-- =====================================================
-- Este script verifica todas as possibilidades de onde
-- os templates podem estar escondidos
-- =====================================================

-- 1. VERIFICAR TEMPLATES INATIVOS
SELECT 
  '🔍 TEMPLATES INATIVOS' as categoria,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = false;

-- Listar templates inativos
SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active as ativo,
  created_at as criado_em,
  updated_at as atualizado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = false
ORDER BY created_at DESC;

-- 2. VERIFICAR TEMPLATES COM PROFESSION DIFERENTE OU NULL
SELECT 
  '🔍 TEMPLATES COM PROFESSION DIFERENTE' as categoria,
  profession,
  COUNT(*) as total
FROM templates_nutrition
WHERE language = 'pt'
  AND (profession IS NULL OR profession != 'wellness')
GROUP BY profession
ORDER BY profession;

-- Listar templates que podem ser Wellness mas estão em outra área
SELECT 
  name as nome,
  profession,
  type as tipo,
  is_active as ativo,
  created_at as criado_em
FROM templates_nutrition
WHERE language = 'pt'
  AND (profession IS NULL OR profession != 'wellness')
ORDER BY created_at DESC
LIMIT 50;

-- 3. VERIFICAR TEMPLATES COM LANGUAGE DIFERENTE
SELECT 
  '🔍 TEMPLATES COM LANGUAGE DIFERENTE' as categoria,
  language,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language != 'pt'
GROUP BY language
ORDER BY language;

-- 4. VERIFICAR SE HÁ TEMPLATES DELETADOS (soft delete ou hard delete)
-- Nota: Se houver uma coluna deleted_at, verificar aqui
SELECT 
  '🔍 VERIFICAR COLUNAS DE SOFT DELETE' as info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'templates_nutrition'
  AND (column_name LIKE '%delete%' OR column_name LIKE '%remov%' OR column_name LIKE '%archiv%');

-- 5. VERIFICAR TODOS OS TEMPLATES QUE FORAM CRIADOS ANTES DE HOJE
-- (para ver se há templates antigos que desapareceram)
SELECT 
  '🔍 TEMPLATES CRIADOS ANTES DE HOJE' as categoria,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND DATE(created_at) < CURRENT_DATE;

-- Listar templates criados antes de hoje
SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active as ativo,
  created_at as criado_em,
  updated_at as atualizado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND DATE(created_at) < CURRENT_DATE
ORDER BY created_at DESC;

-- 6. VERIFICAR TEMPLATES QUE FORAM MODIFICADOS HOJE
-- (pode indicar que foram desativados ou modificados)
SELECT 
  '🔍 TEMPLATES MODIFICADOS HOJE' as categoria,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND DATE(updated_at) = CURRENT_DATE;

-- Listar templates modificados hoje
SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active as ativo,
  created_at as criado_em,
  updated_at as atualizado_em
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND DATE(updated_at) = CURRENT_DATE
ORDER BY updated_at DESC;

-- 7. VERIFICAR SE HÁ TEMPLATES EM OUTRAS ÁREAS QUE SÃO IDÊNTICOS AOS 8 ATIVOS
-- (para ver se foram duplicados para outras áreas)
SELECT 
  t1.name as nome_wellness,
  t1.profession as profession_wellness,
  t2.profession as profession_outra,
  COUNT(*) as quantidade_em_outras_areas
FROM templates_nutrition t1
LEFT JOIN templates_nutrition t2 ON t1.name = t2.name 
  AND t1.type = t2.type 
  AND t1.language = t2.language
  AND t2.profession != 'wellness'
WHERE t1.profession = 'wellness'
  AND t1.language = 'pt'
  AND t1.is_active = true
GROUP BY t1.name, t1.profession, t2.profession
HAVING COUNT(*) > 0
ORDER BY quantidade_em_outras_areas DESC;

-- 8. CONTAR TOTAL DE TEMPLATES EM TODAS AS ÁREAS
SELECT 
  '📊 RESUMO GERAL' as categoria,
  profession,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE language = 'pt'
GROUP BY profession
ORDER BY profession;

-- 9. VERIFICAR SE OS 8 TEMPLATES ATIVOS SÃO OS ÚNICOS QUE EXISTEM
-- Comparar com o total geral
SELECT 
  '📊 COMPARAÇÃO' as categoria,
  COUNT(*) as total_templates_wellness,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos,
  COUNT(CASE WHEN DATE(created_at) = '2025-11-05' THEN 1 END) as criados_hoje,
  COUNT(CASE WHEN DATE(created_at) != '2025-11-05' THEN 1 END) as criados_antes
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- 10. LISTAR TODOS OS TEMPLATES WELLNESS SEM FILTRO DE ATIVO
-- (para ver absolutamente tudo)
SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active as ativo,
  profession,
  language,
  created_at as criado_em,
  updated_at as atualizado_em
FROM templates_nutrition
WHERE profession = 'wellness'
ORDER BY is_active DESC, created_at DESC;

