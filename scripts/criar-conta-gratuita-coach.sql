-- =====================================================
-- CRIAR CONTA GRATUITA DE 1 ANO PARA ÁREA COACH
-- =====================================================
-- Este script cria uma conta e assinatura gratuita de 1 ano
-- para o email portalmagra@gmail.com na área Coach
--
-- INSTRUÇÕES:
-- 1. Execute este script no Supabase SQL Editor
-- 2. O script verifica se o usuário já existe
-- 3. Se não existir, cria a conta
-- 4. Cria assinatura gratuita de 1 ano (365 dias)
-- =====================================================

DO $$
DECLARE
  email_usuario TEXT := 'portalmagra@gmail.com';
  user_id_existente UUID;
  user_id_final UUID;
  period_start TIMESTAMP WITH TIME ZONE;
  period_end TIMESTAMP WITH TIME ZONE;
  subscription_id UUID;
  senha_provisoria TEXT;
BEGIN
  -- Data de início: agora
  period_start := NOW();
  -- Data de término: 1 ano a partir de agora (365 dias)
  period_end := NOW() + INTERVAL '365 days';
  
  -- =====================================================
  -- 1. VERIFICAR SE USUÁRIO JÁ EXISTE
  -- =====================================================
  SELECT id INTO user_id_existente
  FROM auth.users
  WHERE email = email_usuario;
  
  IF user_id_existente IS NOT NULL THEN
    RAISE NOTICE '✅ Usuário já existe com ID: %', user_id_existente;
    user_id_final := user_id_existente;
  ELSE
    -- =====================================================
    -- 2. CRIAR USUÁRIO NO SUPABASE AUTH
    -- =====================================================
    -- Nota: Para criar usuário via SQL, você precisa usar
    -- a função auth.users ou criar via Supabase Dashboard
    -- Por enquanto, vamos apenas verificar e criar a assinatura
    -- se o usuário existir
    
    RAISE EXCEPTION 'Usuário com email % não encontrado. Por favor, crie a conta primeiro via /pt/coach/login ou via Supabase Dashboard (Authentication > Users > Add User). Depois execute novamente este script.', email_usuario;
  END IF;
  
  -- =====================================================
  -- 3. VERIFICAR SE JÁ TEM ASSINATURA ATIVA PARA COACH
  -- =====================================================
  IF EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = user_id_final
      AND area = 'coach'
      AND status = 'active'
      AND current_period_end > NOW()
  ) THEN
    RAISE NOTICE '⚠️ Usuário já tem assinatura ativa para Coach. Cancelando assinatura antiga...';
    
    -- Cancelar assinatura antiga
    UPDATE subscriptions
    SET status = 'canceled',
        canceled_at = NOW(),
        updated_at = NOW()
    WHERE user_id = user_id_final
      AND area = 'coach'
      AND status = 'active'
      AND current_period_end > NOW();
  END IF;
  
  -- =====================================================
  -- 4. CRIAR ASSINATURA GRATUITA DE 1 ANO
  -- =====================================================
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
    requires_manual_renewal,
    created_at,
    updated_at
  ) VALUES (
    user_id_final,
    'coach',
    'free',
    'active',
    period_start,
    period_end,
    'br',
    'free_' || user_id_final::text || '_coach_' || EXTRACT(EPOCH FROM NOW())::bigint,
    'free_' || user_id_final::text,
    'free',
    0,
    'brl',
    false,
    NOW(),
    NOW()
  )
  RETURNING id INTO subscription_id;
  
  RAISE NOTICE '✅ Assinatura gratuita criada com sucesso!';
  RAISE NOTICE '   ID da Assinatura: %', subscription_id;
  RAISE NOTICE '   Válida até: %', period_end;
  RAISE NOTICE '   Duração: 365 dias (1 ano)';
  
  -- =====================================================
  -- 5. VERIFICAR/CRIAR PERFIL DO USUÁRIO
  -- =====================================================
  -- NOTA: Não alteramos o perfil existente (Wellness)
  -- O usuário pode ter múltiplas áreas (Wellness + Coach)
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = user_id_final
  ) THEN
    -- Criar perfil básico se não existir
    INSERT INTO user_profiles (
      user_id,
      email,
      perfil,
      created_at,
      updated_at
    ) VALUES (
      user_id_final,
      email_usuario,
      'coach',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Perfil criado';
  ELSE
    -- Não alterar o perfil existente (mantém Wellness)
    -- O usuário terá acesso a ambas as áreas através das assinaturas
    RAISE NOTICE '✅ Perfil já existe (mantido como está - pode ter múltiplas áreas)';
  END IF;
  
  -- =====================================================
  -- 6. RESULTADO FINAL
  -- =====================================================
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ASSINATURA COACH CRIADA COM SUCESSO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: %', email_usuario;
  RAISE NOTICE 'User ID: %', user_id_final;
  RAISE NOTICE 'Área: Coach (Nova)';
  RAISE NOTICE 'Plano: Gratuito (1 ano)';
  RAISE NOTICE 'Válido até: %', period_end;
  RAISE NOTICE '';
  RAISE NOTICE 'ℹ️  A assinatura Wellness foi mantida';
  RAISE NOTICE '   O usuário terá acesso a ambas as áreas';
  RAISE NOTICE '========================================';
  
END $$;

-- =====================================================
-- VERIFICAÇÃO: Mostrar resultado final
-- =====================================================
-- Mostrar todas as assinaturas ativas do usuário
SELECT 
  u.email,
  up.perfil as perfil_principal,
  s.area,
  s.id as subscription_id,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.current_period_end - NOW() as tempo_restante,
  CASE 
    WHEN s.area = 'coach' THEN '✅ Coach (Nova)'
    WHEN s.area = 'wellness' THEN '✅ Wellness (Mantida)'
    ELSE s.area
  END as observacao
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active' AND s.current_period_end > NOW()
WHERE u.email = 'portalmagra@gmail.com'
ORDER BY s.area;

