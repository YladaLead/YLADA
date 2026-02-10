-- =====================================================
-- COMPUTAR PAGAMENTO: Marcelino Cristovão (Wellness)
-- Email: mvcristovao@hotmail.com
-- Pagamento MP: transação 144941256949 - YLADA WELLNESS - Plano Anual R$ 718,80
-- Objetivo: Só registrar o pagamento e marcar assinatura como paga (acesso já corrigido manualmente)
-- NÃO altera datas (current_period_start/end) da assinatura.
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT := 'mvcristovao@hotmail.com';
  v_area TEXT := 'wellness';
  v_mp_payment_id TEXT := '144941256949';
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(v_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email %.', v_email;
  END IF;

  SELECT id INTO v_subscription_id
  FROM subscriptions
  WHERE user_id = v_user_id
    AND area = v_area
    AND status = 'active'
  ORDER BY current_period_end DESC NULLS LAST
  LIMIT 1;

  IF v_subscription_id IS NULL THEN
    RAISE EXCEPTION 'Nenhuma assinatura ativa de wellness encontrada para %. Corrija o acesso antes.', v_email;
  END IF;

  -- Só atualizar valor e referência do MP na assinatura (para constar como paga nos relatórios)
  -- NÃO mexe em current_period_start / current_period_end
  UPDATE subscriptions
  SET
    plan_type = 'annual',
    amount = 71880,
    currency = 'brl',
    stripe_subscription_id = 'mp_' || v_mp_payment_id,
    stripe_customer_id = 'mp_customer_' || v_user_id::text,
    stripe_price_id = 'mp_price',
    features = '["completo"]'::jsonb,
    updated_at = NOW()
  WHERE id = v_subscription_id;

  RAISE NOTICE '✅ Assinatura marcada como Plano Anual pago (R$ 718,80). Datas não alteradas.';

  -- Registrar pagamento para computar nas receitas
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
      'br',
      v_mp_payment_id,
      71880,
      'brl',
      'succeeded',
      'credit_card'
    );
    RAISE NOTICE '✅ Pagamento registrado (MP id: %). Valor será computado nas receitas.', v_mp_payment_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'ℹ️ Pagamento com este ID já existe (dinheiro já computado).';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ Erro ao registrar pagamento: %', SQLERRM;
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
WHERE LOWER(up.email) = LOWER('mvcristovao@hotmail.com')
ORDER BY s.current_period_end DESC
LIMIT 1;
