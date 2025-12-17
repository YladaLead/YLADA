-- Script para criar assinatura de teste para nutri1@ylada.com
-- Execute este script no Supabase SQL Editor

-- Variável para email
DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
BEGIN
  -- Buscar user_id do nutri1@ylada.com
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'nutri1@ylada.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário nutri1@ylada.com não encontrado';
  END IF;

  -- Verificar se já existe assinatura ativa
  IF EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = v_user_id
      AND area = 'nutri'
      AND status = 'active'
      AND current_period_end > NOW()
  ) THEN
    RAISE NOTICE 'Usuário já tem assinatura ativa. Atualizando para garantir validade...';
    
    -- Atualizar assinatura existente para garantir que está válida
    UPDATE subscriptions
    SET 
      status = 'active',
      current_period_start = NOW(),
      current_period_end = NOW() + INTERVAL '1 year',
      updated_at = NOW()
    WHERE user_id = v_user_id
      AND area = 'nutri';
  ELSE
    -- Criar nova assinatura de teste
    INSERT INTO subscriptions (
      user_id,
      area,
      plan_type,
      stripe_account,
      stripe_subscription_id,
      stripe_customer_id,
      stripe_price_id,
      amount,
      currency,
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      'nutri',
      'annual',
      'br',
      'sub_test_nutri1_' || gen_random_uuid()::text,
      'cus_test_nutri1_' || gen_random_uuid()::text,
      'price_test_nutri1',
      236400, -- R$ 2.364,00 em centavos (plano anual)
      'brl',
      'active',
      NOW(),
      NOW() + INTERVAL '1 year', -- Válida por 1 ano
      false,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_subscription_id;
    
    RAISE NOTICE 'Assinatura criada com sucesso! ID: %', v_subscription_id;
  END IF;

  -- Verificar resultado
  RAISE NOTICE 'Verificando assinatura criada...';
END $$;

-- Verificar resultado final
SELECT 
  u.email,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  CASE 
    WHEN s.current_period_end > NOW() THEN '✅ Válida'
    ELSE '❌ Expirada'
  END as status_validacao
FROM auth.users u
INNER JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'nutri1@ylada.com'
  AND s.area = 'nutri'
ORDER BY s.created_at DESC;
