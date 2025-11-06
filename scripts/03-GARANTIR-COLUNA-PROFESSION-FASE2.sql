-- =====================================================
-- SCRIPT 03: GARANTIR COLUNA PROFESSION (FASE 2)
-- =====================================================
-- Garante que as colunas profession existem em ambas as tabelas
-- =====================================================

-- 1. Garantir coluna profession em templates_nutrition
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'templates_nutrition'
    AND column_name = 'profession'
  ) THEN
    ALTER TABLE templates_nutrition ADD COLUMN profession VARCHAR(100);
    RAISE NOTICE '✅ Coluna profession adicionada em templates_nutrition';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna profession já existe em templates_nutrition';
  END IF;
END $$;

-- 2. Garantir coluna profession em user_templates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_templates'
    AND column_name = 'profession'
  ) THEN
    ALTER TABLE user_templates ADD COLUMN profession VARCHAR(100);
    RAISE NOTICE '✅ Coluna profession adicionada em user_templates';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna profession já existe em user_templates';
  END IF;
END $$;

-- 3. Atualizar templates Nutri existentes sem profession
UPDATE templates_nutrition
SET profession = 'nutri'
WHERE profession IS NULL
AND (
  -- Se não tem profession mas tem características de Nutri
  name ILIKE '%nutri%' 
  OR name ILIKE '%nutricionista%'
  OR (profession IS NULL AND id IN (
    SELECT id FROM templates_nutrition 
    WHERE profession = 'nutri' 
    LIMIT 1
  ))
);

-- 4. Verificar resultado
SELECT 
  'templates_nutrition' as tabela,
  COALESCE(profession::text, 'SEM_PROFESSION') as profession,
  COUNT(*) as total
FROM templates_nutrition
GROUP BY profession
ORDER BY profession;

SELECT 
  'user_templates' as tabela,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'user_templates'
      AND column_name = 'profession'
    ) THEN 'Coluna profession existe'
    ELSE 'Coluna profession NÃO existe'
  END as status;

-- ✅ Colunas profession garantidas!

