-- =====================================================
-- CORRIGIR ASSINATURA DA ÉRIKA CREMMER - DEFINITIVO
-- Email: evsnutrivibe@gmail.com
-- Garantir que a assinatura está ATIVA, VÁLIDA e com VALOR CORRETO
-- =====================================================

-- IMPORTANTE: A coluna 'amount' é INTEGER e espera VALOR EM CENTAVOS
-- R$ 574,80 = 57480 centavos

DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT := 'evsnutrivibe@gmail.com';
  v_area TEXT := 'wellness';
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(v_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado. Crie a conta primeiro pelo Admin!';
  END IF;

  RAISE NOTICE '✅ Usuário encontrado: %', v_user_id;

  -- Cancelar TODAS as assinaturas antigas (ativas ou não)
  UPDATE subscriptions
  SET 
    status = 'canceled',
    canceled_at = NOW(),
    updated_at = NOW()
  WHERE user_id = v_user_id
    AND area = v_area;

  RAISE NOTICE '✅ Assinaturas antigas canceladas';

  -- Verificar se já existe uma assinatura (mesmo cancelada)
  SELECT id INTO v_subscription_id
  FROM subscriptions
  WHERE user_id = v_user_id
    AND area = v_area
  ORDER BY created_at DESC
  LIMIT 1;

  -- Se já existe, atualizar; senão, criar nova
  IF v_subscription_id IS NOT NULL THEN
    -- ATUALIZAR assinatura existente
    UPDATE subscriptions
    SET 
      plan_type = 'annual',
      status = 'active', -- ✅ Garantir status ATIVO
      current_period_start = NOW(),
      current_period_end = NOW() + INTERVAL '12 months', -- ✅ Garantir validade
      stripe_account = 'br',
      stripe_subscription_id = 'mp_annual_' || v_user_id::text || '_' || EXTRACT(EPOCH FROM NOW())::bigint,
      stripe_customer_id = 'mp_customer_' || v_user_id::text,
      stripe_price_id = 'wellness_annual',
      amount = 57480, -- ✅ R$ 574,80 em CENTAVOS
      currency = 'brl',
      canceled_at = NULL, -- Remover cancelamento
      updated_at = NOW()
    WHERE id = v_subscription_id;
    
    RAISE NOTICE '✅ Assinatura existente atualizada';
  ELSE
    -- CRIAR nova assinatura
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
      'annual',
      'active', -- ✅ Status ATIVO
      NOW(),
      NOW() + INTERVAL '12 months', -- ✅ Válida por 12 meses
      'br',
      'mp_annual_' || v_user_id::text || '_' || EXTRACT(EPOCH FROM NOW())::bigint,
      'mp_customer_' || v_user_id::text,
      'wellness_annual',
      57480, -- ✅ R$ 574,80 em CENTAVOS (574.80 * 100)
      'brl',
      NOW(),
      NOW()
    )
    RETURNING id INTO v_subscription_id;
    
    RAISE NOTICE '✅ Nova assinatura criada';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '✅✅✅ ASSINATURA ANUAL PAGA CRIADA/ATUALIZADA COM SUCESSO! ✅✅✅';
  RAISE NOTICE '   Subscription ID: %', v_subscription_id;
  RAISE NOTICE '   Status: active';
  RAISE NOTICE '   Valor: R$ 574,80 (57480 centavos)';
  RAISE NOTICE '   Válida até: %', NOW() + INTERVAL '12 months';
  RAISE NOTICE '   Plan Type: annual';
  RAISE NOTICE '';

END $$;

-- VERIFICAR RESULTADO FINAL (simular a query da função hasActiveSubscription)
SELECT 
  '✅ VERIFICAÇÃO FINAL' as verificacao,
  u.email,
  up.nome_completo,
  s.id as subscription_id,
  s.plan_type,
  s.status,
  s.amount,
  s.amount / 100.0 as valor_reais,
  s.current_period_start,
  s.current_period_end,
  s.current_period_end > NOW() as nao_expirada,
  -- Verificar se atende TODOS os critérios da função hasActiveSubscription
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ ASSINATURA VÁLIDA E ATIVA - SERÁ RECONHECIDA'
    WHEN s.status != 'active' THEN '❌ PROBLEMA: Status não é "active": ' || s.status
    WHEN s.current_period_end <= NOW() THEN '❌ PROBLEMA: Assinatura expirada em: ' || s.current_period_end::text
    ELSE '❌ PROBLEMA: Verificar manualmente'
  END as resultado
FROM auth.users u
JOIN user_profiles up ON u.id = up.user_id
JOIN subscriptions s ON u.id = s.user_id
WHERE LOWER(u.email) = LOWER('evsnutrivibe@gmail.com')
  AND s.area = 'wellness'
  AND s.status = 'active'
  AND s.current_period_end > NOW()
ORDER BY s.created_at DESC
LIMIT 1;
