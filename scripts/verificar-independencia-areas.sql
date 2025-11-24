-- ===========================================================
-- VERIFICAÇÃO FINAL: Independência das Áreas
-- 
-- Este script verifica se cada área tem seus templates
-- funcionando de forma independente
-- ===========================================================

-- ===========================================================
-- 1. RESUMO GERAL POR ÁREA
-- ===========================================================

SELECT 
  profession as area,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos,
  ROUND(
    (COUNT(CASE WHEN is_active = true THEN 1 END) * 100.0) / COUNT(*), 
    1
  ) as percentual_ativo
FROM templates_nutrition
WHERE language = 'pt'
GROUP BY profession
ORDER BY profession;

-- ===========================================================
-- 2. WELLNESS - Templates Ativos
-- ===========================================================

SELECT 
  'WELLNESS' as area,
  COUNT(*) as templates_ativos,
  'Área com diagnósticos próprios' as observacao
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- ===========================================================
-- 3. NUTRI - Templates Oficiais (29)
-- ===========================================================

SELECT 
  'NUTRI' as area,
  COUNT(*) as templates_ativos,
  CASE 
    WHEN COUNT(*) = 29 THEN '✅ Correto - 29 templates oficiais'
    ELSE '⚠️ Verificar - deveria ter 29 templates'
  END as observacao
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true;

-- ===========================================================
-- 4. COACH - Templates Ativos
-- ===========================================================

SELECT 
  'COACH' as area,
  COUNT(*) as templates_ativos,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Templates ativos - diagnósticos independentes'
    ELSE '❌ Nenhum template ativo - precisa ativar'
  END as observacao
FROM templates_nutrition
WHERE profession = 'coach'
  AND language = 'pt'
  AND is_active = true;

-- ===========================================================
-- 5. VERIFICAÇÃO DE SLUGS ÚNICOS POR ÁREA
-- ===========================================================

-- Verificar se há slugs duplicados entre áreas (pode causar conflitos)
SELECT 
  slug,
  COUNT(*) as areas_usando,
  STRING_AGG(profession, ', ') as areas
FROM templates_nutrition
WHERE language = 'pt'
  AND is_active = true
GROUP BY slug
HAVING COUNT(*) > 1
ORDER BY areas_usando DESC;

-- ===========================================================
-- 6. STATUS FINAL
-- ===========================================================

SELECT 
  'STATUS FINAL' as categoria,
  (
    SELECT COUNT(*) 
    FROM templates_nutrition 
    WHERE profession = 'wellness' AND language = 'pt' AND is_active = true
  ) as wellness_ativos,
  (
    SELECT COUNT(*) 
    FROM templates_nutrition 
    WHERE profession = 'nutri' AND language = 'pt' AND is_active = true
  ) as nutri_ativos,
  (
    SELECT COUNT(*) 
    FROM templates_nutrition 
    WHERE profession = 'coach' AND language = 'pt' AND is_active = true
  ) as coach_ativos,
  CASE 
    WHEN (
      SELECT COUNT(*) FROM templates_nutrition 
      WHERE profession = 'nutri' AND language = 'pt' AND is_active = true
    ) = 29 
    AND (
      SELECT COUNT(*) FROM templates_nutrition 
      WHERE profession = 'coach' AND language = 'pt' AND is_active = true
    ) > 0
    THEN '✅ TODAS AS ÁREAS INDEPENDENTES E FUNCIONAIS'
    ELSE '⚠️ AINDA PRECISA AJUSTES'
  END as status_geral;
