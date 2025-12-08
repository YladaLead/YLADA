-- =====================================================
-- CONVERTER ASSINATURA PARA PAGA - ÉRIKA CREMMER
-- Email: evsnutrivibe@gmail.com
-- Plano: Anual PAGO (12x de R$ 47,90 = R$ 574,80 total)
-- =====================================================
-- 
-- ⚠️ IMPORTANTE: Execute este SQL APÓS criar a conta pelo Admin
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT := 'evsnutrivibe@gmail.com';
  v_area TEXT := 'wellness';
  v_plan_type TEXT := 'annual';
  v_amount DECIMAL := 574.80;
  v_period_start TIMESTAMP WITH TIME ZONE := NOW();
  v_period_end TIMESTAMP WITH TIME ZONE := NOW() + INTERVAL '12 months';
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(v_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado. Crie a conta pelo Admin primeiro!';
  END IF;

  -- Cancelar assinatura gratuita (se houver)
  UPDATE subscriptions
  SET 
    status = 'canceled',
    canceled_at = NOW(),
    updated_at = NOW()
  WHERE user_id = v_user_id
    AND area = v_area
    AND status = 'active';

  -- Criar assinatura ANUAL PAGA
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
  ) VALUES (
    v_user_id,
    v_area,
    v_plan_type,
    'active',
    v_period_start,
    v_period_end,
    'br',
    'mp_annual_' || v_user_id::text || '_' || EXTRACT(EPOCH FROM NOW())::bigint,
    'mp_customer_' || v_user_id::text,
    'wellness_annual',
    v_amount,
    'brl',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_subscription_id;

  RAISE NOTICE '✅ Assinatura ANUAL PAGA criada: %', v_subscription_id;
  RAISE NOTICE '✅ Valor: R$ %', v_amount;
  RAISE NOTICE '✅ Válida até: %', v_period_end;
END $$;

-- Verificar resultado
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
