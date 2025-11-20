-- =====================================================
-- VERIFICAR ESTRUTURA DE USUÁRIOS
-- =====================================================
-- Execute este script para verificar qual estrutura está sendo usada
-- =====================================================

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
  'Tabela user_profiles:' as info,
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN perfil = 'nutri' THEN 1 END) as usuarios_nutri
FROM user_profiles;

-- Verificar auth.users (se tiver acesso)
SELECT 
  'auth.users:' as info,
  COUNT(*) as total
FROM auth.users;

-- Verificar qual tabela a tabela clients referencia
SELECT 
  'Foreign Key de clients.user_id:' as info,
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

-- Listar user_ids disponíveis de user_profiles com perfil nutri
SELECT 
  'User IDs disponíveis (perfil nutri):' as info,
  user_id,
  email,
  nome_completo,
  perfil,
  created_at
FROM user_profiles
WHERE perfil = 'nutri'
ORDER BY created_at;


