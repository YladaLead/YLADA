-- =====================================================
-- SCRIPT: Diagnóstico Completo - Monica Login Wellness
-- =====================================================
-- Problema: Monica não consegue avançar na área wellness
-- Mesmo após login, ainda pede para fazer login
-- =====================================================

-- 1. Verificar usuário no auth.users
SELECT 
  '1. AUTH.USERS' as verificacao,
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmado,
  created_at,
  last_sign_in_at,
  updated_at,
  banned_until IS NULL as usuario_nao_banido,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ Email não confirmado'
    WHEN banned_until IS NOT NULL THEN '❌ Usuário banido'
    ELSE '✅ OK'
  END as status
FROM auth.users
WHERE email = 'mmg.monica@hotmail.com';

-- 2. Verificar perfil completo
SELECT 
  '2. USER_PROFILES' as verificacao,
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  up.created_at,
  up.updated_at,
  CASE 
    WHEN up.perfil IS NULL THEN '❌ Sem perfil'
    WHEN up.perfil != 'wellness' THEN '⚠️ Perfil incorreto: ' || up.perfil
    ELSE '✅ Perfil wellness OK'
  END as status_perfil
FROM user_profiles up
WHERE up.email = 'mmg.monica@hotmail.com';

-- 3. Verificar assinatura wellness
SELECT 
  '3. ASSINATURA WELLNESS' as verificacao,
  s.id,
  s.user_id,
  s.status,
  s.area,
  s.plan_type,
  s.current_period_start,
  s.current_period_end,
  s.canceled_at,
  NOW() as agora,
  CASE 
    WHEN s.id IS NULL THEN '❌ Sem assinatura wellness'
    WHEN s.status != 'active' THEN '❌ Assinatura não está ativa: ' || s.status
    WHEN s.area != 'wellness' THEN '⚠️ Assinatura de outra área: ' || s.area
    WHEN s.current_period_end < NOW() THEN '❌ Assinatura expirada'
    WHEN s.canceled_at IS NOT NULL THEN '❌ Assinatura cancelada'
    ELSE '✅ Assinatura wellness ativa'
  END as status_assinatura
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
LEFT JOIN subscriptions s ON s.user_id = au.id AND s.area = 'wellness'
WHERE up.email = 'mmg.monica@hotmail.com';

-- 4. Verificar se há múltiplos perfis (pode causar conflito)
SELECT 
  '4. MULTIPLOS PERFIS' as verificacao,
  COUNT(*) as total_perfis,
  STRING_AGG(DISTINCT perfil::text, ', ') as perfis_encontrados,
  CASE 
    WHEN COUNT(*) > 1 THEN '⚠️ MÚLTIPLOS PERFIS - PODE CAUSAR CONFLITO'
    WHEN COUNT(*) = 0 THEN '❌ SEM PERFIL'
    ELSE '✅ Um único perfil'
  END as status
FROM user_profiles
WHERE email = 'mmg.monica@hotmail.com'
   OR user_id = (SELECT id FROM auth.users WHERE email = 'mmg.monica@hotmail.com');

-- 5. Verificar se há múltiplas assinaturas wellness
SELECT 
  '5. MULTIPLAS ASSINATURAS WELLNESS' as verificacao,
  COUNT(*) as total_assinaturas,
  STRING_AGG(DISTINCT status::text, ', ') as status_encontrados,
  CASE 
    WHEN COUNT(*) > 1 THEN '⚠️ MÚLTIPLAS ASSINATURAS - PODE CAUSAR CONFLITO'
    WHEN COUNT(*) = 0 THEN '❌ SEM ASSINATURA'
    ELSE '✅ Uma única assinatura'
  END as status
FROM subscriptions s
WHERE s.user_id = (SELECT id FROM auth.users WHERE email = 'mmg.monica@hotmail.com')
  AND s.area = 'wellness';

-- 6. Verificar sessões ativas no Supabase (se possível)
-- Nota: Esta query pode não funcionar dependendo das permissões
SELECT 
  '6. ÚLTIMO LOGIN' as verificacao,
  au.email,
  au.last_sign_in_at,
  au.updated_at,
  NOW() - au.last_sign_in_at as tempo_desde_login,
  CASE 
    WHEN au.last_sign_in_at IS NULL THEN '❌ Nunca fez login'
    WHEN NOW() - au.last_sign_in_at > INTERVAL '7 days' THEN '⚠️ Login há mais de 7 dias'
    WHEN NOW() - au.last_sign_in_at > INTERVAL '1 day' THEN '⚠️ Login há mais de 1 dia'
    ELSE '✅ Login recente'
  END as status_login
FROM auth.users au
WHERE au.email = 'mmg.monica@hotmail.com';

-- 7. Verificar bloqueios de rate limit
SELECT 
  '7. RATE LIMIT' as verificacao,
  nrl.id,
  nrl.user_id,
  nrl.is_blocked,
  nrl.blocked_until,
  nrl.created_at,
  CASE 
    WHEN nrl.is_blocked = true AND nrl.blocked_until > NOW() THEN '🔴 BLOQUEADO AGORA'
    WHEN nrl.is_blocked = true AND nrl.blocked_until <= NOW() THEN '⏰ BLOQUEIO EXPIRADO'
    WHEN nrl.id IS NULL THEN '✅ Sem bloqueios'
    ELSE '✅ NORMAL'
  END as status_rate_limit
FROM auth.users au
LEFT JOIN noel_rate_limits nrl ON nrl.user_id = au.id
WHERE au.email = 'mmg.monica@hotmail.com'
ORDER BY nrl.created_at DESC
LIMIT 5;

-- 8. Verificar perfil NOEL
SELECT 
  '8. PERFIL NOEL' as verificacao,
  wnp.id,
  wnp.user_id,
  wnp.onboarding_completo,
  wnp.created_at,
  CASE 
    WHEN wnp.id IS NULL THEN '⚠️ Sem perfil NOEL (mas não é obrigatório)'
    ELSE '✅ Tem perfil NOEL'
  END as status_noel
FROM auth.users au
LEFT JOIN wellness_noel_profile wnp ON wnp.user_id = au.id
WHERE au.email = 'mmg.monica@hotmail.com';

-- 9. RESUMO FINAL - Verificar tudo junto
SELECT 
  '9. RESUMO FINAL' as verificacao,
  au.email,
  au.email_confirmed_at IS NOT NULL as email_ok,
  up.perfil = 'wellness' as perfil_ok,
  s.status = 'active' AND s.area = 'wellness' AND s.current_period_end > NOW() as assinatura_ok,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN '❌ Email não confirmado'
    WHEN up.perfil IS NULL THEN '❌ Sem perfil'
    WHEN up.perfil != 'wellness' THEN '❌ Perfil incorreto: ' || up.perfil
    WHEN s.id IS NULL THEN '❌ Sem assinatura wellness'
    WHEN s.status != 'active' THEN '❌ Assinatura não ativa'
    WHEN s.current_period_end < NOW() THEN '❌ Assinatura expirada'
    ELSE '✅ TUDO OK NO BANCO - PROBLEMA DEVE SER NO NAVEGADOR/COOKIES'
  END as diagnostico_final
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
LEFT JOIN subscriptions s ON s.user_id = au.id AND s.area = 'wellness'
WHERE au.email = 'mmg.monica@hotmail.com';
