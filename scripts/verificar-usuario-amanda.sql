-- =====================================================
-- VERIFICAR SITUAÇÃO DA AMANDA BONFOGO
-- Email: amandabonfogo01@gmail.com
-- =====================================================

-- 1. Buscar usuário no auth.users
SELECT 
  id as user_id,
  email,
  created_at,
  email_confirmed_at,
  user_metadata
FROM auth.users
WHERE email ILIKE '%amandabonfogo%'
   OR email ILIKE '%amandabonfogo01%';

-- 2. Buscar perfil do usuário
SELECT 
  up.id,
  up.user_id,
  up.nome_completo,
  up.email,
  up.perfil as area_perfil,
  up.created_at
FROM user_profiles up
WHERE up.email ILIKE '%amandabonfogo%'
   OR up.email ILIKE '%amandabonfogo01%';

-- 3. Buscar assinaturas da Amanda
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.amount,
  s.currency,
  s.created_at,
  CASE 
    WHEN s.current_period_end > NOW() AND s.status = 'active' THEN '✅ ATIVA'
    WHEN s.current_period_end < NOW() AND s.status = 'active' THEN '⚠️ VENCIDA'
    WHEN s.status = 'canceled' THEN '❌ CANCELADA'
    ELSE s.status
  END as situacao
FROM subscriptions s
WHERE s.user_id IN (
  SELECT id FROM auth.users 
  WHERE email ILIKE '%amandabonfogo%' OR email ILIKE '%amandabonfogo01%'
)
ORDER BY s.created_at DESC;

-- 4. Verificar se tem assinatura ativa em Wellness
SELECT 
  'Wellness' as area_procurada,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM subscriptions s
      INNER JOIN auth.users u ON s.user_id = u.id
      WHERE (u.email ILIKE '%amandabonfogo%' OR u.email ILIKE '%amandabonfogo01%')
        AND s.area = 'wellness'
        AND s.status = 'active'
        AND s.current_period_end > NOW()
    ) THEN '✅ TEM ASSINATURA ATIVA EM WELLNESS'
    ELSE '❌ NÃO TEM ASSINATURA ATIVA EM WELLNESS'
  END as resultado;

-- 5. Verificar todas as áreas com assinatura
SELECT 
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  CASE 
    WHEN s.current_period_end > NOW() AND s.status = 'active' THEN 'ATIVA'
    ELSE 'INATIVA'
  END as situacao
FROM subscriptions s
INNER JOIN auth.users u ON s.user_id = u.id
WHERE (u.email ILIKE '%amandabonfogo%' OR u.email ILIKE '%amandabonfogo01%')
ORDER BY s.area, s.created_at DESC;

