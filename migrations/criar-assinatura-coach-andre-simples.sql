-- =====================================================
-- CRIAR ASSINATURA COACH: Usuário "andre" (SIMPLES)
-- Versão simplificada para executar rapidamente
-- =====================================================

-- Criar assinatura Coach para usuário "andre"
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
  up.user_id,
  'coach' as area,
  'free' as plan_type,
  'active' as status,
  '["completo"]'::jsonb as features,
  NOW() as current_period_start,
  (NOW() + INTERVAL '10 years')::timestamp as current_period_end,
  -- Campos Stripe obrigatórios (valores fictícios para plano gratuito)
  'br' as stripe_account,
  'free_' || up.user_id::text || '_coach_' || EXTRACT(EPOCH FROM NOW())::bigint as stripe_subscription_id,
  'free_' || up.user_id::text as stripe_customer_id,
  'free' as stripe_price_id,
  0 as amount,
  'brl' as currency,
  NOW() as created_at,
  NOW() as updated_at
FROM user_profiles up
WHERE up.user_slug = 'andre'
  AND NOT EXISTS (
    SELECT 1 FROM subscriptions s
    WHERE s.user_id = up.user_id
      AND s.area = 'coach'
      AND s.status = 'active'
      AND s.current_period_end > NOW()
  )
RETURNING 
  id,
  user_id,
  area,
  plan_type,
  status,
  features,
  current_period_end,
  '✅ ASSINATURA COACH CRIADA PARA ANDRE' as status_criacao;

-- Verificar se foi criada
SELECT 
  '✅ VERIFICAÇÃO' as tipo_info,
  s.id,
  s.area,
  s.status,
  s.current_period_end,
  s.features,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ ATIVA'
    ELSE '❌ PROBLEMA'
  END as status_final
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.user_id
WHERE up.user_slug = 'andre'
  AND s.area = 'coach'
ORDER BY s.created_at DESC
LIMIT 1;

