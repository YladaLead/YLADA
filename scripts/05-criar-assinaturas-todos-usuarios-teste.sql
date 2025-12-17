-- Script para criar assinaturas de teste para todos os usuários de teste Nutri
-- Execute este script no Supabase SQL Editor
-- Cria assinaturas para: nutri1@ylada.com, nutri2@ylada.com, nutri3@ylada.com

DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT;
  v_emails TEXT[] := ARRAY['nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com'];
BEGIN
  -- Loop através de cada email
  FOREACH v_email IN ARRAY v_emails
  LOOP
    -- Buscar user_id
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email;

    IF v_user_id IS NULL THEN
      RAISE NOTICE '⚠️ Usuário % não encontrado. Pulando...', v_email;
      CONTINUE;
    END IF;

    -- Verificar se já existe assinatura ativa
    IF EXISTS (
      SELECT 1 FROM subscriptions
      WHERE user_id = v_user_id
        AND area = 'nutri'
        AND status = 'active'
        AND current_period_end > NOW()
    ) THEN
      RAISE NOTICE '✅ % já tem assinatura ativa. Atualizando validade...', v_email;
      
      -- Atualizar assinatura existente
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
        'sub_test_' || REPLACE(v_email, '@', '_') || '_' || gen_random_uuid()::text,
        'cus_test_' || REPLACE(v_email, '@', '_'),
        'price_test_' || REPLACE(v_email, '@', '_'),
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
      
      RAISE NOTICE '✅ Assinatura criada para % (ID: %)', v_email, v_subscription_id;
    END IF;
  END LOOP;

  RAISE NOTICE '🎉 Processo concluído!';
END $$;

-- Verificar resultado final de todos os usuários
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
WHERE u.email IN ('nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com')
  AND s.area = 'nutri'
ORDER BY u.email, s.created_at DESC;
