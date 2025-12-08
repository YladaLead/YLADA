-- =====================================================
-- VERSÃO SIMPLIFICADA - CONVERTER PARA ASSINATURA PAGA
-- ÉRIKA CREMMER - evsnutrivibe@gmail.com
-- =====================================================

-- Passo 1: Cancelar assinatura gratuita (se houver)
UPDATE subscriptions
SET 
  status = 'canceled',
  canceled_at = NOW(),
  updated_at = NOW()
WHERE user_id IN (
  SELECT id FROM auth.users WHERE LOWER(email) = LOWER('evsnutrivibe@gmail.com')
)
AND area = 'wellness'
AND status = 'active';

-- Passo 2: Atualizar ou criar assinatura ANUAL PAGA
-- Primeiro, tentar atualizar se já existe (mesmo cancelada)
UPDATE subscriptions s
SET 
  plan_type = 'annual',
  status = 'active',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '12 months',
  stripe_account = 'br',
  stripe_subscription_id = 'mp_annual_' || s.user_id::text || '_' || EXTRACT(EPOCH FROM NOW())::bigint,
  stripe_customer_id = 'mp_customer_' || s.user_id::text,
  stripe_price_id = 'wellness_annual',
  amount = 57480, -- R$ 574,80 em CENTAVOS (574.80 * 100)
  currency = 'brl',
  canceled_at = NULL,
  updated_at = NOW()
WHERE s.user_id IN (
  SELECT id FROM auth.users WHERE LOWER(email) = LOWER('evsnutrivibe@gmail.com')
)
AND s.area = 'wellness';

-- Se não atualizou nenhuma linha, criar nova
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
  'annual',
  'active',
  NOW(),
  NOW() + INTERVAL '12 months',
  'br',
  'mp_annual_' || u.id::text || '_' || EXTRACT(EPOCH FROM NOW())::bigint,
  'mp_customer_' || u.id::text,
  'wellness_annual',
  57480, -- R$ 574,80 em CENTAVOS (574.80 * 100)
  'brl',
  NOW(),
  NOW()
FROM auth.users u
WHERE LOWER(u.email) = LOWER('evsnutrivibe@gmail.com')
AND NOT EXISTS (
  SELECT 1 FROM subscriptions s 
  WHERE s.user_id = u.id 
  AND s.area = 'wellness'
);

-- Passo 3: Verificar resultado
SELECT 
  u.email,
  up.nome_completo,
  s.plan_type,
  s.status,
  s.amount,
  s.currency,
  s.current_period_end
FROM auth.users u
JOIN user_profiles up ON u.id = up.user_id
JOIN subscriptions s ON u.id = s.user_id
WHERE LOWER(u.email) = LOWER('evsnutrivibe@gmail.com')
  AND s.area = 'wellness'
  AND s.status = 'active'
ORDER BY s.created_at DESC
LIMIT 1;
