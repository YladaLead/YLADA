-- ============================================
-- CORRIGIR TIPO DO GUIA DE HIDRATAÇÃO
-- Está como "planilha" mas deveria ser "guia"
-- ============================================

-- 1. VERIFICAR ANTES
SELECT 
  'ANTES' as etapa,
  name as nome,
  type as tipo_atual,
  slug,
  is_active,
  created_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND name = 'Guia de Hidratação';

-- 2. CORRIGIR TIPO: planilha → guia
UPDATE templates_nutrition
SET 
  type = 'guia',
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND name = 'Guia de Hidratação'
  AND type = 'planilha';

-- 3. VERIFICAR DEPOIS
SELECT 
  'DEPOIS' as etapa,
  name as nome,
  type as tipo_corrigido,
  slug,
  is_active,
  updated_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND name = 'Guia de Hidratação';

-- 4. CONTAGEM FINAL DE PLANILHAS
SELECT 
  '📊 PLANILHAS ATIVAS' as info,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND is_active = true;

-- 5. CONTAGEM FINAL DE GUIAS
SELECT 
  '📚 GUIAS ATIVOS' as info,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'guia'
  AND is_active = true;

-- 6. RESUMO GERAL
SELECT 
  '📊 RESUMO FINAL' as info,
  COUNT(*) as total_ativos,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN type = 'guia' THEN 1 END) as guias,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;


