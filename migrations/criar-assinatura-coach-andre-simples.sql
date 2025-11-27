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
  created_at,
  updated_at
)
SELECT 
  up.id as user_id,
  'coach' as area,
  'monthly' as plan_type,
  'active' as status,
  ARRAY['completo']::text[] as features,
  NOW() as current_period_start,
  (NOW() + INTERVAL '10 years')::timestamp as current_period_end,
  NOW() as created_at,
  NOW() as updated_at
FROM user_profiles up
WHERE up.user_slug = 'andre'
  AND NOT EXISTS (
    SELECT 1 FROM subscriptions s
    WHERE s.user_id = up.id
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
JOIN user_profiles up ON s.user_id = up.id
WHERE up.user_slug = 'andre'
  AND s.area = 'coach'
ORDER BY s.created_at DESC
LIMIT 1;

