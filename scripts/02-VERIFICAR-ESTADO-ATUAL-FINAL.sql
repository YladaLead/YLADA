-- =====================================================
-- SCRIPT 02: VERIFICAR ESTADO ATUAL (VERSÃO FINAL)
-- =====================================================
-- Execute este script completo no Supabase SQL Editor
-- =====================================================

-- QUERY 1: Templates por profession
SELECT 
  COALESCE(profession::text, 'SEM_PROFESSION') as profession,
  COUNT(*) as total_templates
FROM templates_nutrition
GROUP BY profession
ORDER BY profession;

-- QUERY 2: Templates sem profession
SELECT 
  id,
  name,
  type,
  language,
  profession
FROM templates_nutrition
WHERE profession IS NULL
ORDER BY name;

-- QUERY 3: Verificar se coluna profession existe em user_templates
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'user_templates'
      AND column_name = 'profession'
    ) THEN 'SIM - Coluna profession existe'
    ELSE 'NÃO - Coluna profession não existe'
  END as status_coluna_profession;

-- QUERY 4: Total de links (independente de profession)
SELECT 
  COUNT(*) as total_links
FROM user_templates;

-- QUERY 5: Listar templates Nutri (para duplicar)
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

-- QUERY 6: Contagem por tipo e profession
SELECT 
  COALESCE(profession::text, 'SEM_PROFESSION') as profession,
  type,
  COUNT(*) as total
FROM templates_nutrition
GROUP BY profession, type
ORDER BY profession, type;

