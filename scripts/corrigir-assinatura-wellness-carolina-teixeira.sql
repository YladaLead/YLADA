-- =====================================================
-- CORREÇÃO DE ACESSO WELLNESS: Carolina Teixeira
-- Pagamento aprovado no MP em 22/fev que não foi reconhecido
-- por falta da coluna ref_vendedor na tabela subscriptions.
-- Transação: 146564913763 — teixeiracarolina16@gmail.com — Wellness Mensal
-- =====================================================
-- 1) Antes de rodar este script, execute a migration no Supabase:
--    migrations/197-add-ref-vendedor-subscriptions.sql
-- 2) Depois execute este script (ou tente sync via API):
--    POST /api/admin/mercado-pago/sync-payment
--    Body: { "payment_id": "146564913763" }
-- Se o sync não resolver, execute o bloco abaixo.
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT := 'teixeiracarolina16@gmail.com';
  v_area TEXT := 'wellness';
  v_mp_payment_id TEXT := '146564913763';
  v_amount_cents INT := 9700; -- Plano mensal Wellness (ajuste se o valor for outro)
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
    -- Nova assinatura (coluna ref_vendedor omitida para funcionar mesmo antes da migration 197)
    INSERT INTO subscriptions (
      user_id, area, plan_type, features, stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency, status, current_period_start, current_period_end, cancel_at_period_end, welcome_email_sent, updated_at
    ) VALUES (
      v_user_id, v_area, 'monthly', '["gestao", "ferramentas"]'::jsonb, 'mp_' || v_mp_payment_id, 'mp_customer', 'mp_price',
      v_amount_cents, 'brl', 'active', '2026-02-22 00:51:29+00'::timestamptz, '2026-03-22 00:51:29+00'::timestamptz, false, false, NOW()
    )
    RETURNING id INTO v_subscription_id;
    RAISE NOTICE '✅ Assinatura criada para % (Wellness Carolina Teixeira).', v_email;
  ELSE
    UPDATE subscriptions
    SET
      stripe_subscription_id = 'mp_' || v_mp_payment_id,
      amount = v_amount_cents,
      features = '["gestao", "ferramentas"]'::jsonb,
      current_period_end = (COALESCE(v_current_end, NOW()) + INTERVAL '1 month'),
      updated_at = NOW()
    WHERE id = v_subscription_id;
    RAISE NOTICE '✅ Assinatura renovada para % (Wellness). Vencimento estendido em 1 mês.', v_email;
  END IF;

  BEGIN
    INSERT INTO payments (subscription_id, user_id, stripe_account, stripe_payment_intent_id, amount, currency, status, payment_method)
    VALUES (v_subscription_id, v_user_id, NULL, v_mp_payment_id, v_amount_cents, 'brl', 'succeeded', 'credit_card');
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
WHERE LOWER(up.email) = LOWER('teixeiracarolina16@gmail.com')
ORDER BY s.current_period_end DESC;
