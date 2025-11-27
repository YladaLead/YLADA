-- =====================================================
-- CRIAR ASSINATURA COACH: Usuário "andre"
-- Criar assinatura ativa para Coach baseada em outras assinaturas
-- =====================================================

-- 1. Buscar user_id e informações de outras assinaturas
WITH usuario_info AS (
  SELECT id as user_id
  FROM user_profiles
  WHERE user_slug = 'andre'
  LIMIT 1
),
assinatura_referencia AS (
  SELECT 
    plan_type,
    features,
    current_period_end,
    stripe_account,
    stripe_subscription_id,
    stripe_customer_id,
    stripe_price_id,
    amount,
    currency
  FROM subscriptions s
  JOIN user_profiles up ON s.user_id = up.id
  WHERE up.user_slug = 'andre'
    AND s.status = 'active'
    AND s.current_period_end > NOW()
  ORDER BY s.created_at DESC
  LIMIT 1
)
-- 2. Criar assinatura Coach (usando referência de outras áreas ou padrão)
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  status,
  features,
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
SELECT 
  ui.user_id,
  'coach' as area,
  COALESCE(ar.plan_type, 'free') as plan_type,
  'active' as status,
  COALESCE(ar.features, '["completo"]'::jsonb) as features,
  NOW() as current_period_start,
  COALESCE(ar.current_period_end, (NOW() + INTERVAL '10 years')::timestamp) as current_period_end,
  -- Campos Stripe obrigatórios (valores fictícios para plano gratuito)
  COALESCE(ar.stripe_account, 'br') as stripe_account,
  COALESCE(ar.stripe_subscription_id, 'free_' || ui.user_id::text || '_coach_' || EXTRACT(EPOCH FROM NOW())::bigint) as stripe_subscription_id,
  COALESCE(ar.stripe_customer_id, 'free_' || ui.user_id::text) as stripe_customer_id,
  COALESCE(ar.stripe_price_id, 'free') as stripe_price_id,
  COALESCE(ar.amount, 0) as amount,
  COALESCE(ar.currency, 'brl') as currency,
  NOW() as created_at,
  NOW() as updated_at
FROM usuario_info ui
CROSS JOIN LATERAL (
  SELECT 
    plan_type,
    features,
    current_period_end,
    stripe_account,
    stripe_subscription_id,
    stripe_customer_id,
    stripe_price_id,
    amount,
    currency
  FROM subscriptions s
  WHERE s.user_id = ui.user_id
    AND s.status = 'active'
    AND s.current_period_end > NOW()
  ORDER BY s.created_at DESC
  LIMIT 1
) ar
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions 
  WHERE user_id = ui.user_id 
    AND area = 'coach' 
    AND status = 'active'
    AND current_period_end > NOW()
)
RETURNING 
  id,
  user_id,
  area,
  plan_type,
  status,
  features,
  current_period_end,
  '✅ ASSINATURA COACH CRIADA' as status_criacao;

-- 3. Se não tiver assinatura de referência, criar com valores padrão
-- (Execute apenas se a query acima não retornar nada)
DO $$
DECLARE
  v_user_id UUID;
  v_assinatura_existe BOOLEAN;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM user_profiles
  WHERE user_slug = 'andre'
  LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário "andre" não encontrado';
  END IF;
  
  -- Verificar se já existe assinatura Coach ativa
  SELECT EXISTS(
    SELECT 1 FROM subscriptions 
    WHERE user_id = v_user_id 
      AND area = 'coach' 
      AND status = 'active'
      AND current_period_end > NOW()
  ) INTO v_assinatura_existe;
  
  -- Criar assinatura se não existir
  IF NOT v_assinatura_existe THEN
    INSERT INTO subscriptions (
      user_id,
      area,
      plan_type,
      status,
      features,
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
      'coach',
      'free',
      'active',
      '["completo"]'::jsonb,
      NOW(),
      (NOW() + INTERVAL '10 years')::timestamp,
      'br',
      'free_' || v_user_id::text || '_coach_' || EXTRACT(EPOCH FROM NOW())::bigint,
      'free_' || v_user_id::text,
      'free',
      0,
      'brl',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Assinatura Coach criada para usuário %', v_user_id;
  ELSE
    RAISE NOTICE 'ℹ️ Usuário já tem assinatura Coach ativa';
  END IF;
END $$;

-- 4. Verificar assinatura criada
SELECT 
  '✅ VERIFICAÇÃO FINAL' as tipo_info,
  s.id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  s.features,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ ATIVA E VÁLIDA'
    ELSE '❌ PROBLEMA'
  END as status_final
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.id
WHERE up.user_slug = 'andre'
  AND s.area = 'coach'
ORDER BY s.created_at DESC
LIMIT 1;

