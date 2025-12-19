-- =====================================================
-- CORRIGIR FOREIGN KEY DE leads.user_id
-- =====================================================
-- PROBLEMA: leads.user_id está referenciando tabela 'users' customizada
-- SOLUÇÃO: Alterar para referenciar auth.users (Supabase Auth)
-- =====================================================

-- Sempre remover a constraint existente (se houver) e recriar corretamente
DO $$
DECLARE
  constraint_name_found TEXT;
BEGIN
  -- Buscar o nome exato da constraint (pode variar)
  SELECT tc.constraint_name
  INTO constraint_name_found
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
  WHERE tc.table_name = 'leads'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'user_id'
  LIMIT 1;

  -- Se encontrou uma constraint, remover
  IF constraint_name_found IS NOT NULL THEN
    EXECUTE format('ALTER TABLE leads DROP CONSTRAINT IF EXISTS %I', constraint_name_found);
    RAISE NOTICE 'Constraint removida: %', constraint_name_found;
  END IF;

  -- Criar nova constraint apontando para auth.users
  ALTER TABLE leads
  ADD CONSTRAINT leads_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

  RAISE NOTICE '✅ Foreign key criada: leads.user_id referencia auth.users(id)';
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Constraint já existe, pulando criação';
END $$;

-- Verificar resultado
SELECT 
  'Verificação da Foreign Key' as info,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_schema || '.' || ccu.table_name as referencia
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'leads'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'user_id';
