-- ============================================
-- COMPARAR TEMPLATES WELLNESS vs NUTRI
-- Identifica quais templates estão faltando na área Nutri
-- ============================================

-- 1. CONTAGEM GERAL
SELECT 
  'Wellness' as area,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt'

UNION ALL

SELECT 
  'Nutri' as area,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';

-- 2. TEMPLATES QUE EXISTEM EM WELLNESS MAS NÃO EM NUTRI
SELECT 
  '❌ FALTANDO NA NUTRI' as status,
  w.name as nome_template,
  w.type as tipo,
  w.specialization as especializacao,
  w.is_active as ativo_wellness,
  w.created_at as criado_em
FROM templates_nutrition w
LEFT JOIN templates_nutrition n ON 
  LOWER(TRIM(w.name)) = LOWER(TRIM(n.name))
  AND w.type = n.type
  AND w.language = n.language
  AND n.profession = 'nutri'
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND n.id IS NULL
ORDER BY w.type, w.name;

-- 3. TEMPLATES QUE EXISTEM EM NUTRI MAS NÃO EM WELLNESS (caso existam)
SELECT 
  '⚠️ APENAS NA NUTRI' as status,
  n.name as nome_template,
  n.type as tipo,
  n.specialization as especializacao,
  n.is_active as ativo_nutri,
  n.created_at as criado_em
FROM templates_nutrition n
LEFT JOIN templates_nutrition w ON 
  LOWER(TRIM(n.name)) = LOWER(TRIM(w.name))
  AND n.type = w.type
  AND n.language = w.language
  AND w.profession = 'wellness'
WHERE n.profession = 'nutri'
  AND n.language = 'pt'
  AND w.id IS NULL
ORDER BY n.type, n.name;

-- 4. RESUMO POR TIPO - WELLNESS
SELECT 
  'Wellness' as area,
  type as tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt'
GROUP BY type
ORDER BY type;

-- 5. RESUMO POR TIPO - NUTRI
SELECT 
  'Nutri' as area,
  type as tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt'
GROUP BY type
ORDER BY type;

-- 6. COMPARAÇÃO DETALHADA: TEMPLATES QUE EXISTEM EM AMBAS AS ÁREAS
SELECT 
  w.name as nome_template,
  w.type as tipo,
  w.is_active as ativo_wellness,
  n.is_active as ativo_nutri,
  CASE 
    WHEN w.is_active = true AND n.is_active = true THEN '✅ Ambas ativas'
    WHEN w.is_active = true AND n.is_active = false THEN '⚠️ Wellness ativa, Nutri inativa'
    WHEN w.is_active = false AND n.is_active = true THEN '⚠️ Wellness inativa, Nutri ativa'
    ELSE '❌ Ambas inativas'
  END as status_comparacao
FROM templates_nutrition w
INNER JOIN templates_nutrition n ON 
  LOWER(TRIM(w.name)) = LOWER(TRIM(n.name))
  AND w.type = n.type
  AND w.language = n.language
WHERE w.profession = 'wellness'
  AND n.profession = 'nutri'
  AND w.language = 'pt'
ORDER BY w.type, w.name;

-- 7. LISTA COMPLETA DE TEMPLATES WELLNESS (para referência)
SELECT 
  'Wellness' as area,
  name as nome,
  type as tipo,
  specialization as especializacao,
  is_active as ativo,
  slug
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt'
ORDER BY type, name;

-- 8. LISTA COMPLETA DE TEMPLATES NUTRI (para referência)
SELECT 
  'Nutri' as area,
  name as nome,
  type as tipo,
  specialization as especializacao,
  is_active as ativo,
  slug
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt'
ORDER BY type, name;

-- 9. RESUMO FINAL: QUANTOS TEMPLATES FALTAM NA NUTRI
SELECT 
  COUNT(*) as templates_faltando_na_nutri,
  COUNT(DISTINCT w.type) as tipos_afetados
FROM templates_nutrition w
LEFT JOIN templates_nutrition n ON 
  LOWER(TRIM(w.name)) = LOWER(TRIM(n.name))
  AND w.type = n.type
  AND w.language = n.language
  AND n.profession = 'nutri'
WHERE w.profession = 'wellness'
  AND w.language = 'pt'
  AND n.id IS NULL;

