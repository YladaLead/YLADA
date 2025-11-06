-- =====================================================
-- SCRIPT 03: GARANTIR COLUNA PROFESSION
-- =====================================================
-- Adiciona coluna profession se não existir
-- Atualiza templates sem profession para 'nutri'
-- =====================================================

-- 1. Adicionar coluna profession se não existir
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

-- 2. Adicionar coluna profession em user_templates se não existir
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
WHERE profession IS NULL;

-- 4. Verificar atualização
SELECT 
  profession,
  COUNT(*) as total
FROM templates_nutrition
GROUP BY profession
ORDER BY profession;

-- ✅ Coluna profession garantida!

