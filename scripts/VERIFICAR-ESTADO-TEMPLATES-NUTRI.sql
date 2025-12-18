-- =====================================================
-- VERIFICAR ESTADO ATUAL DOS TEMPLATES NUTRI
-- Execute no Supabase SQL Editor para diagnóstico
-- =====================================================

-- 1. QUANTOS TEMPLATES NUTRI EXISTEM?
SELECT 
  '📊 RESUMO TEMPLATES NUTRI' as info,
  COUNT(*) as total_existentes,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

-- 2. SE EXISTEM, LISTAR TODOS
SELECT 
  CASE WHEN is_active THEN '✅' ELSE '❌' END as status,
  slug,
  name as nome,
  type as tipo,
  is_active
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
ORDER BY type, name;

-- 3. VERIFICAR SE EXISTEM TEMPLATES SEM PROFESSION DEFINIDO
SELECT 
  '⚠️ TEMPLATES SEM PROFESSION' as alerta,
  COUNT(*) as total
FROM templates_nutrition
WHERE (profession IS NULL OR profession = '')
  AND language = 'pt';

-- 4. VERIFICAR TEMPLATES COM OUTROS VALORES DE PROFESSION
SELECT 
  profession,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE language = 'pt'
GROUP BY profession
ORDER BY total DESC;

-- 5. SE NÃO EXISTEM TEMPLATES NUTRI, MOSTRAR O QUE EXISTE
SELECT 
  '📋 AMOSTRA DE TEMPLATES EXISTENTES' as info,
  id,
  name,
  slug,
  profession,
  is_active
FROM templates_nutrition
WHERE language = 'pt'
  AND is_active = true
LIMIT 10;
