-- =====================================================
-- VERIFICAÇÃO: Pagamentos de Hoje
-- Verifica se os 3 pagamentos mensais de hoje foram processados corretamente
-- =====================================================

-- =====================================================
-- 1. PAGAMENTOS APROVADOS HOJE
-- =====================================================
SELECT 
  'Pagamentos Aprovados Hoje' AS tipo,
  COUNT(p.id) AS total,
  COUNT(DISTINCT p.user_id) AS usuarios_diferentes,
  SUM(p.amount) / 100.0 AS valor_total_reais,
  COUNT(CASE WHEN p.subscription_id IS NOT NULL THEN 1 END) AS com_assinatura,
  COUNT(CASE WHEN p.subscription_id IS NULL THEN 1 END) AS sem_assinatura
FROM payments p
WHERE p.created_at >= CURRENT_DATE
  AND p.status = 'succeeded';

-- Detalhes dos pagamentos aprovados de hoje
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
  p.subscription_id,
  s.area,
  s.plan_type,
  s.status AS subscription_status,
  s.amount / 100.0 AS valor_assinatura_reais,
  p.created_at AS data_pagamento,
  EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 60 AS minutos_atras,
  CASE 
    WHEN p.subscription_id IS NULL THEN '⚠️ SEM ASSINATURA'
    WHEN s.status != 'active' THEN '⚠️ ASSINATURA INATIVA'
    WHEN s.area = 'wellness' AND s.plan_type = 'monthly' THEN '✅ MENSAL WELLNESS'
    ELSE '✅ OK'
  END AS status_verificacao
FROM payments p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
LEFT JOIN user_profiles up ON p.user_id = up.user_id
WHERE p.created_at >= CURRENT_DATE
  AND p.status = 'succeeded'
ORDER BY p.created_at DESC;

-- =====================================================
-- 2. ASSINATURAS CRIADAS HOJE
-- =====================================================
SELECT 
  'Assinaturas Criadas Hoje' AS tipo,
  COUNT(s.id) AS total,
  COUNT(CASE WHEN s.status = 'active' THEN 1 END) AS ativas,
  COUNT(CASE WHEN s.area = 'wellness' AND s.plan_type = 'monthly' THEN 1 END) AS mensais_wellness,
  SUM(CASE WHEN s.status = 'active' THEN s.amount ELSE 0 END) / 100.0 AS valor_total_reais
FROM subscriptions s
WHERE s.created_at >= CURRENT_DATE;

-- Detalhes das assinaturas criadas hoje
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
  COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) AS pagamentos_aprovados,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_pago_total,
  s.created_at AS data_criacao,
  EXTRACT(EPOCH FROM (NOW() - s.created_at)) / 60 AS minutos_atras,
  CASE 
    WHEN COUNT(p.id) = 0 THEN '⚠️ SEM PAGAMENTOS'
    WHEN COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) = 0 THEN '⚠️ SEM PAGAMENTOS APROVADOS'
    WHEN s.area = 'wellness' AND s.plan_type = 'monthly' AND s.status = 'active' AND s.amount > 0 THEN '✅ MENSAL WELLNESS PAGANTE'
    ELSE '✅ OK'
  END AS status_verificacao
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.created_at >= CURRENT_DATE
GROUP BY s.id, up.email, up.nome_completo, s.area, s.plan_type, s.amount, s.status, 
         s.current_period_start, s.current_period_end, s.stripe_subscription_id, 
         s.gateway_subscription_id, s.created_at
ORDER BY s.created_at DESC;

-- =====================================================
-- 3. PAGAMENTOS MENSais WELLNESS DE HOJE
-- =====================================================
-- Foco específico nos pagamentos mensais da área Wellness
SELECT 
  'Pagamentos Mensais Wellness Hoje' AS tipo,
  COUNT(p.id) AS total_pagamentos,
  COUNT(DISTINCT p.user_id) AS usuarios_diferentes,
  SUM(p.amount) / 100.0 AS valor_total_reais,
  COUNT(CASE WHEN s.status = 'active' THEN 1 END) AS com_assinatura_ativa,
  COUNT(CASE WHEN s.status = 'active' AND s.amount > 0 THEN 1 END) AS pagantes_ativos
FROM payments p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
WHERE p.created_at >= CURRENT_DATE
  AND p.status = 'succeeded'
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly';

-- Detalhes dos pagamentos mensais Wellness de hoje
SELECT 
  p.id AS payment_id,
  p.user_id,
  up.email,
  up.nome_completo,
  p.amount / 100.0 AS valor_pagamento_reais,
  s.amount / 100.0 AS valor_assinatura_reais,
  p.status AS payment_status,
  s.status AS subscription_status,
  s.area,
  s.plan_type,
  up.is_admin,
  up.is_support,
  CASE
    WHEN up.is_admin = TRUE OR up.is_support = TRUE THEN 'suporte'
    WHEN s.amount = 0 THEN 'gratuita'
    ELSE 'pagante'
  END AS categoria_calculada,
  p.payment_method,
  p.stripe_payment_intent_id,
  p.subscription_id,
  p.created_at AS data_pagamento,
  s.created_at AS data_criacao_assinatura,
  EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 60 AS minutos_atras,
  CASE 
    WHEN p.subscription_id IS NULL THEN '⚠️ SEM ASSINATURA'
    WHEN s.status != 'active' THEN '⚠️ ASSINATURA INATIVA'
    WHEN up.is_admin = TRUE OR up.is_support = TRUE THEN 'ℹ️ SUPORTE/ADMIN'
    WHEN s.amount = 0 THEN 'ℹ️ GRATUITA'
    WHEN s.amount > 0 AND s.status = 'active' THEN '✅ PAGANTE ATIVA'
    ELSE '❓ VERIFICAR'
  END AS status_detalhado
