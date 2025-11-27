-- =====================================================
-- VERIFICAR TEMPLATES REAIS QUE DEVEM ESTAR EM COACH
-- =====================================================
-- Este script verifica quais templates realmente existem
-- na tabela templates_nutrition (Wellness/Nutri) que devem
-- ser copiados para coach_templates_nutrition
-- =====================================================

-- =====================================================
-- PASSO 1: LISTAR TODOS OS TEMPLATES ATIVOS EM WELLNESS/NUTRI
-- =====================================================
-- Estes são os templates que devem estar disponíveis em Coach

SELECT 
  'TEMPLATES DISPONÍVEIS EM WELLNESS/NUTRI' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN type = 'checklist' THEN 1 END) as checklists,
  COUNT(CASE WHEN type = 'conteudo' THEN 1 END) as conteudos,
  COUNT(CASE WHEN type = 'diagnostico' THEN 1 END) as diagnosticos
FROM templates_nutrition
WHERE is_active = true
  AND language = 'pt'
  AND (profession = 'wellness' OR profession = 'nutri' OR profession IS NULL OR profession = '');

-- =====================================================
-- PASSO 2: LISTAR TODOS OS TEMPLATES COM NOMES E SLUGS
-- =====================================================

SELECT 
  ROW_NUMBER() OVER (ORDER BY type, name) as num,
  name as nome,
  slug,
  type as tipo,
  profession,
  is_active,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '⚠️ SEM SLUG'
    ELSE '✅ OK'
  END as status_slug
FROM templates_nutrition
WHERE is_active = true
  AND language = 'pt'
  AND (profession = 'wellness' OR profession = 'nutri' OR profession IS NULL OR profession = '')
ORDER BY type, name;

-- =====================================================
-- PASSO 3: VERIFICAR QUAIS JÁ ESTÃO EM COACH
-- =====================================================

SELECT 
  'TEMPLATES JÁ EM COACH' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
FROM coach_templates_nutrition
WHERE language = 'pt';

-- =====================================================
-- PASSO 4: COMPARAR E IDENTIFICAR FALTANTES
-- =====================================================

-- Templates que existem em Wellness/Nutri mas NÃO em Coach
SELECT 
  t.name as nome_original,
  t.slug as slug_original,
  t.type as tipo,
  t.profession as profession_original,
  CASE 
    WHEN c.id IS NULL THEN '❌ FALTANDO EM COACH'
    WHEN c.is_active = false THEN '⚠️ INATIVO EM COACH'
    WHEN c.slug IS NULL OR c.slug = '' THEN '⚠️ SEM SLUG EM COACH'
    ELSE '✅ OK'
  END as status
FROM templates_nutrition t
LEFT JOIN coach_templates_nutrition c 
  ON (c.name = t.name AND c.type = t.type AND c.language = 'pt')
WHERE t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'wellness' OR t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '')
  AND (c.id IS NULL OR c.is_active = false OR c.slug IS NULL OR c.slug = '')
ORDER BY t.type, t.name;

-- =====================================================
-- PASSO 5: LISTAR TEMPLATES EM COACH COM PROBLEMAS
-- =====================================================

SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active,
  profession,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN is_active = false THEN '⚠️ INATIVO'
    WHEN profession != 'coach' THEN '⚠️ PROFESSION ERRADO'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE language = 'pt'
ORDER BY 
  CASE 
    WHEN slug IS NULL OR slug = '' THEN 1
    WHEN is_active = false THEN 2
    ELSE 3
  END,
  type, name;

-- =====================================================
-- PASSO 6: RESUMO FINAL
-- =====================================================

SELECT 
  'RESUMO FINAL' as info,
  (SELECT COUNT(*) FROM templates_nutrition 
   WHERE is_active = true AND language = 'pt' 
   AND (profession = 'wellness' OR profession = 'nutri' OR profession IS NULL OR profession = '')) as total_wellness_nutri,
  (SELECT COUNT(*) FROM coach_templates_nutrition 
   WHERE language = 'pt' AND is_active = true) as total_coach_ativos,
  (SELECT COUNT(*) FROM templates_nutrition 
   WHERE is_active = true AND language = 'pt' 
   AND (profession = 'wellness' OR profession = 'nutri' OR profession IS NULL OR profession = '')) - 
  (SELECT COUNT(*) FROM coach_templates_nutrition 
   WHERE language = 'pt' AND is_active = true) as diferenca;

