-- =====================================================
-- VERIFICAR E REMOVER TEXTO EXPLICATIVO DO TEMPLATE "perfil-intestino"
-- =====================================================

-- PASSO 1: Verificar o template atual
SELECT 
  id,
  name,
  slug,
  description,
  objective,
  profession,
  is_active,
  CASE 
    WHEN description ILIKE '%identificar pessoas%' OR description ILIKE '%direcionando%' OR description ILIKE '%kit acelera%' THEN '❌ TEM TEXTO EXPLICATIVO'
    WHEN objective ILIKE '%identificar pessoas%' OR objective ILIKE '%direcionando%' OR objective ILIKE '%kit acelera%' THEN '❌ TEM TEXTO EXPLICATIVO NO OBJETIVO'
    ELSE '✅ SEM TEXTO EXPLICATIVO'
  END as diagnostico
FROM templates_nutrition
WHERE slug = 'perfil-intestino'
  AND profession = 'wellness';

-- PASSO 2: Remover textos explicativos do campo description
UPDATE templates_nutrition
SET 
  description = 'Identifique o tipo de funcionamento intestinal e saúde digestiva',
  objective = 'Identificar o tipo de funcionamento intestinal e saúde digestiva',
  updated_at = NOW()
WHERE slug = 'perfil-intestino'
  AND profession = 'wellness'
  AND (
    description ILIKE '%identificar pessoas%' 
    OR description ILIKE '%direcionando%' 
    OR description ILIKE '%kit acelera%'
    OR objective ILIKE '%identificar pessoas%'
    OR objective ILIKE '%direcionando%'
    OR objective ILIKE '%kit acelera%'
  );

-- PASSO 3: Verificar se foi corrigido
SELECT 
  id,
  name,
  slug,
  description,
  objective,
  profession,
  CASE 
    WHEN description ILIKE '%identificar pessoas%' OR description ILIKE '%direcionando%' OR description ILIKE '%kit acelera%' THEN '❌ AINDA TEM TEXTO EXPLICATIVO'
    WHEN objective ILIKE '%identificar pessoas%' OR objective ILIKE '%direcionando%' OR objective ILIKE '%kit acelera%' THEN '❌ AINDA TEM TEXTO EXPLICATIVO NO OBJETIVO'
    ELSE '✅ CORRIGIDO - SEM TEXTO EXPLICATIVO'
  END as status_final
FROM templates_nutrition
WHERE slug = 'perfil-intestino'
  AND profession = 'wellness';












