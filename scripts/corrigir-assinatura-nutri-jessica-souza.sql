-- =====================================================
-- CORREÇÃO DE ACESSO NUTRI: Jessica Santos Souza
-- Pagamento aprovado no MP em 19/fev que não foi reconhecido.
-- Transação: 146940219158 — jessica.souza17@yahoo.com — YLADA NUTRI - Plano Mensal — R$ 97,00
-- =====================================================
-- Antes de rodar: prefira tentar o sync via API (admin logado):
--   POST /api/admin/mercado-pago/sync-payment
--   Body: { "payment_id": "146940219158" }
-- Se o sync não resolver, execute este script.
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT := 'jessica.souza17@yahoo.com';
  v_area TEXT := 'nutri';
  v_mp_payment_id TEXT := '146940219158';
  v_amount_cents INT := 9700; -- R$ 97,00 plano mensal Nutri
  v_current_end TIMESTAMPTZ;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email %. Crie o usuário ou use o sync via API primeiro.', v_email;
  END IF;

  SELECT id, current_period_end INTO v_subscription_id, v_current_end
  FROM subscriptions
  WHERE user_id = v_user_id AND area = v_area AND status = 'active'
  ORDER BY current_period_end DESC NULLS LAST
  LIMIT 1;

  IF v_subscription_id IS NULL THEN
    -- Nova assinatura
    INSERT INTO subscriptions (
      user_id, area, plan_type, features, stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency, status, current_period_start, current_period_end, cancel_at_period_end, welcome_email_sent, updated_at
    ) VALUES (
      v_user_id, v_area, 'monthly', '["gestao", "ferramentas"]'::jsonb, 'mp_' || v_mp_payment_id, 'mp_customer_' || v_user_id::text, 'mp_price',
      v_amount_cents, 'brl', 'active', NOW(), NOW() + INTERVAL '1 month', false, false, NOW()
    )
    RETURNING id INTO v_subscription_id;
    RAISE NOTICE '✅ Assinatura criada para % (Jessica Nutri).', v_email;
  ELSE
    -- Renovação: estender vencimento em 1 mês a partir do current_period_end atual
    UPDATE subscriptions
    SET
      stripe_subscription_id = 'mp_' || v_mp_payment_id,
      amount = v_amount_cents,
      features = '["gestao", "ferramentas"]'::jsonb,
      current_period_end = (COALESCE(v_current_end, NOW()) + INTERVAL '1 month'),
      updated_at = NOW()
    WHERE id = v_subscription_id;
    RAISE NOTICE '✅ Assinatura renovada para % (Jessica Nutri). Vencimento estendido em 1 mês.', v_email;
  END IF;

  BEGIN
    INSERT INTO payments (subscription_id, user_id, stripe_account, stripe_payment_intent_id, amount, currency, status, payment_method)
    VALUES (v_subscription_id, v_user_id, 'br', v_mp_payment_id, v_amount_cents, 'brl', 'succeeded', 'credit_card');
    RAISE NOTICE '✅ Pagamento registrado (MP id: %).', v_mp_payment_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'ℹ️ Pagamento com este ID já existe (sync ou execução anterior).';
  END;
END $$;

-- Verificação (rode após o script)
SELECT up.email, up.nome_completo, s.plan_type, s.status, s.current_period_end AS valida_ate, s.amount / 100.0 AS valor_reais
FROM user_profiles up
JOIN subscriptions s ON s.user_id = up.user_id AND s.area = 'nutri'
WHERE LOWER(up.email) = LOWER('jessica.souza17@yahoo.com')
ORDER BY s.current_period_end DESC;
