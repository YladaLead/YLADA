-- =====================================================
-- DIAGNÓSTICO: Recuperação de senha não funciona
-- Usuário: sdankfort@gmail.com
-- =====================================================
-- Execute no Supabase SQL Editor e verifique cada bloco.
-- Se algo falhar ou retornar vazio onde não deveria, esse é o motivo do e-mail não chegar.
-- =====================================================

-- 1. O usuário existe em auth.users?
SELECT 
  '1. auth.users' as passo,
  id as user_id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email ILIKE 'sdankfort@gmail.com';

-- Se retornar 0 linhas: o usuário não está no Auth (cadastro incompleto ou email diferente).

-- 2. Existe perfil em user_profiles com esse e-mail?
SELECT 
  '2. user_profiles' as passo,
  id,
  user_id,
  email,
  nome_completo,
  perfil,
  updated_at
FROM user_profiles
WHERE email ILIKE 'sdankfort@gmail.com'
ORDER BY updated_at DESC;

-- Se retornar 0 linhas: a rota de recuperação não encontra ninguém e não envia e-mail.
-- Se retornar 2+ linhas: duplicatas podem fazer .maybeSingle() falhar (corrigido no código com limit(1)).

-- 3. O user_id do perfil bate com auth.users?
SELECT 
  '3. conferência auth vs perfil' as passo,
  au.id as auth_id,
  au.email as auth_email,
  up.user_id as profile_user_id,
  up.email as profile_email,
  up.perfil,
  CASE WHEN au.id = up.user_id THEN 'OK' ELSE 'ERRO: user_id diferente' END as status
FROM auth.users au
LEFT JOIN user_profiles up ON up.email ILIKE au.email
WHERE au.email ILIKE 'sdankfort@gmail.com';

-- 4. Há duplicatas por email? (vários perfis com o mesmo email)
SELECT 
  '4. duplicatas por email' as passo,
  email,
  COUNT(*) as total_registros,
  STRING_AGG(user_id::text, ', ') as user_ids
FROM user_profiles
WHERE email ILIKE 'sdankfort@gmail.com'
GROUP BY email
HAVING COUNT(*) > 1;

-- Se retornar linhas: há duplicatas; o código atual usa limit(1) para pegar um perfil mesmo assim.

-- 5. Resumo: o usuário está “encontrável” para a rota de recuperação?
SELECT 
  '5. resumo' as passo,
  (SELECT COUNT(*) FROM auth.users WHERE email ILIKE 'sdankfort@gmail.com') as em_auth,
  (SELECT COUNT(*) FROM user_profiles WHERE email ILIKE 'sdankfort@gmail.com') as em_user_profiles;

-- Para funcionar: em_auth >= 1 e em_user_profiles >= 1.
-- Se em_user_profiles = 0: criar/ajustar perfil (user_id = id do auth.users, email = sdankfort@gmail.com).
