-- =====================================================
-- ENCONTRAR PAGAMENTO ANUAL QUE NÃO ESTÁ APARECENDO NOS GANHOS
-- Execute este script para encontrar subscriptions anuais recentes
-- =====================================================

-- 1. SUBSCRIPTIONS ANUAIS CRIADAS NAS ÚLTIMAS 24 HORAS
SELECT 
  '1. SUBSCRIPTIONS ANUAIS RECENTES (Últimas 24h)' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount / 100.0 as valor_reais,
  s.currency,
  s.current_period_start,
  s.current_period_end,
  s.created_at,
  up.email,
  up.nome_completo,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ Deveria aparecer'
    WHEN s.status != 'active' THEN '❌ Status não é active: ' || s.status
    WHEN s.current_period_end <= NOW() THEN '❌ Já expirou'
    ELSE '⚠️ Verificar'
  END as motivo_nao_aparece
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.plan_type = 'annual'
  AND s.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY s.created_at DESC;

-- 2. SUBSCRIPTIONS ANUAIS COM STATUS DIFERENTE DE 'active'
SELECT 
  '2. SUBSCRIPTIONS ANUAIS COM STATUS PROBLEMÁTICO' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.status,
  s.amount / 100.0 as valor_reais,
  s.created_at,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.plan_type = 'annual'
  AND s.status != 'active'
  AND s.created_at >= NOW() - INTERVAL '7 days'
ORDER BY s.created_at DESC;

-- 3. SUBSCRIPTIONS ANUAIS QUE JÁ EXPIRARAM (mas foram criadas recentemente)
SELECT 
  '3. SUBSCRIPTIONS ANUAIS QUE EXPIRARAM PREMATURAMENTE' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.status,
  s.amount / 100.0 as valor_reais,
  s.current_period_end,
  s.created_at,
  up.email,
  up.nome_completo,
  NOW() - s.current_period_end as tempo_expirado
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.plan_type = 'annual'
  AND s.current_period_end <= NOW()
  AND s.created_at >= NOW() - INTERVAL '7 days'
ORDER BY s.created_at DESC;

-- 4. VERIFICAR PAGAMENTOS REGISTRADOS (Últimas 24h)
SELECT 
  '4. PAGAMENTOS REGISTRADOS (Últimas 24h)' as verificacao,
  p.id as payment_id,
  p.subscription_id,
  p.user_id,
  p.amount / 100.0 as valor_reais,
  p.status as payment_status,
  p.created_at,
  s.plan_type,
  s.status as subscription_status,
  up.email,
  up.nome_completo
FROM payments p
JOIN subscriptions s ON p.subscription_id = s.id
LEFT JOIN user_profiles up ON p.user_id = up.user_id
WHERE p.created_at >= NOW() - INTERVAL '24 hours'
  AND s.plan_type = 'annual'
ORDER BY p.created_at DESC;

-- 5. COMPARAR: SUBSCRIPTIONS vs PAGAMENTOS (Últimas 24h)
-- Se há subscription mas não há payment, pode ser problema no webhook
SELECT 
  '5. SUBSCRIPTIONS SEM PAGAMENTO REGISTRADO' as verificacao,
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount / 100.0 as valor_reais,
  s.created_at,
  up.email,
  up.nome_completo,
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM payments p WHERE p.subscription_id = s.id
    ) THEN '❌ SEM PAGAMENTO REGISTRADO'
    ELSE '✅ Tem pagamento'
  END as tem_pagamento
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.plan_type = 'annual'
  AND s.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY s.created_at DESC;

-- 6. TODAS AS SUBSCRIPTIONS ANUAIS ATIVAS (para verificar se aparecem na API)
SELECT 
  '6. TODAS AS SUBSCRIPTIONS ANUAIS ATIVAS' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.status,
  s.amount / 100.0 as valor_reais,
  s.current_period_end,
  s.created_at,
  up.email,
  up.nome_completo,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ Deveria aparecer na API'
    ELSE '❌ Não aparece'
  END as status_api
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.plan_type = 'annual'
  AND s.status = 'active'
  AND s.current_period_end > NOW()
ORDER BY s.created_at DESC
LIMIT 20;

