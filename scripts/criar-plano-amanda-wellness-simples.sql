-- =====================================================
-- CRIAR PLANO GRATUITO AMANDA BONFOGO - WELLNESS
-- Versão Simples - Execute no Supabase SQL Editor
-- =====================================================

-- PASSO 1: Verificar se usuário existe
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
WHERE email = 'amandabonfogo01@gmail.com';

-- Se não retornar nada, você precisa criar o usuário primeiro pela interface admin
-- ou usar o script completo criar-plano-gratuito-amanda-wellness.sql

-- PASSO 2: Criar/verificar perfil (substitua USER_ID_AQUI pelo ID do passo 1)
-- Se não souber o user_id, execute o PASSO 1 primeiro

INSERT INTO user_profiles (
  user_id,
  nome_completo,
  email,
  perfil,
  created_at
)
SELECT 
  id,
  'Amanda Bonfogo',
  'amandabonfogo01@gmail.com',
  'wellness',
  NOW()
FROM auth.users
WHERE email = 'amandabonfogo01@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  nome_completo = EXCLUDED.nome_completo;

-- PASSO 3: Cancelar assinatura antiga em Wellness (se existir)
UPDATE subscriptions
SET 
  status = 'canceled',
  canceled_at = NOW(),
  updated_at = NOW()
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'amandabonfogo01@gmail.com'
)
AND area = 'wellness'
AND status = 'active'
AND current_period_end > NOW();

-- PASSO 4: Criar nova assinatura gratuita
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  status,
  current_period_start,
  current_period_end,
  stripe_account,
  stripe_subscription_id,
  stripe_customer_id,
  stripe_price_id,
  amount,
  currency,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'wellness',
  'free',
  'active',
  NOW(),
  NOW() + INTERVAL '365 days',
  'br',
  'free_' || u.id::text || '_wellness_' || EXTRACT(EPOCH FROM NOW())::bigint,
  'free_' || u.id::text,
  'free',
  0,
  'brl',
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'amandabonfogo01@gmail.com';

-- PASSO 5: Verificar resultado
SELECT 
  u.email,
  up.nome_completo,
  up.perfil as area_perfil,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.amount,
  s.currency,
  CASE 
    WHEN s.current_period_end > NOW() AND s.status = 'active' THEN '✅ ATIVA'
    ELSE '⚠️ INATIVA'
  END as situacao
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.area = 'wellness'
WHERE u.email = 'amandabonfogo01@gmail.com'
ORDER BY s.created_at DESC
LIMIT 1;

