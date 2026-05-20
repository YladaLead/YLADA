-- =====================================================
-- VERIFICAR CONSTRAINT E PROBLEMAS COM user_id
-- =====================================================

-- 1. VERIFICAR SE EXISTE CONSTRAINT UNIQUE EM user_id
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.user_profiles'::regclass
  AND (conname LIKE '%user_id%' OR contype = 'u')
ORDER BY contype, conname;

-- 2. VERIFICAR SE HÁ REGISTROS COM user_id NULL
SELECT 
  COUNT(*) as total_registros,
  COUNT(user_id) as com_user_id,
  COUNT(*) FILTER (WHERE user_id IS NULL) as sem_user_id
FROM user_profiles;

-- 3. VER REGISTROS SEM user_id (PROBLEMA!)
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

-- 4. VERIFICAR SE NAYARA E CLAUDINEI TÊM user_id CORRETO
SELECT 
  au.email,
  au.id as auth_user_id,
  up.id as profile_id,
  up.user_id as profile_user_id,
  up.nome_completo,
  up.whatsapp,
  CASE 
    WHEN up.user_id IS NULL THEN '❌ SEM user_id (PROBLEMA!)'
    WHEN up.user_id = au.id THEN '✅ user_id CORRETO'
    WHEN up.user_id != au.id THEN '⚠️ user_id DIFERENTE'
    ELSE '❓ Status desconhecido'
  END as status
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'naytenutri@gmail.com',
  'claubemestar@gmail.com'
)
ORDER BY au.email;

-- 5. CRIAR CONSTRAINT UNIQUE SE NÃO EXISTIR
-- Execute apenas se a query 1 não mostrar constraint UNIQUE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conrelid = 'public.user_profiles'::regclass
      AND conname = 'user_profiles_user_id_key'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
    RAISE NOTICE '✅ Constraint UNIQUE criada em user_id';
  ELSE
    RAISE NOTICE '✅ Constraint UNIQUE já existe em user_id';
  END IF;
END $$;

-- 6. VERIFICAR SE HÁ DUPLICATAS DE user_id (problema!)
SELECT 
  user_id,
  COUNT(*) as quantidade
FROM user_profiles
WHERE user_id IS NOT NULL
GROUP BY user_id
HAVING COUNT(*) > 1;

