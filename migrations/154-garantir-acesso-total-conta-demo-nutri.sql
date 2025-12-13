-- =====================================================
-- GARANTIR ACESSO TOTAL PARA CONTA DEMO NUTRI
-- Migração 154: Marcar conta demo como admin/suporte + garantir assinatura completa
-- =====================================================

-- 1. Marcar conta demo como suporte (acesso total à área Nutri, SEM acesso ao /admin)
-- IMPORTANTE: is_admin = false para NÃO ter acesso à área administrativa (/admin)
UPDATE user_profiles
SET 
  is_admin = false, -- NÃO é admin (sem acesso ao /admin)
  is_support = true, -- É suporte (acesso total à área Nutri, mas SEM /admin)
  updated_at = NOW()
WHERE email = 'demo.nutri@ylada.com';

-- 2. Garantir que a assinatura tenha features completas
-- Primeiro, tentar atualizar se existir
UPDATE subscriptions
SET 
  features = '["cursos", "completo"]'::jsonb,
  status = 'active',
  plan_type = 'free',
  current_period_start = COALESCE(current_period_start, NOW()),
  current_period_end = NOW() + INTERVAL '10 years', -- 10 anos para conta demo
  updated_at = NOW()
WHERE user_id = (
  SELECT user_id FROM user_profiles WHERE email = 'demo.nutri@ylada.com'
)
AND area = 'nutri';

-- Se não existir, criar a assinatura
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
SELECT 
  up.user_id,
  'nutri',
  'active',
  'free',
  '["cursos", "completo"]'::jsonb,
  'br',
  'free_' || up.user_id::text || '_nutri_' || EXTRACT(EPOCH FROM NOW())::bigint,
  'free_' || up.user_id::text,
  'free',
  0,
  'brl',
  NOW(),
  NOW() + INTERVAL '10 years',
  NOW(),
  NOW()
FROM user_profiles up
WHERE up.email = 'demo.nutri@ylada.com'
  AND NOT EXISTS (
    SELECT 1 FROM subscriptions s 
    WHERE s.user_id = up.user_id 
    AND s.area = 'nutri'
  );

-- 3. Garantir que profile_type está correto
UPDATE user_profiles
SET 
  profile_type = 'nutri',
  updated_at = NOW()
WHERE email = 'demo.nutri@ylada.com'
  AND (profile_type IS NULL OR profile_type != 'nutri');

-- 4. Verificar resultado final
SELECT 
  '✅ CONTA DEMO CONFIGURADA' as status,
  up.email,
  up.nome_completo,
  up.profile_type,
  up.is_admin,
  up.is_support,
  s.status as subscription_status,
  s.plan_type,
  s.features,
  s.current_period_start,
  s.current_period_end,
  CASE 
    WHEN up.is_support = true THEN '✅ ACESSO TOTAL ÁREA NUTRI (Suporte - SEM acesso /admin)'
    WHEN up.is_admin = true THEN '✅ ACESSO TOTAL (Admin - COM acesso /admin)'
    WHEN s.status = 'active' AND s.features ? 'completo' THEN '✅ ACESSO TOTAL (Assinatura Completa)'
    ELSE '⚠️ VERIFICAR CONFIGURAÇÃO'
  END as acesso_status,
  CASE
    WHEN up.is_support = true AND s.status = 'active' AND s.features ? 'completo' THEN '✅ TUDO OK'
    WHEN up.is_support = false THEN '⚠️ is_support deve ser true'
    WHEN s.status != 'active' THEN '⚠️ Assinatura deve estar active'
    WHEN NOT (s.features ? 'completo') THEN '⚠️ Features deve incluir "completo"'
    ELSE '⚠️ VERIFICAR'
  END as verificacao
FROM user_profiles up
LEFT JOIN subscriptions s ON s.user_id = up.user_id AND s.area = 'nutri'
WHERE up.email = 'demo.nutri@ylada.com';

-- 5. Resumo final
DO $$
DECLARE
  v_user_exists BOOLEAN;
  v_is_support BOOLEAN;
  v_subscription_exists BOOLEAN;
  v_subscription_active BOOLEAN;
  v_has_completo BOOLEAN;
BEGIN
  -- Verificar se usuário existe
  SELECT EXISTS(SELECT 1 FROM user_profiles WHERE email = 'demo.nutri@ylada.com') INTO v_user_exists;
  
  IF v_user_exists THEN
    -- Verificar is_support
    SELECT is_support INTO v_is_support FROM user_profiles WHERE email = 'demo.nutri@ylada.com';
    
    -- Verificar assinatura
    SELECT 
      EXISTS(SELECT 1 FROM subscriptions s 
             JOIN user_profiles up ON s.user_id = up.user_id 
             WHERE up.email = 'demo.nutri@ylada.com' AND s.area = 'nutri'),
      EXISTS(SELECT 1 FROM subscriptions s 
             JOIN user_profiles up ON s.user_id = up.user_id 
             WHERE up.email = 'demo.nutri@ylada.com' AND s.area = 'nutri' AND s.status = 'active'),
      EXISTS(SELECT 1 FROM subscriptions s 
             JOIN user_profiles up ON s.user_id = up.user_id 
             WHERE up.email = 'demo.nutri@ylada.com' AND s.area = 'nutri' AND s.features ? 'completo')
    INTO v_subscription_exists, v_subscription_active, v_has_completo;
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RESUMO DA CONFIGURAÇÃO DA CONTA DEMO';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Email: demo.nutri@ylada.com';
    RAISE NOTICE 'Usuário existe: %', CASE WHEN v_user_exists THEN '✅ SIM' ELSE '❌ NÃO' END;
    RAISE NOTICE 'is_support: %', CASE WHEN v_is_support THEN '✅ SIM' ELSE '❌ NÃO' END;
    RAISE NOTICE 'Assinatura existe: %', CASE WHEN v_subscription_exists THEN '✅ SIM' ELSE '❌ NÃO' END;
    RAISE NOTICE 'Assinatura ativa: %', CASE WHEN v_subscription_active THEN '✅ SIM' ELSE '❌ NÃO' END;
    RAISE NOTICE 'Feature "completo": %', CASE WHEN v_has_completo THEN '✅ SIM' ELSE '❌ NÃO' END;
    
    IF v_is_support AND v_subscription_active AND v_has_completo THEN
      RAISE NOTICE '';
      RAISE NOTICE '✅ CONTA DEMO CONFIGURADA COM SUCESSO!';
      RAISE NOTICE '   Acesso total à área Nutri garantido.';
    ELSE
      RAISE NOTICE '';
      RAISE NOTICE '⚠️ ATENÇÃO: Algumas configurações podem estar faltando.';
      RAISE NOTICE '   Verifique os resultados acima.';
    END IF;
    RAISE NOTICE '========================================';
  ELSE
    RAISE NOTICE '❌ ERRO: Usuário demo.nutri@ylada.com não encontrado!';
    RAISE NOTICE '   Execute primeiro a migration 153 ou crie a conta manualmente.';
  END IF;
END $$;


