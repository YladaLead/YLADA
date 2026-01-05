-- ============================================
-- DIAGNÓSTICO: Irene - Erro ao salvar perfil
-- ============================================
-- Este script verifica o perfil da usuária Irene
-- para identificar possíveis problemas de autenticação ou perfil
--
-- NOTA: No Supabase, os metadados do usuário estão em raw_user_meta_data
-- (não user_metadata)

-- 1. Buscar usuário por nome "Irene" (pode precisar ajustar o nome)
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at,
  raw_user_meta_data->>'full_name' as nome_completo,
  raw_user_meta_data
FROM auth.users
WHERE 
  email ILIKE '%irene%' 
  OR raw_user_meta_data->>'full_name' ILIKE '%irene%'
  OR raw_user_meta_data->>'name' ILIKE '%irene%'
ORDER BY created_at DESC;

-- 2. Verificar perfil completo da Irene (substituir USER_ID pelo ID encontrado acima)
-- Substitua 'USER_ID_AQUI' pelo ID do usuário encontrado na query acima
/*
SELECT 
  up.id,
  up.user_id,
  up.nome_completo,
  up.email,
  up.perfil,
  up.profession,
  up.is_active,
  up.is_admin,
  up.is_support,
  up.whatsapp,
  up.user_slug,
  up.temporary_password_expires_at,
  up.country_code,
  up.bio,
  up.created_at,
  up.updated_at,
  au.email as auth_email,
  au.last_sign_in_at,
  au.email_confirmed_at
FROM user_profiles up
LEFT JOIN auth.users au ON au.id = up.user_id
WHERE up.user_id = 'USER_ID_AQUI'::uuid
  OR up.email ILIKE '%irene%'
  OR up.nome_completo ILIKE '%irene%';
*/

-- 3. Verificar assinatura wellness da Irene
/*
SELECT 
  s.id,
  s.user_id,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.canceled_at,
  s.created_at,
  up.nome_completo,
  up.email
FROM subscriptions s
JOIN user_profiles up ON up.user_id = s.user_id
WHERE 
  (up.email ILIKE '%irene%' OR up.nome_completo ILIKE '%irene%')
  AND s.area = 'wellness'
ORDER BY s.created_at DESC;
*/

-- 4. Verificar se há múltiplos perfis (pode causar conflito)
/*
SELECT 
  user_id,
  COUNT(*) as total_perfis,
  STRING_AGG(perfil, ', ') as perfis,
  STRING_AGG(id::text, ', ') as profile_ids
FROM user_profiles
WHERE user_id IN (
  SELECT user_id FROM user_profiles 
  WHERE email ILIKE '%irene%' OR nome_completo ILIKE '%irene%'
)
GROUP BY user_id
HAVING COUNT(*) > 1;
*/

-- 5. Verificar sessões ativas recentes
/*
SELECT 
  id,
  user_id,
  created_at,
  updated_at,
  factor_id,
  aal,
  not_after
FROM auth.sessions
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email ILIKE '%irene%' 
    OR raw_user_meta_data->>'full_name' ILIKE '%irene%'
    OR raw_user_meta_data->>'name' ILIKE '%irene%'
)
ORDER BY updated_at DESC
LIMIT 10;
*/

-- 6. Verificar se o perfil está correto para wellness
/*
SELECT 
  up.user_id,
  up.perfil,
  up.is_active,
  up.is_admin,
  up.is_support,
  CASE 
    WHEN up.perfil = 'wellness' THEN '✅ Perfil correto'
    WHEN up.perfil IS NULL THEN '❌ Perfil NULL - precisa ser definido'
    WHEN up.perfil != 'wellness' THEN '❌ Perfil incorreto: ' || up.perfil
    ELSE '⚠️ Verificar'
  END as status_perfil,
  CASE 
    WHEN up.is_active = true THEN '✅ Ativo'
    ELSE '❌ Inativo'
  END as status_ativo
FROM user_profiles up
WHERE up.user_id IN (
  SELECT id FROM auth.users 
  WHERE email ILIKE '%irene%' 
    OR raw_user_meta_data->>'full_name' ILIKE '%irene%'
    OR raw_user_meta_data->>'name' ILIKE '%irene%'
);
*/

-- 7. CORREÇÃO: Limpar expiração de senha provisória (se estiver bloqueando o login)
-- Caso o erro "Sua senha provisória expirou" apareça mesmo após ela já ter criado a senha definitiva
/*
UPDATE user_profiles
SET temporary_password_expires_at = NULL
WHERE user_id = 'USER_ID_AQUI'::uuid
  OR email = 'irene.s@hotmail.com';
*/

