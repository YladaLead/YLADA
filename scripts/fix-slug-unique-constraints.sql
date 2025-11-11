-- =====================================================
-- CORRIGIR CONSTRAINTS UNIQUE DE SLUG
-- Permite que diferentes usuários usem o mesmo slug
-- Mantém unicidade por usuário (slug + user_id)
-- =====================================================

-- =====================================================
-- 1. WELLNESS_PORTALS
-- =====================================================

-- Remover constraint UNIQUE do slug (se existir)
DO $$
BEGIN
  -- Verificar e remover constraint única do slug
  IF EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'wellness_portals_slug_key'
  ) THEN
    ALTER TABLE wellness_portals DROP CONSTRAINT wellness_portals_slug_key;
  END IF;
END $$;

-- Criar constraint UNIQUE composta (slug + user_id)
-- Isso garante que cada usuário tenha slugs únicos, mas permite duplicatas entre usuários
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'wellness_portals_slug_user_id_unique'
  ) THEN
    ALTER TABLE wellness_portals 
    ADD CONSTRAINT wellness_portals_slug_user_id_unique 
    UNIQUE (slug, user_id);
  END IF;
END $$;

-- =====================================================
-- 2. QUIZZES
-- =====================================================

-- Remover constraint UNIQUE do slug (se existir)
DO $$
BEGIN
  -- Verificar e remover constraint única do slug
  IF EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'quizzes_slug_key'
  ) THEN
    ALTER TABLE quizzes DROP CONSTRAINT quizzes_slug_key;
  END IF;
END $$;

-- Criar constraint UNIQUE composta (slug + user_id)
-- Isso garante que cada usuário tenha slugs únicos, mas permite duplicatas entre usuários
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'quizzes_slug_user_id_unique'
  ) THEN
    ALTER TABLE quizzes 
    ADD CONSTRAINT quizzes_slug_user_id_unique 
    UNIQUE (slug, user_id);
  END IF;
END $$;

-- =====================================================
-- 3. USER_TEMPLATES (FERRAMENTAS)
-- =====================================================

-- Remover constraint UNIQUE do slug (se existir)
DO $$
BEGIN
  -- Verificar e remover constraint única do slug
  -- Pode ter nomes diferentes dependendo de como foi criada
  IF EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'user_templates_slug_key'
  ) THEN
    ALTER TABLE user_templates DROP CONSTRAINT user_templates_slug_key;
  END IF;
  
  -- Tentar outros nomes possíveis
  IF EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'user_templates_slug_unique'
  ) THEN
    ALTER TABLE user_templates DROP CONSTRAINT user_templates_slug_unique;
  END IF;
END $$;

-- Criar constraint UNIQUE composta (slug + user_id)
-- Isso garante que cada usuário tenha slugs únicos, mas permite duplicatas entre usuários
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'user_templates_slug_user_id_unique'
  ) THEN
    ALTER TABLE user_templates 
    ADD CONSTRAINT user_templates_slug_user_id_unique 
    UNIQUE (slug, user_id);
  END IF;
END $$;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar constraints criadas
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('wellness_portals', 'quizzes', 'user_templates')
  AND tc.constraint_type = 'UNIQUE'
ORDER BY tc.table_name, tc.constraint_name;

