-- =====================================================
-- SCRIPT DE DIAGNÓSTICO: deisefaula@gmail.com (Área Coach)
-- =====================================================
-- Execute este script no Supabase SQL Editor para diagnosticar o problema
-- =====================================================

-- 1. VERIFICAR USUÁRIO EM auth.users
SELECT 
  '1. AUTH.USERS' as verificacao,
  u.id as user_id,
  u.email as auth_email,
  u.email_confirmed_at,
  u.created_at as auth_created_at,
  u.last_sign_in_at,
  u.confirmed_at,
  CASE 
    WHEN u.email_confirmed_at IS NULL THEN '❌ EMAIL NÃO CONFIRMADO'
    ELSE '✅ Email confirmado'
  END as status_email,
  CASE 
    WHEN u.last_sign_in_at IS NULL THEN '❌ NUNCA FEZ LOGIN'
    ELSE CONCAT('✅ Último login: ', u.last_sign_in_at::text)
  END as status_login
FROM auth.users u
WHERE LOWER(TRIM(u.email)) = 'deisefaula@gmail.com';

-- 2. VERIFICAR PERFIL EM user_profiles
SELECT 
  '2. USER_PROFILES' as verificacao,
  up.user_id,
  up.email as profile_email,
  up.perfil,
  up.nome_completo,
  up.temporary_password_expires_at,
  up.created_at as profile_created_at,
  CASE 
    WHEN up.perfil IS NULL THEN '❌ PERFIL NÃO DEFINIDO'
    WHEN up.perfil != 'coach' THEN CONCAT('❌ PERFIL ERRADO: ', up.perfil, ' (deveria ser coach)')
    ELSE '✅ Perfil correto (coach)'
  END as status_perfil,
  CASE 
    WHEN up.temporary_password_expires_at IS NOT NULL 
      AND up.temporary_password_expires_at < NOW() 
    THEN '❌ SENHA PROVISÓRIA EXPIRADA'
    WHEN up.temporary_password_expires_at IS NOT NULL 
    THEN CONCAT('⚠️ Senha provisória válida até: ', up.temporary_password_expires_at::text)
    ELSE '✅ Sem senha provisória'
  END as status_senha_provisoria
FROM user_profiles up
WHERE LOWER(TRIM(up.email)) = 'deisefaula@gmail.com'
   OR up.user_id IN (
     SELECT id FROM auth.users WHERE LOWER(TRIM(email)) = 'deisefaula@gmail.com'
   );

-- 3. VERIFICAR ASSINATURAS
SELECT 
  '3. SUBSCRIPTIONS' as verificacao,
  s.user_id,
  s.area as subscription_area,
  s.status as subscription_status,
  s.current_period_end,
  s.created_at as subscription_created_at,
  CASE 
    WHEN s.status = 'active' AND s.area = 'coach' THEN '✅ Assinatura ativa na área Coach'
    WHEN s.status = 'active' THEN CONCAT('⚠️ Assinatura ativa em outra área: ', s.area)
    WHEN s.status IS NULL THEN '❌ SEM ASSINATURA'
    ELSE CONCAT('❌ Assinatura inativa: ', s.status)
  END as status_assinatura
FROM subscriptions s
WHERE s.user_id IN (
  SELECT id FROM auth.users WHERE LOWER(TRIM(email)) = 'deisefaula@gmail.com'
)
ORDER BY s.created_at DESC;

