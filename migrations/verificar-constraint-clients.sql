-- =====================================================
-- VERIFICAR CONSTRAINT DE clients.user_id
-- =====================================================
-- Execute este script para ver qual tabela clients referencia
-- =====================================================

SELECT 
  'Foreign Key de clients.user_id:' as info,
  tc.constraint_name,
  tc.table_schema AS schema_tabela,
  tc.table_name AS tabela,
  kcu.column_name AS coluna,
  ccu.table_schema AS schema_referenciado,
  ccu.table_name AS tabela_referenciada,
  ccu.column_name AS coluna_referenciada
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'clients'
  AND kcu.column_name = 'user_id';

-- Verificar se existe tabela users customizada
SELECT 
  'Tabela users customizada:' as info,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users')
    THEN 'EXISTE'
    ELSE 'NÃO EXISTE'
  END as status;

-- Verificar user_profiles
SELECT 
  'user_profiles:' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN perfil = 'nutri' THEN 1 END) as nutri
FROM user_profiles;

-- Verificar se o user_id de user_profiles existe na tabela users (se existir)
SELECT 
  'user_profiles.user_id em users:' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN u.id IS NOT NULL THEN 1 END) as existe_em_users
FROM user_profiles up
LEFT JOIN users u ON up.user_id = u.id
WHERE up.perfil = 'nutri';


