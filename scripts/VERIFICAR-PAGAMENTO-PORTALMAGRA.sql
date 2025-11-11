-- =====================================================
-- VERIFICAÇÃO COMPLETA DO PAGAMENTO
-- E-mail: portalmagra@gmail.com
-- =====================================================

-- 1. VERIFICAR SE USUÁRIO FOI CRIADO
SELECT 
  '1. USUÁRIO' as verificacao,
  u.id as user_id,
  u.email,
  u.created_at as user_created_at,
  u.email_confirmed_at,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ Usuário criado'
    ELSE '❌ Usuário NÃO criado'
  END as status
FROM auth.users u
WHERE u.email = 'portalmagra@gmail.com'
ORDER BY u.created_at DESC
LIMIT 1;

-- 2. VERIFICAR SE PERFIL FOI CRIADO
SELECT 
  '2. PERFIL' as verificacao,
  up.id as profile_id,
  up.user_id,
  up.nome_completo,
  up.perfil,
  up.email,
  up.created_at as profile_created_at,
  CASE 
    WHEN up.id IS NOT NULL THEN '✅ Perfil criado'
    ELSE '❌ Perfil NÃO criado'
  END as status
FROM user_profiles up
WHERE up.email = 'portalmagra@gmail.com'
ORDER BY up.created_at DESC
LIMIT 1;

-- 3. VERIFICAR SE SUBSCRIPTION FOI CRIADA
SELECT 
  '3. SUBSCRIPTION' as verificacao,
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount,
  s.currency,
  s.welcome_email_sent,
  s.welcome_email_sent_at,
  s.created_at,
  CASE 
    WHEN s.id IS NOT NULL THEN '✅ Subscription criada'
    ELSE '❌ Subscription NÃO criada'
  END as status
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.user_id
WHERE up.email = 'portalmagra@gmail.com'
ORDER BY s.created_at DESC
LIMIT 1;

-- 4. VERIFICAR SE PAGAMENTO FOI REGISTRADO
SELECT 
  '4. PAGAMENTO' as verificacao,
  p.id as payment_id,
  p.subscription_id,
  p.user_id,
  p.amount,
  p.currency,
  p.status,
  p.payment_method,
  p.created_at,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Pagamento registrado'
    ELSE '❌ Pagamento NÃO registrado'
  END as status
FROM payments p
JOIN user_profiles up ON p.user_id = up.user_id
WHERE up.email = 'portalmagra@gmail.com'
ORDER BY p.created_at DESC
LIMIT 1;

-- 5. VERIFICAR TODAS AS SUBSCRIPTIONS RECENTES (ÚLTIMAS 24H)
SELECT 
  '5. SUBSCRIPTIONS RECENTES' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.welcome_email_sent,
  s.welcome_email_sent_at,
  s.created_at,
  up.email,
  up.nome_completo,
  CASE 
    WHEN s.welcome_email_sent = true THEN '✅ E-mail enviado'
    WHEN s.welcome_email_sent = false THEN '❌ E-mail NÃO enviado'
    ELSE '⚠️ Status desconhecido'
  END as email_status
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY s.created_at DESC;

-- 6. VERIFICAR TODOS OS USUÁRIOS CRIADOS RECENTEMENTE (ÚLTIMAS 24H)
SELECT 
  '6. USUÁRIOS RECENTES' as verificacao,
  u.id as user_id,
  u.email,
  u.created_at,
  up.id as profile_id,
  up.nome_completo,
  CASE 
    WHEN up.id IS NOT NULL THEN '✅ Tem perfil'
    ELSE '❌ SEM perfil'
  END as tem_perfil
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY u.created_at DESC;

