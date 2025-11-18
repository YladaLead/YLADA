-- =====================================================
-- VERIFICAR TEMPLATES: NUTRI vs WELLNESS
-- Comparação completa entre áreas
-- =====================================================

-- 1. CONTAGEM GERAL POR PROFESSION
SELECT 
    profession,
    COUNT(*) as total_templates,
    COUNT(DISTINCT type) as tipos_diferentes,
    COUNT(DISTINCT slug) as slugs_unicos,
    SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as ativos,
    SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inativos
FROM templates_nutrition
WHERE language = 'pt'
GROUP BY profession
ORDER BY profession;

-- 2. TEMPLATES POR TIPO (NUTRI)
SELECT 
    type,
    COUNT(*) as total,
    COUNT(DISTINCT name) as nomes_unicos,
    STRING_AGG(DISTINCT name, ', ' ORDER BY name) as templates
FROM templates_nutrition
WHERE profession = 'nutri' 
  AND language = 'pt'
  AND is_active = true
GROUP BY type
ORDER BY type;

-- 3. TEMPLATES POR TIPO (WELLNESS)
SELECT 
    type,
    COUNT(*) as total,
    COUNT(DISTINCT name) as nomes_unicos,
    STRING_AGG(DISTINCT name, ', ' ORDER BY name) as templates
FROM templates_nutrition
WHERE profession = 'wellness' 
  AND language = 'pt'
  AND is_active = true
GROUP BY type
ORDER BY type;

-- 4. COMPARAÇÃO: TEMPLATES QUE EXISTEM EM WELLNESS MAS NÃO EM NUTRI
SELECT 
    w.name as template_wellness,
    w.type as tipo,
    w.slug as slug_wellness,
    CASE 
        WHEN n.id IS NULL THEN '❌ FALTANDO EM NUTRI' 
        ELSE '✅ EXISTE EM NUTRI' 
    END as status_nutri,
    n.slug as slug_nutri
FROM templates_nutrition w
LEFT JOIN templates_nutrition n ON w.name = n.name 
    AND n.profession = 'nutri' 
    AND w.type = n.type
    AND w.language = n.language
WHERE w.profession = 'wellness'
  AND w.is_active = true
  AND w.language = 'pt'
ORDER BY status_nutri, w.type, w.name;

-- 5. COMPARAÇÃO: TEMPLATES QUE EXISTEM EM NUTRI MAS NÃO EM WELLNESS
SELECT 
    n.name as template_nutri,
    n.type as tipo,
    n.slug as slug_nutri,
    CASE 
        WHEN w.id IS NULL THEN '❌ FALTANDO EM WELLNESS' 
        ELSE '✅ EXISTE EM WELLNESS' 
    END as status_wellness,
    w.slug as slug_wellness
FROM templates_nutrition n
LEFT JOIN templates_nutrition w ON n.name = w.name 
    AND w.profession = 'wellness' 
    AND n.type = w.type
    AND n.language = w.language
WHERE n.profession = 'nutri'
  AND n.is_active = true
  AND n.language = 'pt'
ORDER BY status_wellness, n.type, n.name;

-- 6. LISTA COMPLETA DE TEMPLATES NUTRI (COM DETALHES)
SELECT 
    id,
    name,
    slug,
    type,
    profession,
    is_active,
    created_at,
    updated_at
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
ORDER BY type, name;

-- 7. LISTA COMPLETA DE TEMPLATES WELLNESS (COM DETALHES)
SELECT 
    id,
    name,
    slug,
    type,
    profession,
    is_active,
    created_at,
    updated_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY type, name;

-- 8. RESUMO FINAL
SELECT 
    'NUTRI' as area,
    COUNT(*) as total_templates,
    COUNT(DISTINCT type) as tipos_diferentes,
    STRING_AGG(DISTINCT type, ', ' ORDER BY type) as tipos
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt' AND is_active = true

UNION ALL

SELECT 
    'WELLNESS' as area,
    COUNT(*) as total_templates,
    COUNT(DISTINCT type) as tipos_diferentes,
    STRING_AGG(DISTINCT type, ', ' ORDER BY type) as tipos
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt' AND is_active = true;



