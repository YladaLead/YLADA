-- =====================================================
-- DIAGNÓSTICO: Pagamentos vs Assinaturas
-- Verifica se há pagamentos aprovados que não geraram assinaturas
-- ou assinaturas que não têm pagamentos vinculados
-- =====================================================

-- =====================================================
-- 1. PAGAMENTOS APROVADOS SEM ASSINATURA VINCULADA
-- =====================================================
-- Pagamentos com status 'succeeded' que não têm subscription_id
-- ou cuja subscription não existe mais
SELECT 
  'Pagamentos sem assinatura vinculada' AS tipo,
  COUNT(p.id) AS total,
  SUM(p.amount) / 100.0 AS valor_total_reais
FROM payments p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
WHERE p.status = 'succeeded'
  AND (p.subscription_id IS NULL OR s.id IS NULL)
ORDER BY p.created_at DESC;

-- Detalhes dos pagamentos sem assinatura
SELECT 
  p.id AS payment_id,
  p.user_id,
  up.email,
  up.nome_completo,
  p.amount / 100.0 AS valor_reais,
  p.currency,
  p.status,
  p.payment_method,
  p.stripe_payment_intent_id,
  p.gateway_payment_intent_id,
  p.created_at AS data_pagamento,
  p.subscription_id,
  CASE 
    WHEN p.subscription_id IS NULL THEN 'Sem subscription_id'
    ELSE 'Subscription não existe mais'
  END AS motivo
FROM payments p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
LEFT JOIN user_profiles up ON p.user_id = up.user_id
WHERE p.status = 'succeeded'
  AND (p.subscription_id IS NULL OR s.id IS NULL)
ORDER BY p.created_at DESC
LIMIT 50;

-- =====================================================
-- 2. ASSINATURAS ATIVAS SEM PAGAMENTOS VINCULADOS
-- =====================================================
-- Assinaturas ativas que não têm nenhum pagamento registrado
SELECT 
  'Assinaturas ativas sem pagamentos' AS tipo,
  COUNT(s.id) AS total,
  SUM(s.amount) / 100.0 AS valor_total_reais
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id AND p.status = 'succeeded'
WHERE s.status = 'active'
  AND p.id IS NULL;

-- Detalhes das assinaturas sem pagamentos
SELECT 
  s.id AS subscription_id,
  s.user_id,
  up.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.amount / 100.0 AS valor_reais,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.created_at AS data_criacao,
  s.stripe_subscription_id,
  s.gateway_subscription_id,
  s.is_migrated,
  CASE 
    WHEN s.is_migrated = TRUE THEN 'Migrada (pode não ter pagamento)'
    WHEN s.stripe_subscription_id LIKE 'mp_%' THEN 'Mercado Pago (verificar webhook)'
    ELSE 'Possível problema'
  END AS observacao
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id AND p.status = 'succeeded'
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND p.id IS NULL
ORDER BY s.created_at DESC
LIMIT 50;

-- =====================================================
-- 3. PAGAMENTOS DO MERCADO PAGO (mp_*)
-- =====================================================
-- Listar todos os pagamentos do Mercado Pago
SELECT 
  'Pagamentos Mercado Pago' AS tipo,
  COUNT(p.id) AS total_pagamentos,
  COUNT(DISTINCT p.subscription_id) AS assinaturas_com_pagamento,
  SUM(p.amount) / 100.0 AS valor_total_reais
FROM payments p
WHERE p.stripe_payment_intent_id LIKE 'mp_%' 
   OR p.gateway_payment_intent_id LIKE 'mp_%'
   OR p.stripe_payment_intent_id ~ '^[0-9]+$'; -- IDs numéricos do Mercado Pago

-- Detalhes dos pagamentos do Mercado Pago
SELECT 
  p.id AS payment_id,
  p.user_id,
  up.email,
  up.nome_completo,
  p.amount / 100.0 AS valor_reais,
  p.status,
  p.payment_method,
  p.stripe_payment_intent_id AS mp_payment_id,
  p.subscription_id,
  s.area,
  s.plan_type,
  s.status AS subscription_status,
  p.created_at AS data_pagamento
FROM payments p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
LEFT JOIN user_profiles up ON p.user_id = up.user_id
WHERE (p.stripe_payment_intent_id LIKE 'mp_%' 
   OR p.gateway_payment_intent_id LIKE 'mp_%'
   OR (p.stripe_payment_intent_id ~ '^[0-9]+$' AND p.stripe_payment_intent_id IS NOT NULL))
ORDER BY p.created_at DESC
LIMIT 100;

