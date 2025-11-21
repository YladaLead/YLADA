-- =====================================================
-- AUTORIZAR 3 EMAILS PARA ÁREA COACH POR 1 ANO
-- =====================================================
-- Este script cria assinaturas anuais (365 dias) para 3 emails
-- na área Coach
--
-- INSTRUÇÕES:
-- 1. Substitua os emails abaixo pelos emails reais
-- 2. Execute este script no Supabase SQL Editor
-- 3. Os usuários precisam ter conta criada primeiro (via cadastro ou admin)
-- =====================================================

-- =====================================================
-- CONFIGURAÇÃO: Emails a serem autorizados
-- =====================================================
-- Substitua pelos emails reais:
-- email1@exemplo.com
-- email2@exemplo.com  
-- email3@exemplo.com

-- =====================================================
-- 1. BUSCAR USER_IDs PELOS EMAILS
-- =====================================================
-- Primeiro, vamos verificar se os usuários existem
-- Se não existirem, você precisará criá-los primeiro via Supabase Auth

DO $$
DECLARE
  email1 TEXT := 'email1@exemplo.com';  -- ⚠️ SUBSTITUIR
  email2 TEXT := 'email2@exemplo.com';  -- ⚠️ SUBSTITUIR
  email3 TEXT := 'email3@exemplo.com';  -- ⚠️ SUBSTITUIR
  
  user_id1 UUID;
  user_id2 UUID;
  user_id3 UUID;
  
  period_start TIMESTAMP WITH TIME ZONE;
  period_end TIMESTAMP WITH TIME ZONE;
  
  subscription_id1 UUID;
  subscription_id2 UUID;
  subscription_id3 UUID;
BEGIN
  -- Data de início: agora
  period_start := NOW();
  -- Data de término: 1 ano a partir de agora (365 dias)
  period_end := NOW() + INTERVAL '365 days';
  
  -- =====================================================
  -- Buscar user_id do primeiro email
  -- =====================================================
  SELECT id INTO user_id1
  FROM auth.users
  WHERE email = email1;
  
  IF user_id1 IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado. Crie a conta primeiro.', email1;
  END IF;
  
  -- =====================================================
  -- Buscar user_id do segundo email
  -- =====================================================
  SELECT id INTO user_id2
  FROM auth.users
  WHERE email = email2;
  
  IF user_id2 IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado. Crie a conta primeiro.', email2;
  END IF;
  
  -- =====================================================
  -- Buscar user_id do terceiro email
  -- =====================================================
  SELECT id INTO user_id3
  FROM auth.users
  WHERE email = email3;
  
  IF user_id3 IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado. Crie a conta primeiro.', email3;
  END IF;
  
  -- =====================================================
  -- Verificar se já têm assinatura ativa para Coach
  -- =====================================================
  -- Se já tiverem, vamos cancelar a antiga e criar nova
  
  -- Cancelar assinaturas antigas (se existirem)
  UPDATE subscriptions
  SET status = 'canceled',
      canceled_at = NOW()
  WHERE user_id IN (user_id1, user_id2, user_id3)
    AND area = 'coach'
    AND status = 'active'
    AND current_period_end > NOW();
  
  -- =====================================================
  -- Criar assinatura para email1
  -- =====================================================
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
    user_id1,
    'coach',
    'annual',  -- Plano anual
    'br',
    'manual_' || user_id1 || '_coach_' || EXTRACT(EPOCH FROM NOW())::BIGINT,
    'manual_' || user_id1,
    'manual_annual_coach',
    0,  -- Gratuito
    'brl',
    'active',
    period_start,
    period_end,
    false,
    NOW(),
    NOW()
  )
  RETURNING id INTO subscription_id1;
  
  -- =====================================================
  -- Criar assinatura para email2
  -- =====================================================
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
    user_id2,
    'coach',
    'annual',
    'br',
    'manual_' || user_id2 || '_coach_' || EXTRACT(EPOCH FROM NOW())::BIGINT,
    'manual_' || user_id2,
    'manual_annual_coach',
    0,
    'brl',
    'active',
    period_start,
    period_end,
    false,
    NOW(),
    NOW()
  )
  RETURNING id INTO subscription_id2;
  
  -- =====================================================
  -- Criar assinatura para email3
  -- =====================================================
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
    user_id3,
    'coach',
    'annual',
    'br',
    'manual_' || user_id3 || '_coach_' || EXTRACT(EPOCH FROM NOW())::BIGINT,
    'manual_' || user_id3,
    'manual_annual_coach',
    0,
    'brl',
    'active',
    period_start,
    period_end,
    false,
    NOW(),
    NOW()
  )
  RETURNING id INTO subscription_id3;
  
  -- =====================================================
  -- Atualizar perfil dos usuários para 'coach'
  -- =====================================================
  -- Garantir que o perfil está configurado como 'coach'
  INSERT INTO user_profiles (user_id, perfil, profession, updated_at)
  VALUES 
    (user_id1, 'coach', 'coach', NOW()),
    (user_id2, 'coach', 'coach', NOW()),
    (user_id3, 'coach', 'coach', NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    perfil = 'coach',
    profession = 'coach',
    updated_at = NOW();
  
  -- =====================================================
  -- RESULTADO
  -- =====================================================
  RAISE NOTICE '✅ Assinaturas criadas com sucesso!';
  RAISE NOTICE 'Email 1: % - User ID: % - Subscription ID: %', email1, user_id1, subscription_id1;
  RAISE NOTICE 'Email 2: % - User ID: % - Subscription ID: %', email2, user_id2, subscription_id2;
  RAISE NOTICE 'Email 3: % - User ID: % - Subscription ID: %', email3, user_id3, subscription_id3;
  RAISE NOTICE 'Período: % até %', period_start, period_end;
  RAISE NOTICE 'Duração: 365 dias (1 ano)';
  
END $$;

-- =====================================================
-- VERIFICAÇÃO: Listar assinaturas criadas
-- =====================================================
SELECT 
  u.email,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.current_period_end - NOW() as tempo_restante,
  s.amount as valor_centavos,
  s.currency
FROM subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE s.area = 'coach'
  AND s.status = 'active'
  AND s.current_period_end > NOW()
  AND s.stripe_subscription_id LIKE 'manual_%'
ORDER BY s.created_at DESC
LIMIT 10;

