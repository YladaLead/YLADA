-- =====================================================
-- Template: corrigir assinatura Wellness (trial → monthly) após pagamento MP
--
-- Preencha antes de rodar (produção):
--   UUID_DA_SUBSCRIPTION — id da linha em subscriptions
--   mp_NUMERO_MP         — string completa: mp_ + número da transação no MP (ex.: mp_123456789)
--
-- Preferível quando possível:
--   POST /api/admin/mercado-pago/sync-payment
--   Body: { "payment_id": "<só o número, sem mp_>" } (sessão admin)
--
-- Se ainda estiver trial, use o bloco UPDATE abaixo.
-- Se já está monthly com mp_manual_..., use o bloco comentado no final.
-- =====================================================

-- --- Correção completa (trial → monthly, ID já do MP) ---
UPDATE subscriptions
SET
  plan_type = 'monthly',
  stripe_subscription_id = 'mp_NUMERO_MP',
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
WHERE id = 'UUID_DA_SUBSCRIPTION'
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
WHERE id = 'UUID_DA_SUBSCRIPTION';

-- =====================================================
-- Só amarrar stripe_subscription_id ao MP (já monthly, ID manual antigo)
-- =====================================================
-- UPDATE subscriptions
-- SET stripe_subscription_id = 'mp_NUMERO_MP', updated_at = NOW()
-- WHERE id = 'UUID_DA_SUBSCRIPTION';