FROM payments p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
LEFT JOIN user_profiles up ON p.user_id = up.user_id
WHERE p.created_at >= CURRENT_DATE
  AND p.status = 'succeeded'
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly'
ORDER BY p.created_at DESC;

-- =====================================================
-- 4. ASSINATURAS MENSais WELLNESS CRIADAS HOJE
-- =====================================================
-- Foco específico nas assinaturas mensais Wellness criadas hoje
SELECT 
  'Assinaturas Mensais Wellness Criadas Hoje' AS tipo,
  COUNT(s.id) AS total_assinaturas,
  COUNT(CASE WHEN s.status = 'active' THEN 1 END) AS ativas,
  COUNT(CASE WHEN s.status = 'active' AND s.amount > 0 THEN 1 END) AS pagantes,
  COUNT(CASE WHEN s.status = 'active' AND s.amount = 0 THEN 1 END) AS gratuitas,
  COUNT(CASE WHEN up.is_admin = TRUE OR up.is_support = TRUE THEN 1 END) AS suporte_admin,
  SUM(CASE WHEN s.status = 'active' AND s.amount > 0 THEN s.amount ELSE 0 END) / 100.0 AS valor_total_pagantes_reais
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.created_at >= CURRENT_DATE
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly';

-- Detalhes das assinaturas mensais Wellness criadas hoje
SELECT 
  s.id AS subscription_id,
  s.user_id,
  up.email,
  up.nome_completo,
  s.amount / 100.0 AS valor_reais,
  s.status,
  up.is_admin,
  up.is_support,
  CASE
    WHEN up.is_admin = TRUE OR up.is_support = TRUE THEN 'suporte'
    WHEN s.amount = 0 THEN 'gratuita'
    ELSE 'pagante'
  END AS categoria_calculada,
  COUNT(p.id) AS total_pagamentos,
  COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) AS pagamentos_aprovados,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_pago_total,
  s.current_period_start,
  s.current_period_end,
  s.stripe_subscription_id,
  s.gateway_subscription_id,
  s.created_at AS data_criacao,
  EXTRACT(EPOCH FROM (NOW() - s.created_at)) / 60 AS minutos_atras,
  CASE 
    WHEN COUNT(p.id) = 0 THEN '⚠️ SEM PAGAMENTOS'
    WHEN COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) = 0 THEN '⚠️ SEM PAGAMENTOS APROVADOS'
    WHEN up.is_admin = TRUE OR up.is_support = TRUE THEN 'ℹ️ SUPORTE/ADMIN'
    WHEN s.amount = 0 THEN 'ℹ️ GRATUITA'
    WHEN s.amount > 0 AND s.status = 'active' THEN '✅ PAGANTE ATIVA'
    ELSE '❓ VERIFICAR'
  END AS status_detalhado
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.created_at >= CURRENT_DATE
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly'
GROUP BY s.id, up.email, up.nome_completo, s.amount, s.status, up.is_admin, up.is_support,
         s.current_period_start, s.current_period_end, s.stripe_subscription_id, 
         s.gateway_subscription_id, s.created_at
ORDER BY s.created_at DESC;

-- =====================================================
-- 5. COMPARAÇÃO: PAGAMENTOS vs ASSINATURAS HOJE
-- =====================================================
-- Verificar se há discrepâncias entre pagamentos e assinaturas de hoje
SELECT 
  'Comparação Hoje' AS tipo,
  COUNT(DISTINCT p.id) AS total_pagamentos_aprovados,
  COUNT(DISTINCT s.id) AS total_assinaturas_criadas,
  COUNT(DISTINCT CASE WHEN p.subscription_id IS NOT NULL THEN p.id END) AS pagamentos_com_assinatura,
  COUNT(DISTINCT CASE WHEN p.subscription_id IS NULL THEN p.id END) AS pagamentos_sem_assinatura,
  COUNT(DISTINCT CASE WHEN EXISTS (SELECT 1 FROM payments p2 WHERE p2.subscription_id = s.id AND p2.status = 'succeeded') THEN s.id END) AS assinaturas_com_pagamento,
  COUNT(DISTINCT CASE WHEN NOT EXISTS (SELECT 1 FROM payments p2 WHERE p2.subscription_id = s.id AND p2.status = 'succeeded') THEN s.id END) AS assinaturas_sem_pagamento
FROM payments p
FULL OUTER JOIN subscriptions s ON (
  p.created_at >= CURRENT_DATE 
  OR s.created_at >= CURRENT_DATE
)
WHERE (p.created_at >= CURRENT_DATE AND p.status = 'succeeded')
   OR s.created_at >= CURRENT_DATE;

