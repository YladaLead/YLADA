-- =====================================================
-- Script: Listar templates duplicados (área Nutri)
-- Objetivo: Encontrar registros com mesmo slug ou mesmo nome
-- Uso: execute no Supabase para identificar duplicidades
-- =====================================================

WITH nutri_templates AS (
  SELECT id, name, slug, type, profession, language
  FROM templates_nutrition
  WHERE profession = 'nutri'
    AND language = 'pt'
)
SELECT
  criterio,
  valor,
  COUNT(*) AS total,
  STRING_AGG(name || ' [' || id || ']', ', ' ORDER BY name) AS templates
FROM (
  SELECT 'slug' AS criterio, slug AS valor, *
  FROM nutri_templates
  UNION ALL
  SELECT 'name', LOWER(name), *
  FROM nutri_templates
) t
WHERE valor IS NOT NULL AND valor <> ''
GROUP BY criterio, valor
HAVING COUNT(*) > 1
ORDER BY criterio, valor;

