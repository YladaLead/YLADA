-- =====================================================
-- GARANTIR ASSINATURAS: Admins e Suporte
-- Garante que todos os usuários admin e suporte
-- tenham assinatura ativa em TODAS as áreas
-- =====================================================

-- 1. Identificar todos os usuários admin e suporte
WITH usuarios_admin_suporte AS (
  SELECT DISTINCT
    up.id as user_id,
    up.user_slug,
    up.nome_completo,
    up.email,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM auth.users u 
        WHERE u.id = up.user_id 
        AND (u.raw_user_meta_data->>'is_admin')::boolean = true
      ) THEN 'admin'
      WHEN up.is_support = true THEN 'suporte'
      ELSE 'outro'
    END as tipo_usuario
  FROM user_profiles up
  WHERE up.is_admin = true 
     OR up.is_support = true
     OR EXISTS (
       SELECT 1 FROM auth.users u 
       WHERE u.id = up.user_id 
       AND (u.raw_user_meta_data->>'is_admin')::boolean = true
     )
),
-- 2. Listar áreas que precisam de assinatura
areas_necessarias AS (
  SELECT * FROM (VALUES
    ('coach'),
    ('nutri'),
    ('wellness'),
    ('nutra')
  ) AS t(area)
)
-- 3. Criar assinaturas faltantes para admins e suporte
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
  uas.user_id,
  an.area,
  'free' as plan_type,
  'active' as status,
  '["completo"]'::jsonb as features,
  NOW() as current_period_start,
  (NOW() + INTERVAL '10 years')::timestamp as current_period_end, -- 10 anos para admins/suporte
  -- Campos Stripe obrigatórios (valores fictícios para plano gratuito)
  'br' as stripe_account,
  'free_' || uas.user_id::text || '_' || an.area || '_' || EXTRACT(EPOCH FROM NOW())::bigint as stripe_subscription_id,
  'free_' || uas.user_id::text as stripe_customer_id,
  'free' as stripe_price_id,
  0 as amount,
  'brl' as currency,
  NOW() as created_at,
  NOW() as updated_at
FROM usuarios_admin_suporte uas
CROSS JOIN areas_necessarias an
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions s
  WHERE s.user_id = uas.user_id
    AND s.area = an.area
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
  '✅ ASSINATURA CRIADA' as status_criacao;

-- 4. Atualizar assinaturas existentes de admins/suporte para garantir que não expirem
UPDATE subscriptions s
SET 
  status = 'active',
  current_period_end = (NOW() + INTERVAL '10 years')::timestamp,
  features = '["completo"]'::jsonb,
  amount = 0,
  currency = 'brl',
  updated_at = NOW()
WHERE EXISTS (
  SELECT 1 FROM user_profiles up
  WHERE up.id = s.user_id
    AND (up.is_admin = true OR up.is_support = true)
)
AND s.status != 'active' 
   OR s.current_period_end <= (NOW() + INTERVAL '1 month')::timestamp;

-- 5. Verificar resultado final
SELECT 
  '📊 VERIFICAÇÃO FINAL' as tipo_info,
  up.user_slug,
  up.nome_completo,
  CASE 
    WHEN up.is_admin = true THEN '👑 ADMIN'
    WHEN up.is_support = true THEN '🛟 SUPORTE'
    ELSE '❓ OUTRO'
  END as tipo_usuario,
  s.area,
  s.status,
  s.current_period_end,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ ATIVA'
    ELSE '❌ PROBLEMA'
  END as status_assinatura
FROM user_profiles up
JOIN subscriptions s ON up.id = s.user_id
WHERE (up.is_admin = true OR up.is_support = true)
  AND s.status = 'active'
  AND s.current_period_end > NOW()
ORDER BY up.user_slug, s.area;

-- 6. Listar usuários admin/suporte que ainda não têm todas as assinaturas
SELECT 
  '⚠️ FALTANDO ASSINATURAS' as tipo_info,
  up.user_slug,
  up.nome_completo,
  CASE 
    WHEN up.is_admin = true THEN '👑 ADMIN'
    WHEN up.is_support = true THEN '🛟 SUPORTE'
    ELSE '❓ OUTRO'
  END as tipo_usuario,
  an.area as area_faltante
FROM user_profiles up
CROSS JOIN (VALUES ('coach'), ('nutri'), ('wellness'), ('nutra')) AS an(area)
WHERE (up.is_admin = true OR up.is_support = true)
  AND NOT EXISTS (
    SELECT 1 FROM subscriptions s
    WHERE s.user_id = up.id
      AND s.area = an.area
      AND s.status = 'active'
      AND s.current_period_end > NOW()
  )
ORDER BY up.user_slug, an.area;

