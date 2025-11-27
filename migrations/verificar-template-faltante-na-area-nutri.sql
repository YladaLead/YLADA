-- =====================================================
-- VERIFICAR TEMPLATE FALTANTE: Área Nutri
-- Comparar templates Nutri com Coach para encontrar o faltante
-- =====================================================

-- =====================================================
-- 1. BUSCAR "Descubra seu Perfil de Bem-Estar" na área Nutri
-- =====================================================
SELECT 
  '🔍 BUSCAR NA ÁREA NUTRI: Descubra seu Perfil de Bem-Estar' as tipo_busca,
  id,
  name as nome,
  slug,
  type as tipo,
  is_active,
  profession,
  language
FROM templates_nutrition
WHERE (
  name ILIKE '%Descubra%Perfil%Bem-Estar%' OR
  name ILIKE '%Descubra%Perfil%' OR
  name ILIKE '%Perfil de Bem-Estar%' OR
  slug ILIKE '%descubra%' OR
  slug ILIKE '%perfil-bem-estar%' OR
  slug ILIKE '%wellness-profile%'
)
ORDER BY is_active DESC, name;

-- =====================================================
-- 2. LISTAR TODOS OS TEMPLATES NUTRI RELACIONADOS A BEM-ESTAR
-- =====================================================
SELECT 
  '🔍 TODOS RELACIONADOS A BEM-ESTAR (NUTRI)' as tipo_busca,
  id,
  name as nome,
  slug,
  type as tipo,
  is_active,
  profession,
  language
FROM templates_nutrition
WHERE (
  name ILIKE '%bem-estar%' OR
  name ILIKE '%wellness%' OR
  slug ILIKE '%bem-estar%' OR
  slug ILIKE '%wellness%'
)
ORDER BY is_active DESC, name;

-- =====================================================
-- 3. COMPARAR TEMPLATES NUTRI vs COACH
-- Verificar quais templates Nutri NÃO estão no Coach
-- =====================================================
WITH templates_nutri AS (
  SELECT 
    name,
    slug,
    type,
    is_active
  FROM templates_nutrition
  WHERE is_active = true
    AND language = 'pt'
),
templates_coach AS (
  SELECT 
    name,
    slug,
    type,
    is_active
  FROM coach_templates_nutrition
  WHERE is_active = true
    AND profession = 'coach'
    AND language = 'pt'
)
SELECT 
  '⚠️ TEMPLATES NUTRI QUE NÃO ESTÃO NO COACH' as status,
  tn.name as nome_nutri,
  tn.slug as slug_nutri,
  tn.type as tipo_nutri,
  CASE 
    WHEN tc.slug IS NULL THEN '❌ NÃO ESTÁ NO COACH'
    ELSE '✅ ESTÁ NO COACH'
  END as status_coach
FROM templates_nutri tn
LEFT JOIN templates_coach tc ON tn.slug = tc.slug
WHERE tc.slug IS NULL
ORDER BY tn.name;

-- =====================================================
-- 4. VERIFICAR SE HÁ TEMPLATES NUTRI COM SLUGS DIFERENTES
-- Que podem ser o template faltante
-- =====================================================
SELECT 
  '🔍 TEMPLATES NUTRI COM SLUGS POTENCIAIS' as status,
  name as nome_nutri,
  slug as slug_nutri,
  type as tipo_nutri,
  is_active,
  CASE 
    WHEN slug IN (
      SELECT slug FROM coach_templates_nutrition
      WHERE is_active = true AND profession = 'coach' AND language = 'pt'
    ) THEN '✅ JÁ ESTÁ NO COACH'
    ELSE '❌ NÃO ESTÁ NO COACH'
  END as status_coach
FROM templates_nutrition
WHERE (
  slug IN (
    'quiz-wellness-profile',
    'descubra-seu-perfil-de-bem-estar',
    'wellness-profile',
    'perfil-bem-estar',
    'quiz-perfil-bem-estar'
  ) OR
  name ILIKE '%Descubra%Perfil%'
)
AND language = 'pt'
ORDER BY is_active DESC, name;

-- =====================================================
-- 5. CONTAR TEMPLATES NUTRI vs COACH
-- =====================================================
SELECT 
  '📊 CONTAGEM COMPARATIVA' as info,
  (SELECT COUNT(*) FROM templates_nutrition 
   WHERE is_active = true AND language = 'pt') as total_nutri_ativos,
  (SELECT COUNT(*) FROM coach_templates_nutrition 
   WHERE is_active = true AND profession = 'coach' AND language = 'pt') as total_coach_ativos,
  (SELECT COUNT(DISTINCT tn.slug) 
   FROM templates_nutrition tn
   JOIN coach_templates_nutrition tc ON tn.slug = tc.slug
   WHERE tn.is_active = true 
     AND tc.is_active = true 
     AND tn.language = 'pt' 
     AND tc.profession = 'coach' 
     AND tc.language = 'pt'
  ) as templates_compartilhados;

-- =====================================================
-- 6. LISTAR TODOS OS TEMPLATES NUTRI ATIVOS (para referência)
-- =====================================================
SELECT 
  '📋 TODOS OS TEMPLATES NUTRI ATIVOS' as status,
  name as nome,
  slug,
  type as tipo,
  is_active
FROM templates_nutrition
WHERE is_active = true
  AND language = 'pt'
ORDER BY name;

