-- =====================================================
-- Remove QUALQUER constraint CHECK na coluna perfil de user_profiles
-- (nome pode variar) e recria com valores incluindo ylada.
-- Rode se a 220 não resolveu (constraint com outro nome).
-- =====================================================

-- Remover qualquer CHECK em user_profiles que restrinja perfil (por nome conhecido ou por definição)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.contype = 'c'
      AND t.relname = 'user_profiles'
      AND n.nspname = 'public'
      AND (pg_get_constraintdef(c.oid) LIKE '%perfil%' OR c.conname LIKE '%perfil%')
  LOOP
    EXECUTE format('ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS %I', r.conname);
    RAISE NOTICE 'Removida constraint: %', r.conname;
  END LOOP;
END $$;

-- Garantir que a nova constraint existe
ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_perfil_check;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_perfil_check
  CHECK (perfil IN (
    'nutri', 'wellness', 'coach', 'nutra', 'admin',
    'ylada', 'psi', 'psicanalise', 'odonto', 'med'
  ));
