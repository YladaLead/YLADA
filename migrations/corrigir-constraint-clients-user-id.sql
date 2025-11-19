-- =====================================================
-- CORRIGIR CONSTRAINT DE clients.user_id
-- =====================================================
-- Este script corrige a foreign key de clients.user_id
-- para referenciar auth.users ao invés de users (se necessário)
-- =====================================================

-- =====================================================
-- PARTE 1: VERIFICAR SITUAÇÃO ATUAL
-- =====================================================

SELECT 
  'Situação atual:' as info,
  tc.constraint_name,
  ccu.table_schema AS schema_referenciado,
  ccu.table_name AS tabela_referenciada
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'clients'
  AND kcu.column_name = 'user_id';

-- =====================================================
-- PARTE 2: CORRIGIR CONSTRAINT
-- =====================================================

-- Remover constraint antiga se existir
ALTER TABLE clients 
DROP CONSTRAINT IF EXISTS clients_user_id_fkey;

-- Adicionar nova constraint apontando para auth.users
ALTER TABLE clients
ADD CONSTRAINT clients_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- =====================================================
-- PARTE 3: VERIFICAR SE FOI APLICADO
-- =====================================================

SELECT 
  '✅ Constraint corrigida:' as info,
  tc.constraint_name,
  ccu.table_schema AS schema_referenciado,
  ccu.table_name AS tabela_referenciada,
  ccu.column_name AS coluna_referenciada
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'clients'
  AND kcu.column_name = 'user_id';

