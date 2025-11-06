-- =====================================================
-- SCRIPT 02: VERIFICAR ESTADO ATUAL (VERSÃO SIMPLES)
-- =====================================================
-- Execute este script para verificar o estado atual
-- =====================================================

-- 1. Templates por profession
SELECT 
  COALESCE(profession::text, 'SEM_PROFESSION') as profession,
  COUNT(*) as total_templates
FROM templates_nutrition
GROUP BY profession
ORDER BY profession;

-- 2. Templates sem profession
SELECT 
  id,
  name,
  type,
  language,
  profession
FROM templates_nutrition
WHERE profession IS NULL
ORDER BY name;

-- 3. Links criados por profession
SELECT 
  COALESCE(profession::text, 'SEM_PROFESSION') as profession,
  COUNT(*) as total_links
FROM user_templates
GROUP BY profession
ORDER BY profession;

-- 4. Listar templates Nutri (para duplicar)
SELECT 
  id,
  name,
  type,
  language,
  profession,
  is_active
FROM templates_nutrition
WHERE profession = 'nutri' OR profession IS NULL
ORDER BY type, name;

