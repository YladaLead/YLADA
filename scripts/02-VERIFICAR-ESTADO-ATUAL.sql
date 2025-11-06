-- =====================================================
-- SCRIPT 02: VERIFICAR ESTADO ATUAL DO BANCO
-- =====================================================
-- Execute para ver o que já existe antes da migração
-- IMPORTANTE: Execute cada query separadamente ou todas juntas
-- =====================================================

-- 1. Templates por profession
SELECT 
  COALESCE(profession::text, 'SEM_PROFESSION') as profession,
  COUNT(*) as total_templates
FROM templates_nutrition
GROUP BY profession
ORDER BY profession;

-- 2. Templates sem profession (precisam ser atualizados)
SELECT 
  id,
  name,
  type,
  language,
  profession
FROM templates_nutrition
WHERE profession IS NULL
ORDER BY name;

-- 3. Verificar se coluna profession existe em user_templates
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'user_templates'
      AND column_name = 'profession'
    ) THEN 'SIM - Coluna profession existe'
    ELSE 'NÃO - Coluna profession não existe'
  END as status_coluna_profession;

-- 4. Total de links (independente de profession)
SELECT 
  COUNT(*) as total_links
FROM user_templates;

-- 5. Listar todos os templates Nutri (para duplicar)
SELECT 
  id,
  name,
  type,
  language,
  profession,
  is_active,
  created_at
FROM templates_nutrition
WHERE profession = 'nutri' OR profession IS NULL
ORDER BY type, name;

-- 6. Contagem por tipo
SELECT 
  COALESCE(profession::text, 'SEM_PROFESSION') as profession,
  type,
  COUNT(*) as total
FROM templates_nutrition
GROUP BY profession, type
ORDER BY profession, type;

