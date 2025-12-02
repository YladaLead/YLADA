-- =====================================================
-- CRIAR PLANO GRATUITO PARA AMANDA BONFOGO - WELLNESS
-- Executar no Supabase SQL Editor
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_profile_id UUID;
  v_subscription_id UUID;
  v_period_start TIMESTAMP WITH TIME ZONE;
  v_period_end TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 1. Buscar ou criar usuário Amanda
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email ILIKE 'amandabonfogo01@gmail.com'
  LIMIT 1;

  -- Se não encontrou, criar usuário
  IF v_user_id IS NULL THEN
    -- Criar usuário (requer permissões admin)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'amandabonfogo01@gmail.com',
      crypt('temp_password_' || gen_random_uuid()::text, gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Amanda Bonfogo"}',
      false,
      '',
      ''
    )
    RETURNING id INTO v_user_id;
    
    RAISE NOTICE '✅ Usuário criado: %', v_user_id;
  ELSE
    RAISE NOTICE '✅ Usuário encontrado: %', v_user_id;
  END IF;

  -- 2. Verificar/criar perfil
  SELECT id INTO v_profile_id
  FROM user_profiles
  WHERE user_id = v_user_id;

  IF v_profile_id IS NULL THEN
    INSERT INTO user_profiles (
      user_id,
      nome_completo,
      email,
      perfil,
      created_at
    )
    VALUES (
      v_user_id,
      'Amanda Bonfogo',
      'amandabonfogo01@gmail.com',
      'wellness',
      NOW()
    )
    RETURNING id INTO v_profile_id;
    
    RAISE NOTICE '✅ Perfil criado: %', v_profile_id;
  ELSE
    RAISE NOTICE '✅ Perfil já existe: %', v_profile_id;
  END IF;

  -- 3. Cancelar assinatura antiga em Wellness se existir
  UPDATE subscriptions
  SET 
    status = 'canceled',
    canceled_at = NOW(),
    updated_at = NOW()
  WHERE user_id = v_user_id
    AND area = 'wellness'
    AND status = 'active'
    AND current_period_end > NOW();

  IF FOUND THEN
    RAISE NOTICE '✅ Assinatura antiga cancelada';
  END IF;

  -- 4. Calcular datas (365 dias)
  v_period_start := NOW();
  v_period_end := NOW() + INTERVAL '365 days';

  -- 5. Criar nova assinatura gratuita
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
  )
  VALUES (
    v_user_id,
    'wellness',
    'free',
    'active',
    v_period_start,
    v_period_end,
    'br',
    'free_' || v_user_id::text || '_wellness_' || EXTRACT(EPOCH FROM NOW())::bigint,
    'free_' || v_user_id::text,
    'free',
    0,
    'brl',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_subscription_id;

  RAISE NOTICE '✅ Assinatura criada com sucesso!';
  RAISE NOTICE '   ID: %', v_subscription_id;
  RAISE NOTICE '   Válida até: %', v_period_end;
  
  -- 6. Verificar resultado
  RAISE NOTICE '';
  RAISE NOTICE '📋 RESUMO:';
  RAISE NOTICE '   Usuário: Amanda Bonfogo (amandabonfogo01@gmail.com)';
  RAISE NOTICE '   Área: Wellness';
  RAISE NOTICE '   Tipo: Gratuito';
  RAISE NOTICE '   Válido por: 365 dias';
  RAISE NOTICE '   Vencimento: %', v_period_end;

END $$;

-- =====================================================
-- VERIFICAR RESULTADO
-- =====================================================

SELECT 
  u.email,
  up.nome_completo,
  up.perfil as area_perfil,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.amount,
  s.currency,
  CASE 
    WHEN s.current_period_end > NOW() AND s.status = 'active' THEN '✅ ATIVA'
    ELSE '⚠️ INATIVA'
  END as situacao
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.area = 'wellness'
WHERE u.email ILIKE 'amandabonfogo01@gmail.com'
ORDER BY s.created_at DESC
LIMIT 1;