-- =====================================================
-- 4. ASSINATURAS DO MERCADO PAGO (mp_*)
-- =====================================================
-- Listar todas as assinaturas do Mercado Pago
SELECT 
  'Assinaturas Mercado Pago' AS tipo,
  COUNT(s.id) AS total_assinaturas,
  COUNT(CASE WHEN s.status = 'active' THEN 1 END) AS ativas,
  COUNT(CASE WHEN s.status = 'active' AND s.amount > 0 THEN 1 END) AS ativas_pagantes,
  SUM(CASE WHEN s.status = 'active' THEN s.amount ELSE 0 END) / 100.0 AS valor_total_reais
FROM subscriptions s
WHERE s.stripe_subscription_id LIKE 'mp_%' 
   OR s.gateway_subscription_id LIKE 'mp_%';

-- Detalhes das assinaturas do Mercado Pago
SELECT 
  s.id AS subscription_id,
  s.user_id,
  up.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.amount / 100.0 AS valor_reais,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.stripe_subscription_id,
  s.gateway_subscription_id,
  COUNT(p.id) AS total_pagamentos,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_pago_total,
  s.created_at AS data_criacao
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.stripe_subscription_id LIKE 'mp_%' 
   OR s.gateway_subscription_id LIKE 'mp_%'
GROUP BY s.id, up.email, up.nome_completo
ORDER BY s.created_at DESC
LIMIT 100;

-- =====================================================
-- 5. COMPARAÇÃO: PAGAMENTOS vs ASSINATURAS POR ÁREA
-- =====================================================
-- Resumo por área mostrando pagamentos e assinaturas
SELECT 
  COALESCE(s.area, 'sem_area') AS area,
  COUNT(DISTINCT s.id) AS total_assinaturas_ativas,
  COUNT(DISTINCT CASE WHEN s.status = 'active' AND s.amount > 0 THEN s.id END) AS assinaturas_pagantes,
  COUNT(DISTINCT p.id) AS total_pagamentos_aprovados,
  SUM(CASE WHEN s.status = 'active' AND s.amount > 0 THEN s.amount ELSE 0 END) / 100.0 AS valor_assinaturas_reais,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_pagamentos_reais,
  SUM(CASE WHEN s.status = 'active' AND s.amount > 0 THEN s.amount ELSE 0 END) / 100.0 - 
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS diferenca_reais
FROM subscriptions s
FULL OUTER JOIN payments p ON s.id = p.subscription_id
WHERE s.status = 'active' OR p.status = 'succeeded'
GROUP BY s.area
ORDER BY area;

-- =====================================================
-- 6. PAGAMENTOS RECENTES (ÚLTIMOS 7 DIAS)
-- =====================================================
-- Verificar se pagamentos recentes geraram assinaturas
SELECT 
  p.id AS payment_id,
  p.user_id,
  up.email,
  p.amount / 100.0 AS valor_reais,
  p.status AS payment_status,
  p.payment_method,
  p.stripe_payment_intent_id,
  p.subscription_id,
  s.status AS subscription_status,
  s.area,
  s.plan_type,
  p.created_at AS data_pagamento,
  CASE 
    WHEN p.subscription_id IS NULL THEN '⚠️ SEM ASSINATURA'
    WHEN s.status != 'active' THEN '⚠️ ASSINATURA INATIVA'
    ELSE '✅ OK'
  END AS status_verificacao
FROM payments p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
LEFT JOIN user_profiles up ON p.user_id = up.user_id
WHERE p.created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND p.status = 'succeeded'
ORDER BY p.created_at DESC;

-- =====================================================
-- 7. ASSINATURAS RECENTES (ÚLTIMOS 7 DIAS)
-- =====================================================
-- Verificar se assinaturas recentes têm pagamentos
SELECT 
  s.id AS subscription_id,
  s.user_id,
  up.email,
  s.area,
  s.plan_type,
  s.amount / 100.0 AS valor_reais,
  s.status,
  s.stripe_subscription_id,
  s.gateway_subscription_id,
  COUNT(p.id) AS total_pagamentos,
  COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) AS pagamentos_aprovados,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_pago_total,
  s.created_at AS data_criacao,
  CASE 
    WHEN COUNT(p.id) = 0 THEN '⚠️ SEM PAGAMENTOS'
    WHEN COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) = 0 THEN '⚠️ SEM PAGAMENTOS APROVADOS'
    ELSE '✅ OK'
  END AS status_verificacao
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY s.id, up.email, s.area, s.plan_type, s.amount, s.status, s.stripe_subscription_id, s.gateway_subscription_id, s.created_at
ORDER BY s.created_at DESC;

