-- =====================================================
-- VERIFICAÇÃO COMPLETA DO USUÁRIO: oanfaol@gmail.com
-- Verifica se existe, se foi deletado, migrado, etc.
-- =====================================================

-- 1. VERIFICAR EM auth.users (tabela principal de autenticação)
SELECT 
  'auth.users' as origem,
  id as user_id,
  email,
  email_confirmed_at,
  created_at as data_criacao,
  last_sign_in_at as ultimo_login,
  deleted_at as data_delecao,
  CASE 
    WHEN deleted_at IS NOT NULL THEN '❌ DELETADO'
    WHEN email_confirmed_at IS NULL THEN '⚠️ EMAIL NÃO CONFIRMADO'
    ELSE '✅ ATIVO'
  END as status
FROM auth.users
WHERE LOWER(TRIM(email)) = LOWER(TRIM('oanfaol@gmail.com'))
   OR email ILIKE '%oanfaol%'
ORDER BY created_at DESC;

-- 2. VERIFICAR EM user_profiles (perfil do usuário)
SELECT 
  'user_profiles' as origem,
  user_id,
  email as profile_email,
  nome_completo,
  perfil,
  created_at as data_criacao,
  updated_at as ultima_atualizacao
FROM user_profiles
WHERE LOWER(TRIM(email)) = LOWER(TRIM('oanfaol@gmail.com'))
   OR email ILIKE '%oanfaol%'
ORDER BY created_at DESC;

-- 3. VERIFICAR ASSINATURAS (subscriptions)
SELECT 
  'subscriptions' as origem,
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.status,
  s.created_at,
  s.updated_at,
  au.email as email_auth
FROM subscriptions s
LEFT JOIN auth.users au ON au.id = s.user_id
WHERE LOWER(TRIM(au.email)) = LOWER(TRIM('oanfaol@gmail.com'))
   OR au.email ILIKE '%oanfaol%'
ORDER BY s.created_at DESC;

-- 4. VERIFICAR SE HÁ USUÁRIOS DELETADOS (soft delete)
SELECT 
  'usuarios_deletados' as origem,
  id,
  email,
  deleted_at,
  created_at,
  EXTRACT(DAY FROM (NOW() - deleted_at)) as dias_desde_delecao
FROM auth.users
WHERE deleted_at IS NOT NULL
  AND (LOWER(TRIM(email)) = LOWER(TRIM('oanfaol@gmail.com'))
       OR email ILIKE '%oanfaol%')
ORDER BY deleted_at DESC;

-- 5. BUSCAR EMAILS SIMILARES (pode ter typo ou variação)
SELECT 
  'emails_similares' as tipo,
  au.id,
  au.email as email_auth,
  up.email as email_profile,
  up.nome_completo,
  up.perfil,
  au.created_at,
  CASE 
    WHEN au.deleted_at IS NOT NULL THEN '❌ DELETADO'
    WHEN up.user_id IS NULL THEN '⚠️ SEM PERFIL'
    ELSE '✅ OK'
  END as status
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
WHERE au.email ILIKE '%oan%'
   OR au.email ILIKE '%faol%'
   OR up.email ILIKE '%oan%'
   OR up.email ILIKE '%faol%'
ORDER BY au.created_at DESC;

-- 6. VERIFICAR HISTÓRICO COMPLETO (JOIN completo)
SELECT 
  'historico_completo' as tipo,
  au.id as user_id,
  au.email as email_auth,
  au.email_confirmed_at,
  au.created_at as auth_created,
  au.deleted_at as auth_deleted,
  up.email as email_profile,
  up.nome_completo,
  up.perfil,
  s.area as subscription_area,
  s.status as subscription_status,
  CASE 
    WHEN au.deleted_at IS NOT NULL THEN '❌ DELETADO EM AUTH'
    WHEN up.user_id IS NULL THEN '⚠️ SEM PERFIL'
    WHEN s.id IS NULL THEN '⚠️ SEM ASSINATURA'
    WHEN s.status != 'active' THEN '⚠️ ASSINATURA INATIVA'
    ELSE '✅ OK'
  END as status_geral
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
LEFT JOIN subscriptions s ON s.user_id = au.id AND s.status = 'active'
WHERE LOWER(TRIM(au.email)) = LOWER(TRIM('oanfaol@gmail.com'))
   OR LOWER(TRIM(up.email)) = LOWER(TRIM('oanfaol@gmail.com'))
ORDER BY au.created_at DESC;

-- 7. CONTAR TOTAL DE USUÁRIOS POR ÁREA (contexto)
SELECT 
  up.perfil as area,
  COUNT(DISTINCT au.id) as total_usuarios,
  COUNT(DISTINCT CASE WHEN au.deleted_at IS NULL THEN au.id END) as usuarios_ativos,
  COUNT(DISTINCT CASE WHEN au.deleted_at IS NOT NULL THEN au.id END) as usuarios_deletados
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
GROUP BY up.perfil
ORDER BY total_usuarios DESC;
