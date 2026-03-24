-- =====================================================
-- Laudineia — laudrochasilva@gmail.com | Wellness mensal R$ 97,00
--
-- Mercado Pago:
--   N.º da transação: 151693554718
--   Referência (external): wellness_monthly_15c2b718-a114-4d27-9ea6-d6e818a12cf1
--     (o UUID é o user_id no Supabase)
--
-- Subscription: 0b3aa109-67cd-476f-bf69-4b343e8504e5
--
-- 1) Preferível: POST /api/admin/mercado-pago/sync-payment
--    Body: { "payment_id": "151693554718" } (sessão admin)
--
-- 2) Correção manual completa (se ainda estiver trial):
--    Rode o bloco UPDATE "correção completa" abaixo.
--
-- 3) Só amarrar ao MP (se já virou monthly com mp_manual_...):
--    Rode o bloco "Amarrar stripe_subscription_id ao MP" no final.
-- =====================================================

-- --- Correção completa (trial → monthly, ID já do MP) ---
UPDATE subscriptions
SET
  plan_type = 'monthly',
  stripe_subscription_id = 'mp_151693554718',
  stripe_customer_id = COALESCE(stripe_customer_id, 'mp_customer_manual'),
  stripe_price_id = COALESCE(stripe_price_id, 'mp_price'),
  features = COALESCE(features, '["completo"]'::jsonb),
  amount = 9700,
  currency = 'brl',
  status = 'active',
  current_period_start = COALESCE(current_period_start, NOW()),
  current_period_end = GREATEST(
    COALESCE(current_period_end, NOW()),
    NOW() + INTERVAL '1 month'
  ),
  cancel_at_period_end = false,
  welcome_email_sent = false,
  updated_at = NOW()
WHERE id = '0b3aa109-67cd-476f-bf69-4b343e8504e5'
  AND area = 'wellness';

-- Verificação
SELECT
  id AS subscription_id,
  area,
  plan_type,
  status,
  stripe_subscription_id,
  current_period_start,
  current_period_end,
  amount,
  currency
FROM subscriptions
WHERE id = '0b3aa109-67cd-476f-bf69-4b343e8504e5';

-- =====================================================
-- Amarrar só ao MP (execute se já está monthly mas stripe_subscription_id
-- ainda é mp_manual_wellness_laudineia_...)
-- =====================================================
-- UPDATE subscriptions
-- SET stripe_subscription_id = 'mp_151693554718', updated_at = NOW()
-- WHERE id = '0b3aa109-67cd-476f-bf69-4b343e8504e5';
