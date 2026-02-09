-- =====================================================
-- DIAGNÓSTICO: Ana Paula Rodrigues (anarodriguespr10@gmail.com)
-- Pagamento aprovado no MP (transação 144868205799) mas aparece "Nunca assinou"
-- =====================================================

-- 1. USUÁRIO EM auth.users
SELECT 
  'auth.users' as origem,
  id as user_id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE LOWER(email) = LOWER('anarodriguespr10@gmail.com');

-- 2. PERFIL EM user_profiles
SELECT 
  'user_profiles' as origem,
  up.id as profile_id,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil as area,
  up.created_at
FROM user_profiles up
WHERE LOWER(up.email) = LOWER('anarodriguespr10@gmail.com')
   OR up.user_id IN (SELECT id FROM auth.users WHERE LOWER(email) = LOWER('anarodriguespr10@gmail.com'));

-- 3. ASSINATURAS (subscriptions) para este usuário
SELECT 
  'subscriptions' as origem,
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.amount,
  s.stripe_subscription_id,
  s.created_at
FROM subscriptions s
WHERE s.user_id IN (SELECT id FROM auth.users WHERE LOWER(email) = LOWER('anarodriguespr10@gmail.com'))
ORDER BY s.created_at DESC;

-- 4. PAGAMENTOS (payments) - por user_id ou pelo ID do MP (144868205799)
SELECT 
  'payments' as origem,
  p.id as payment_id,
  p.user_id,
  p.subscription_id,
  p.stripe_payment_intent_id as mp_payment_id,
  p.amount,
  p.status,
  p.created_at
FROM payments p
WHERE p.user_id IN (SELECT id FROM auth.users WHERE LOWER(email) = LOWER('anarodriguespr10@gmail.com'))
   OR p.stripe_payment_intent_id = '144868205799'
ORDER BY p.created_at DESC;

-- 5. RESUMO (igual à tela de admin)
SELECT 
  au.id as user_id,
  au.email,
  up.nome_completo,
  up.perfil as area,
  (SELECT COUNT(*) FROM subscriptions s 
   WHERE s.user_id = au.id AND s.area = COALESCE(up.perfil, 'nutri')) as total_assinaturas,
  (SELECT COUNT(*) FROM subscriptions s 
   WHERE s.user_id = au.id AND s.area = COALESCE(up.perfil, 'nutri') 
     AND s.status = 'active' 
     AND s.current_period_end > NOW()) as assinaturas_ativas
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
WHERE LOWER(au.email) = LOWER('anarodriguespr10@gmail.com');
