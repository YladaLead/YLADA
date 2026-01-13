-- =====================================================
-- VERIFICAR TABELAS DE LINKS DO COACH
-- =====================================================
-- Script para verificar onde os links do Coach estão armazenados
-- =====================================================

-- 1. Verificar se coach_user_templates existe
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'coach_user_templates'
    ) THEN '✅ Tabela coach_user_templates EXISTE'
    ELSE '❌ Tabela coach_user_templates NÃO EXISTE'
  END as status_coach_user_templates;

-- 2. Verificar se user_templates existe e tem coluna profession
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'user_templates'
    ) THEN '✅ Tabela user_templates EXISTE'
    ELSE '❌ Tabela user_templates NÃO EXISTE'
  END as status_user_templates,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'user_templates'
      AND column_name = 'profession'
    ) THEN '✅ Coluna profession EXISTE em user_templates'
    ELSE '❌ Coluna profession NÃO EXISTE em user_templates'
  END as status_profession_column;

-- 3. Se coach_user_templates existe, mostrar estatísticas
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'coach_user_templates'
  ) THEN
    RAISE NOTICE '=== ESTATÍSTICAS coach_user_templates ===';
    FOR r IN 
      SELECT 
        COALESCE(profession::text, 'NULL') as profession,
        COUNT(*) as total
      FROM coach_user_templates
      GROUP BY profession
      ORDER BY profession
    LOOP
      RAISE NOTICE 'profession: %, total: %', r.profession, r.total;
    END LOOP;
  END IF;
END $$;

-- 4. Se user_templates existe, mostrar estatísticas de links do Coach
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_templates'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_templates'
    AND column_name = 'profession'
  ) THEN
    RAISE NOTICE '=== ESTATÍSTICAS user_templates (Coach) ===';
    FOR r IN 
      SELECT 
        COALESCE(profession::text, 'NULL') as profession,
        COUNT(*) as total
      FROM user_templates
      WHERE user_id IN (
        SELECT user_id FROM user_profiles 
        WHERE perfil = 'coach' OR profession = 'coach'
      )
      GROUP BY profession
      ORDER BY profession
    LOOP
      RAISE NOTICE 'profession: %, total: %', r.profession, r.total;
    END LOOP;
  END IF;
END $$;
