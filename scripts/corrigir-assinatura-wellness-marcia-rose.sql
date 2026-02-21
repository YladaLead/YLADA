-- =====================================================
-- CORREÇÃO DE ACESSO WELLNESS: Marcia Dalavechia e Rose Leite
-- Pagamentos aprovados no MP que não foram reconhecidos (transferência bancária).
-- Use este script apenas se o sync via API não resolver:
--   POST /api/admin/mercado-pago/sync-payment com payment_id 146535078400 e 146559917050
-- =====================================================
-- Transações:
--   Marcia Dalavechia — 146535078400 — ecommerceherbalife@gmail.com — Plano Mensal
--   Rose Leite         — 146559917050 — rosecarlaleite@gmail.com     — Plano Mensal
-- =====================================================

-- Marcia Dalavechia (146535078400)
DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT := 'ecommerceherbalife@gmail.com';
  v_area TEXT := 'wellness';
  v_mp_payment_id TEXT := '146535078400';
  v_amount_cents INT := 5990; -- R$ 59,90 plano mensal (ajuste se for outro valor)
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email %. Crie o usuário ou use o sync via API primeiro.', v_email;
  END IF;

  SELECT id INTO v_subscription_id
  FROM subscriptions
  WHERE user_id = v_user_id AND area = v_area AND status = 'active'
  ORDER BY current_period_end DESC NULLS LAST
  LIMIT 1;

  IF v_subscription_id IS NULL THEN
    INSERT INTO subscriptions (
      user_id, area, plan_type, features, stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency, status, current_period_start, current_period_end, cancel_at_period_end, welcome_email_sent, updated_at
    ) VALUES (
      v_user_id, v_area, 'monthly', '["completo"]'::jsonb, 'mp_' || v_mp_payment_id, 'mp_customer_' || v_user_id::text, 'mp_price',
      v_amount_cents, 'brl', 'active', NOW(), NOW() + INTERVAL '1 month', false, false, NOW()
    )
    RETURNING id INTO v_subscription_id;
    RAISE NOTICE '✅ Assinatura criada para % (Marcia).', v_email;
  ELSE
    UPDATE subscriptions
    SET stripe_subscription_id = 'mp_' || v_mp_payment_id, amount = v_amount_cents, features = '["completo"]'::jsonb, updated_at = NOW()
    WHERE id = v_subscription_id;
    RAISE NOTICE '✅ Assinatura existente atualizada para % (Marcia).', v_email;
  END IF;

  BEGIN
    INSERT INTO payments (subscription_id, user_id, stripe_account, stripe_payment_intent_id, amount, currency, status, payment_method)
    VALUES (v_subscription_id, v_user_id, 'br', v_mp_payment_id, v_amount_cents, 'brl', 'succeeded', 'bank_transfer');
    RAISE NOTICE '✅ Pagamento registrado (MP id: %).', v_mp_payment_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'ℹ️ Pagamento com este ID já existe (sync ou execução anterior).';
  END;
END $$;

-- Rose Leite (146559917050)
DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT := 'rosecarlaleite@gmail.com';
  v_area TEXT := 'wellness';
  v_mp_payment_id TEXT := '146559917050';
  v_amount_cents INT := 5990;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email %. Crie o usuário ou use o sync via API primeiro.', v_email;
  END IF;

  SELECT id INTO v_subscription_id
  FROM subscriptions
  WHERE user_id = v_user_id AND area = v_area AND status = 'active'
  ORDER BY current_period_end DESC NULLS LAST
  LIMIT 1;

  IF v_subscription_id IS NULL THEN
    INSERT INTO subscriptions (
      user_id, area, plan_type, features, stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency, status, current_period_start, current_period_end, cancel_at_period_end, welcome_email_sent, updated_at
    ) VALUES (
      v_user_id, v_area, 'monthly', '["completo"]'::jsonb, 'mp_' || v_mp_payment_id, 'mp_customer_' || v_user_id::text, 'mp_price',
      v_amount_cents, 'brl', 'active', NOW(), NOW() + INTERVAL '1 month', false, false, NOW()
    )
    RETURNING id INTO v_subscription_id;
    RAISE NOTICE '✅ Assinatura criada para % (Rose).', v_email;
  ELSE
    UPDATE subscriptions
    SET stripe_subscription_id = 'mp_' || v_mp_payment_id, amount = v_amount_cents, features = '["completo"]'::jsonb, updated_at = NOW()
    WHERE id = v_subscription_id;
    RAISE NOTICE '✅ Assinatura existente atualizada para % (Rose).', v_email;
  END IF;

  BEGIN
    INSERT INTO payments (subscription_id, user_id, stripe_account, stripe_payment_intent_id, amount, currency, status, payment_method)
    VALUES (v_subscription_id, v_user_id, 'br', v_mp_payment_id, v_amount_cents, 'brl', 'succeeded', 'bank_transfer');
    RAISE NOTICE '✅ Pagamento registrado (MP id: %).', v_mp_payment_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'ℹ️ Pagamento com este ID já existe (sync ou execução anterior).';
  END;
END $$;

-- Verificação (rode após o script)
SELECT up.email, up.nome_completo, s.plan_type, s.status, s.current_period_end AS valida_ate, s.amount / 100.0 AS valor_reais
FROM user_profiles up
JOIN subscriptions s ON s.user_id = up.user_id AND s.area = 'wellness'
WHERE LOWER(up.email) IN (LOWER('ecommerceherbalife@gmail.com'), LOWER('rosecarlaleite@gmail.com'))
ORDER BY up.email, s.current_period_end DESC;
