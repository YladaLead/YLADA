-- =====================================================
-- VERIFICAR TODOS OS CASOS COM USER_ID INCONSISTENTE
-- =====================================================
-- Execute este script no Supabase SQL Editor para ver
-- quantos casos migrados têm problema de user_id

-- =====================================================
-- RESUMO GERAL
-- =====================================================
SELECT 
  'RESUMO GERAL' as tipo,
  COUNT(*) as total_subscriptions_migradas,
  COUNT(DISTINCT u.email) as total_usuarios_migrados,
  COUNT(CASE WHEN s.user_id != up.user_id OR up.user_id IS NULL THEN 1 END) as casos_com_problema,
  COUNT(CASE WHEN s.user_id = up.user_id THEN 1 END) as casos_ok
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.is_migrated = true
  AND s.status = 'active';

-- =====================================================
-- LISTA DETALHADA DE CASOS COM PROBLEMA
-- =====================================================
SELECT 
  'CASOS COM PROBLEMA' as tipo,
  s.id as subscription_id,
  s.user_id as subscription_user_id,
  u.email,
  up.user_id as perfil_user_id,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  CASE 
    WHEN up.user_id IS NULL THEN '❌ SEM PERFIL'
    WHEN s.user_id != up.user_id THEN '❌ USER_ID DIFERENTE'
    ELSE '✅ OK'
  END as problema,
  -- Mostrar qual seria o user_id correto
  (
    SELECT up2.user_id 
    FROM user_profiles up2 
    WHERE up2.email = u.email
    ORDER BY up2.created_at DESC
    LIMIT 1
  ) as user_id_correto
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.is_migrated = true
  AND s.status = 'active'
  AND (
    -- Subscription.user_id não tem perfil correspondente
    up.user_id IS NULL
    -- OU subscription.user_id é diferente do perfil.user_id
    OR s.user_id != (
      SELECT up2.user_id 
      FROM user_profiles up2 
      WHERE up2.email = u.email
      ORDER BY up2.created_at DESC
      LIMIT 1
    )
  )
ORDER BY u.email, s.created_at DESC;

-- =====================================================
-- CASOS OK (para comparação)
-- =====================================================
SELECT 
  'CASOS OK' as tipo,
  s.id as subscription_id,
  s.user_id,
  u.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  '✅ OK' as status
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
INNER JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.is_migrated = true
  AND s.status = 'active'
  AND s.user_id = up.user_id
ORDER BY u.email, s.created_at DESC
LIMIT 10; -- Limitar a 10 para não sobrecarregar

-- =====================================================
-- ESTATÍSTICAS POR ÁREA
-- =====================================================
SELECT 
  s.area,
  COUNT(*) as total,
  COUNT(CASE WHEN s.user_id != up.user_id OR up.user_id IS NULL THEN 1 END) as com_problema,
  COUNT(CASE WHEN s.user_id = up.user_id THEN 1 END) as ok,
  ROUND(
    COUNT(CASE WHEN s.user_id != up.user_id OR up.user_id IS NULL THEN 1 END) * 100.0 / COUNT(*),
    2
  ) as percentual_problema
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.is_migrated = true
  AND s.status = 'active'
GROUP BY s.area
ORDER BY s.area;