-- 4. VERIFICAR AUTORIZAÇÕES POR EMAIL
SELECT 
  '4. EMAIL_AUTHORIZATIONS' as verificacao,
  ea.email,
  ea.area as authorization_area,
  ea.status,
  ea.expires_in_days,
  ea.created_at as authorization_created_at,
  (ea.created_at + INTERVAL '1 day' * ea.expires_in_days) as calculado_valido_ate,
  CASE 
    WHEN ea.status = 'pending' 
      AND ea.area = 'coach' 
      AND (ea.created_at + INTERVAL '1 day' * ea.expires_in_days) > NOW()
    THEN '✅ Autorização pendente ativa na área Coach'
    WHEN ea.status = 'activated' 
      AND ea.area = 'coach'
    THEN '✅ Autorização já foi ativada na área Coach'
    WHEN ea.status = 'pending' 
      AND (ea.created_at + INTERVAL '1 day' * ea.expires_in_days) > NOW()
    THEN CONCAT('⚠️ Autorização pendente em outra área: ', ea.area)
    WHEN ea.status = 'expired' THEN '❌ AUTORIZAÇÃO EXPIRADA'
    WHEN ea.status = 'cancelled' THEN '❌ AUTORIZAÇÃO CANCELADA'
    WHEN (ea.created_at + INTERVAL '1 day' * ea.expires_in_days) < NOW() THEN '❌ AUTORIZAÇÃO EXPIRADA (por data)'
    ELSE CONCAT('⚠️ Status: ', ea.status)
  END as status_autorizacao
FROM email_authorizations ea
WHERE LOWER(TRIM(ea.email)) = 'deisefaula@gmail.com'
ORDER BY ea.created_at DESC;

-- 5. VERIFICAÇÃO COMPLETA (TUDO JUNTO)
SELECT 
  '5. VERIFICAÇÃO COMPLETA' as verificacao,
  u.id as user_id,
  u.email as auth_email,
  u.email_confirmed_at IS NOT NULL as email_confirmado,
  up.perfil,
  up.perfil = 'coach' as perfil_coach_correto,
  up.temporary_password_expires_at IS NULL 
    OR up.temporary_password_expires_at > NOW() as senha_provisoria_ok,
  s.status = 'active' AND s.area = 'coach' as tem_assinatura_coach,
  ea.status = 'pending' 
    AND ea.area = 'coach' 
    AND (ea.created_at + INTERVAL '1 day' * ea.expires_in_days) > NOW() as tem_autorizacao_coach,
  CASE 
    WHEN u.id IS NULL THEN '❌ USUÁRIO NÃO EXISTE EM auth.users'
    WHEN u.email_confirmed_at IS NULL THEN '❌ EMAIL NÃO CONFIRMADO'
    WHEN up.perfil IS NULL THEN '❌ PERFIL NÃO EXISTE EM user_profiles'
    WHEN up.perfil != 'coach' THEN CONCAT('❌ PERFIL ERRADO: ', up.perfil)
    WHEN up.temporary_password_expires_at IS NOT NULL 
      AND up.temporary_password_expires_at < NOW() 
    THEN '❌ SENHA PROVISÓRIA EXPIRADA'
    WHEN s.status != 'active' OR s.area != 'coach' THEN '⚠️ SEM ASSINATURA ATIVA NA ÁREA COACH'
    ELSE '✅ TUDO OK - DEVERIA FUNCIONAR'
  END as diagnostico_final
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
LEFT JOIN email_authorizations ea ON LOWER(ea.email) = LOWER(u.email) AND ea.status = 'pending'
WHERE LOWER(TRIM(u.email)) = 'deisefaula@gmail.com';

-- 6. VERIFICAR VARIAÇÕES DO EMAIL (caso tenha espaços ou maiúsculas)
SELECT 
  '6. VARIAÇÕES DO EMAIL' as verificacao,
  u.email as email_exato,
  LOWER(TRIM(u.email)) as email_normalizado,
  up.email as email_no_perfil,
  CASE 
    WHEN LOWER(TRIM(u.email)) != LOWER(TRIM(COALESCE(up.email, ''))) 
    THEN '⚠️ EMAIL DIFERENTE ENTRE auth.users E user_profiles'
    ELSE '✅ Emails coincidem'
  END as status_email
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE LOWER(TRIM(u.email)) LIKE '%deisefaula%'
   OR LOWER(TRIM(u.email)) LIKE '%deise%'
ORDER BY u.created_at DESC;

