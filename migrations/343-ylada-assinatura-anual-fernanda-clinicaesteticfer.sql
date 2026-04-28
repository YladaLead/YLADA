-- =====================================================
-- Assinatura anual (1 ano) — clinicaesteticfer@gmail.com (Pro Estética / links YLADA)
--
-- Na tabela `subscriptions` não existe area = "pro_estetica": o produto Pro Estética corporal
-- usa a stack de links YLADA; `hasYladaProPlan` trata como Pro quem tem `area = 'ylada'`
-- ativa (mensal/anual/trial ou free cortesia).
--
-- Uma única linha: `ylada` + `annual`. Pagamento anual fora do Stripe (IDs manual_*).
-- Idempotente: atualiza a linha mais recente (user_id + area ylada) ou insere.
-- Executar no Supabase após o utilizador existir em auth + user_profiles.
-- =====================================================

DO $$
DECLARE
  v_email CONSTANT TEXT := 'clinicaesteticfer@gmail.com';
  v_user_id UUID;
  v_sub_id UUID;
  v_stripe_sub TEXT;
BEGIN
  SELECT up.user_id
  INTO v_user_id
  FROM user_profiles up
  WHERE lower(trim(up.email)) = lower(trim(v_email))
  LIMIT 1;

  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE lower(trim(email)) = lower(trim(v_email)) LIMIT 1;
  END IF;

  IF v_user_id IS NULL THEN
    RAISE NOTICE '⚠️ Utilizador % não encontrado (user_profiles nem auth.users). Crie a conta primeiro.', v_email;
    RETURN;
  END IF;

  v_stripe_sub := 'manual_annual_pro_estetica_fernanda_' || replace(v_user_id::text, '-', '') || '_' || floor(extract(epoch from now()))::text;

  SELECT s.id INTO v_sub_id
  FROM subscriptions s
  WHERE s.user_id = v_user_id AND s.area = 'ylada'
  ORDER BY s.created_at DESC NULLS LAST, s.id DESC
  LIMIT 1;

  IF v_sub_id IS NOT NULL THEN
    UPDATE subscriptions
    SET
      status = 'active',
      plan_type = 'annual',
      features = COALESCE(features, '["completo"]'::jsonb),
      stripe_account = COALESCE(NULLIF(trim(stripe_account), ''), 'br'),
      stripe_subscription_id = v_stripe_sub,
      stripe_customer_id = COALESCE(NULLIF(trim(stripe_customer_id), ''), 'manual_' || v_user_id::text),
      stripe_price_id = 'manual_annual',
      amount = COALESCE(amount, 0),
      currency = COALESCE(NULLIF(trim(currency), ''), 'brl'),
      current_period_start = NOW(),
      current_period_end = NOW() + INTERVAL '1 year',
      updated_at = NOW()
    WHERE id = v_sub_id;
    RAISE NOTICE '✅ subscriptions (ylada / Pro Estética links) atualizada: user_id=%, id=%', v_user_id, v_sub_id;
  ELSE
    INSERT INTO subscriptions (
      user_id, area, status, plan_type, features,
      stripe_account, stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency, current_period_start, current_period_end, created_at, updated_at
    )
    VALUES (
      v_user_id, 'ylada', 'active', 'annual', '["completo"]'::jsonb,
      'br', v_stripe_sub, 'manual_' || v_user_id::text, 'manual_annual',
      0, 'brl', NOW(), NOW() + INTERVAL '1 year', NOW(), NOW()
    );
    RAISE NOTICE '✅ subscriptions (ylada / Pro Estética links) criada: user_id=%', v_user_id;
  END IF;
END $$;

SELECT s.id, s.area, s.plan_type, s.status, s.current_period_start, s.current_period_end, up.email
FROM subscriptions s
JOIN user_profiles up ON up.user_id = s.user_id
WHERE lower(trim(up.email)) = lower(trim('clinicaesteticfer@gmail.com'))
  AND s.area = 'ylada'
  AND s.status = 'active';
