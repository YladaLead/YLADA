-- =====================================================
-- CRIAR ASSINATURA PARA CONTA DEMO NUTRI
-- Migração 153: Garantir que conta demo tenha acesso completo
-- =====================================================

-- Buscar user_id da conta demo.nutri@ylada.com
DO $$
DECLARE
  demo_user_id UUID;
  existing_subscription_id UUID;
BEGIN
  -- Buscar user_id da conta demo
  SELECT user_id INTO demo_user_id
  FROM user_profiles
  WHERE email = 'demo.nutri@ylada.com'
  LIMIT 1;

  -- Se encontrou a conta, criar/atualizar assinatura
  IF demo_user_id IS NOT NULL THEN
    -- Verificar se já existe assinatura
    SELECT id INTO existing_subscription_id
    FROM subscriptions
    WHERE user_id = demo_user_id
      AND area = 'nutri'
    LIMIT 1;

    IF existing_subscription_id IS NOT NULL THEN
      -- Atualizar assinatura existente
      UPDATE subscriptions
      SET
        status = 'active',
        plan_type = 'free',
        features = '["cursos", "completo"]'::jsonb,
        current_period_start = NOW(),
        current_period_end = NOW() + INTERVAL '1 year',
        updated_at = NOW()
      WHERE id = existing_subscription_id;

      RAISE NOTICE '✅ Assinatura atualizada para conta demo (user_id: %, subscription_id: %)', demo_user_id, existing_subscription_id;
    ELSE
      -- Criar nova assinatura gratuita
      INSERT INTO subscriptions (
        user_id,
        area,
        status,
        plan_type,
        features,
        stripe_account,
        stripe_subscription_id,
        stripe_customer_id,
        stripe_price_id,
        amount,
        currency,
        current_period_start,
        current_period_end,
        created_at,
        updated_at
      )
      VALUES (
        demo_user_id,
        'nutri',
        'active',
        'free',
        '["cursos", "completo"]'::jsonb,
        'br', -- Stripe account (dummy para plano free)
        'free_' || demo_user_id::text || '_nutri_' || EXTRACT(EPOCH FROM NOW())::bigint,
        'free_' || demo_user_id::text,
        'free',
        0, -- Valor zero para plano gratuito
        'brl',
        NOW(),
        NOW() + INTERVAL '1 year',
        NOW(),
        NOW()
      );

      RAISE NOTICE '✅ Assinatura criada para conta demo (user_id: %)', demo_user_id;
    END IF;
  ELSE
    RAISE NOTICE '⚠️ Conta demo.nutri@ylada.com não encontrada. Verifique se o email está correto.';
  END IF;
END $$;

-- Verificar se foi criada
SELECT 
  s.*,
  up.email,
  up.nome_completo
FROM subscriptions s
JOIN user_profiles up ON up.user_id = s.user_id
WHERE up.email = 'demo.nutri@ylada.com'
  AND s.area = 'nutri'
  AND s.status = 'active';

