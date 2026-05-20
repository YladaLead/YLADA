-- =====================================================
-- DIAGNOSTICAR PROBLEMA DE SALVAMENTO
-- =====================================================

-- 1. VERIFICAR SE HÁ REGISTROS COM user_id NULL
SELECT 
  COUNT(*) as total_registros,
  COUNT(user_id) as com_user_id,
  COUNT(*) FILTER (WHERE user_id IS NULL) as sem_user_id,
  '⚠️ Se sem_user_id > 0, há registros órfãos' as observacao
FROM user_profiles;

-- 2. VER REGISTROS SEM user_id (problema!)
SELECT 
  id,
  email,
  nome_completo,
  whatsapp,
  perfil,
  created_at
FROM user_profiles
WHERE user_id IS NULL
ORDER BY created_at DESC;

-- 3. VERIFICAR SE NAYARA E CLAUDINEI TÊM user_id
SELECT 
  au.email,
  au.id as auth_user_id,
  up.id as profile_id,
  up.user_id,
  up.nome_completo,
  up.whatsapp,
  CASE 
    WHEN up.user_id IS NULL THEN '❌ SEM user_id (PROBLEMA!)'
    WHEN up.user_id = au.id THEN '✅ user_id CORRETO'
    ELSE '⚠️ user_id DIFERENTE'
  END as status_user_id
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'naytenutri@gmail.com',
  'claubemestar@gmail.com'
)
ORDER BY au.email;

-- 4. VERIFICAR RLS (Row Level Security) - Se está bloqueando
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 5. VERIFICAR SE HÁ CONSTRAINTS QUE PODEM BLOQUEAR
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.user_profiles'::regclass
ORDER BY contype, conname;

-- 6. TESTAR SE CONSEGUE INSERIR/ATUALIZAR (simular)
-- Execute isso manualmente se necessário:
-- INSERT INTO user_profiles (user_id, nome_completo, whatsapp, perfil) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'TESTE', '5519999999999', 'wellness')
-- ON CONFLICT (user_id) DO UPDATE SET nome_completo = EXCLUDED.nome_completo;

