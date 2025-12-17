-- =====================================================
-- VERIFICAR SE O EMAIL EXISTE
-- Email procurado: oanfaol@gmail.com
-- =====================================================

-- 1. Verificar se existe em auth.users
SELECT 
  'auth.users' as tabela,
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'oanfaol@gmail.com'
   OR email ILIKE '%oanfaol%';

-- 2. Verificar se existe em user_profiles
SELECT 
  'user_profiles' as tabela,
  user_id,
  email,
  nome_completo,
  perfil,
  diagnostico_completo
FROM user_profiles
WHERE email = 'oanfaol@gmail.com'
   OR email ILIKE '%oanfaol%';

-- 3. Buscar emails similares (pode ter typo)
SELECT 
  'Emails similares' as tipo,
  email,
  created_at
FROM auth.users
WHERE email ILIKE '%oan%'
   OR email ILIKE '%faol%'
ORDER BY email;

-- 4. Listar TODOS os emails de usuários Nutri
SELECT 
  au.email,
  au.created_at as data_cadastro,
  up.nome_completo,
  up.perfil
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE up.perfil = 'nutri' OR up.perfil IS NULL
ORDER BY au.email;


