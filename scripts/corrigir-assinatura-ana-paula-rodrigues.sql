-- =====================================================
-- CORRIGIR ASSINATURA: Ana Paula Rodrigues
-- Email: anarodriguespr10@gmail.com
-- Pagamento MP aprovado: transação 144868205799 - YLADA NUTRI Plano Mensal R$ 97,00
-- Objetivo: Criar assinatura ativa para parar de aparecer "Nunca assinou"
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT := 'anarodriguespr10@gmail.com';
  v_area TEXT := 'nutri';
  v_mp_payment_id TEXT := '144868205799';
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(v_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email %. Crie a conta primeiro.', v_email;
  END IF;

  RAISE NOTICE '✅ Usuário encontrado: %', v_user_id;

  -- Verificar se já existe assinatura ativa para esta área
  SELECT id INTO v_subscription_id
  FROM subscriptions
  WHERE user_id = v_user_id
    AND area = v_area
    AND status = 'active'
    AND current_period_end > NOW()
  LIMIT 1;

  IF v_subscription_id IS NOT NULL THEN
    RAISE NOTICE 'ℹ️ Já existe assinatura ativa (id: %). Nada a fazer.', v_subscription_id;
    RETURN;
  END IF;

  -- Criar assinatura: YLADA NUTRI - Plano Mensal (R$ 97,00)
  INSERT INTO subscriptions (
    user_id,
    area,
    plan_type,
    status,
    features,
    stripe_account,
    stripe_subscription_id,
    stripe_customer_id,
    stripe_price_id,
    amount,
    currency,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_area,
    'monthly',
    'active',
    '["gestao", "ferramentas"]'::jsonb,
    NULL,
    'mp_' || v_mp_payment_id,
    'mp_customer_' || v_user_id::text,
    'mp_price',
    9700,  -- R$ 97,00 em centavos
    'brl',
    NOW(),
    NOW() + INTERVAL '1 month',
    false,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_subscription_id;

  RAISE NOTICE '✅ Assinatura criada com sucesso!';
  RAISE NOTICE '   Subscription ID: %', v_subscription_id;
  RAISE NOTICE '   Plano: Nutri Mensal';
  RAISE NOTICE '   Valor: R$ 97,00';
  RAISE NOTICE '   Válida até: %', NOW() + INTERVAL '1 month';

  -- Opcional: registrar o pagamento em payments (para histórico)
  BEGIN
    INSERT INTO payments (
      subscription_id,
      user_id,
      stripe_account,
      stripe_payment_intent_id,
      amount,
      currency,
      status,
      payment_method
    ) VALUES (
      v_subscription_id,
      v_user_id,
      'br',  -- Mercado Pago Brasil
      v_mp_payment_id,
      9700,
      'brl',
      'succeeded',
      'credit_card'
    );
    RAISE NOTICE '✅ Pagamento registrado (MP id: %)', v_mp_payment_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'ℹ️ Pagamento com este ID já existe, ignorando insert.';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ Erro ao registrar pagamento (assinatura já criada): %', SQLERRM;
  END;

END $$;

-- Verificar resultado
SELECT 
  up.email,
  up.nome_completo,
  up.perfil as area,
  s.plan_type,
  s.status,
  s.current_period_end as valida_ate,
  s.amount / 100.0 as valor_reais
FROM user_profiles up
JOIN subscriptions s ON s.user_id = up.user_id AND s.area = up.perfil
WHERE LOWER(up.email) = LOWER('anarodriguespr10@gmail.com')
ORDER BY s.current_period_end DESC
LIMIT 1;
