-- =====================================================
-- SCRIPT 02: VERIFICAR ESTADO ATUAL (VERSÃO CORRIGIDA)
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
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'user_templates'
AND column_name = 'profession';

-- 4. Links criados (se profession existe, senão mostra total)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_templates'
    AND column_name = 'profession'
  ) THEN
    -- Se profession existe, mostrar por profession
    RAISE NOTICE 'Coluna profession existe em user_templates';
  ELSE
    -- Se não existe, mostrar total
    RAISE NOTICE 'Coluna profession NÃO existe em user_templates';
  END IF;
END $$;

-- 5. Total de links (independente de profession)
SELECT 
  COUNT(*) as total_links
FROM user_templates;

-- 6. Listar templates Nutri (para duplicar)
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

-- 7. Contagem por tipo
SELECT 
  COALESCE(profession::text, 'SEM_PROFESSION') as profession,
  type,
  COUNT(*) as total
FROM templates_nutrition
GROUP BY profession, type
ORDER BY profession, type;

