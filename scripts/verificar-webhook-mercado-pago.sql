-- =====================================================
-- VERIFICAÇÃO: Webhook Mercado Pago
-- Verifica se há padrões que indicam problemas com webhooks
-- =====================================================

-- =====================================================
-- 1. ASSINATURAS CRIADAS HOJE SEM PAGAMENTOS
-- =====================================================
-- Assinaturas criadas hoje que ainda não têm pagamentos
-- (pode indicar que o webhook de pagamento não chegou)
SELECT 
  s.id AS subscription_id,
  s.user_id,
  up.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.amount / 100.0 AS valor_reais,
  s.status,
  s.stripe_subscription_id,
  s.gateway_subscription_id,
  s.created_at,
  EXTRACT(EPOCH FROM (NOW() - s.created_at)) / 60 AS minutos_desde_criacao,
  CASE 
    WHEN s.stripe_subscription_id LIKE 'mp_%' OR s.gateway_subscription_id LIKE 'mp_%' THEN 'Mercado Pago'
    ELSE 'Outro gateway'
  END AS gateway
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.created_at >= CURRENT_DATE
  AND s.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM payments p 
    WHERE p.subscription_id = s.id 
    AND p.status = 'succeeded'
  )
ORDER BY s.created_at DESC;

-- =====================================================
-- 2. PAGAMENTOS APROVADOS HOJE SEM ASSINATURA
-- =====================================================
-- Pagamentos aprovados hoje que não têm assinatura vinculada
-- (pode indicar que o webhook de subscription não chegou ou falhou)
SELECT 
  p.id AS payment_id,
  p.user_id,
  up.email,
  up.nome_completo,
  p.amount / 100.0 AS valor_reais,
  p.status,
  p.payment_method,
  p.stripe_payment_intent_id,
  p.gateway_payment_intent_id,
  p.subscription_id,
  p.created_at,
  EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 60 AS minutos_desde_pagamento,
  CASE 
    WHEN p.stripe_payment_intent_id LIKE 'mp_%' 
      OR p.gateway_payment_intent_id LIKE 'mp_%'
      OR (p.stripe_payment_intent_id ~ '^[0-9]+$' AND p.stripe_payment_intent_id IS NOT NULL)
    THEN 'Mercado Pago'
    ELSE 'Outro gateway'
  END AS gateway
FROM payments p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
LEFT JOIN user_profiles up ON p.user_id = up.user_id
WHERE p.created_at >= CURRENT_DATE
  AND p.status = 'succeeded'
  AND (p.subscription_id IS NULL OR s.id IS NULL)
ORDER BY p.created_at DESC;

-- =====================================================
-- 3. ASSINATURAS COM MÚLTIPLOS PAGAMENTOS (POSSÍVEL DUPLICAÇÃO)
-- =====================================================
-- Assinaturas que têm mais de um pagamento aprovado
-- (pode indicar webhooks duplicados ou pagamentos duplicados)
SELECT 
  s.id AS subscription_id,
  s.user_id,
  up.email,
  s.area,
  s.plan_type,
  s.amount / 100.0 AS valor_assinatura_reais,
  COUNT(p.id) AS total_pagamentos,
  COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) AS pagamentos_aprovados,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_total_pago,
  s.created_at AS data_criacao,
  CASE 
    WHEN COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) > 1 THEN '⚠️ MÚLTIPLOS PAGAMENTOS'
    ELSE 'OK'
  END AS observacao
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
GROUP BY s.id, up.email, s.area, s.plan_type, s.amount, s.created_at
HAVING COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) > 1
ORDER BY total_pagamentos DESC, s.created_at DESC
LIMIT 50;

-- =====================================================
-- 4. PAGAMENTOS DUPLICADOS (MESMO PAYMENT INTENT ID)
-- =====================================================
-- Pagamentos com o mesmo payment_intent_id (webhook duplicado)
SELECT 
  COALESCE(p.stripe_payment_intent_id, p.gateway_payment_intent_id) AS payment_intent_id,
  COUNT(p.id) AS total_registros,
  COUNT(DISTINCT p.subscription_id) AS assinaturas_diferentes,
  SUM(p.amount) / 100.0 AS valor_total_reais,
  STRING_AGG(p.id::text, ', ') AS payment_ids,
  STRING_AGG(DISTINCT p.subscription_id::text, ', ') AS subscription_ids,
  MIN(p.created_at) AS primeiro_registro,
  MAX(p.created_at) AS ultimo_registro
FROM payments p
WHERE p.status = 'succeeded'
  AND (p.stripe_payment_intent_id IS NOT NULL OR p.gateway_payment_intent_id IS NOT NULL)
GROUP BY COALESCE(p.stripe_payment_intent_id, p.gateway_payment_intent_id)
HAVING COUNT(p.id) > 1
ORDER BY total_registros DESC, primeiro_registro DESC
LIMIT 50;

-- =====================================================
-- 5. ASSINATURAS COM GAPS (CRIADAS MUITO ANTES DO PRIMEIRO PAGAMENTO)
-- =====================================================
-- Assinaturas que foram criadas muito antes do primeiro pagamento
-- (pode indicar que o webhook de pagamento demorou muito)
SELECT 
  s.id AS subscription_id,
  s.user_id,
  up.email,
  s.area,
  s.plan_type,
  s.created_at AS data_criacao_assinatura,
  MIN(p.created_at) AS primeiro_pagamento,
  EXTRACT(EPOCH FROM (MIN(p.created_at) - s.created_at)) / 3600 AS horas_entre_criacao_e_pagamento,
  COUNT(p.id) AS total_pagamentos,
  CASE 
    WHEN EXTRACT(EPOCH FROM (MIN(p.created_at) - s.created_at)) / 3600 > 24 THEN '⚠️ GAP > 24h'
    WHEN EXTRACT(EPOCH FROM (MIN(p.created_at) - s.created_at)) / 3600 > 1 THEN '⚠️ GAP > 1h'
    ELSE 'OK'
  END AS observacao
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id AND p.status = 'succeeded'
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND p.id IS NOT NULL
GROUP BY s.id, up.email, s.area, s.plan_type, s.created_at
HAVING EXTRACT(EPOCH FROM (MIN(p.created_at) - s.created_at)) / 3600 > 1
ORDER BY horas_entre_criacao_e_pagamento DESC
LIMIT 50;

-- =====================================================
-- 6. RESUMO GERAL: STATUS DO WEBHOOK
-- =====================================================
-- Resumo geral mostrando possíveis problemas
-- Usando CTEs para evitar problemas com FULL OUTER JOIN
WITH assinaturas_mp AS (
  SELECT 
    s.id,
    s.status
  FROM subscriptions s
  WHERE s.stripe_subscription_id LIKE 'mp_%' 
     OR s.gateway_subscription_id LIKE 'mp_%'
),
pagamentos_mp AS (
  SELECT 
    p.id,
    p.status,
    p.subscription_id
  FROM payments p
  WHERE p.stripe_payment_intent_id LIKE 'mp_%' 
     OR p.gateway_payment_intent_id LIKE 'mp_%'
     OR (p.stripe_payment_intent_id ~ '^[0-9]+$' AND p.stripe_payment_intent_id IS NOT NULL)
)
SELECT 
  'Resumo Webhook Mercado Pago' AS tipo,
  (SELECT COUNT(*) FROM assinaturas_mp) AS total_assinaturas_mp,
  (SELECT COUNT(*) FROM assinaturas_mp WHERE status = 'active') AS assinaturas_ativas_mp,
  (SELECT COUNT(*) FROM pagamentos_mp) AS total_pagamentos_mp,
  (SELECT COUNT(*) FROM pagamentos_mp WHERE status = 'succeeded') AS pagamentos_aprovados_mp,
  (SELECT COUNT(DISTINCT s.id) 
   FROM subscriptions s
   WHERE (s.stripe_subscription_id LIKE 'mp_%' OR s.gateway_subscription_id LIKE 'mp_%')
     AND s.status = 'active'
     AND NOT EXISTS (
       SELECT 1 FROM payments p2 
       WHERE p2.subscription_id = s.id 
       AND p2.status = 'succeeded'
     )
  ) AS assinaturas_sem_pagamento,
  (SELECT COUNT(DISTINCT p.id) 
   FROM payments p
   WHERE (p.stripe_payment_intent_id LIKE 'mp_%' 
      OR p.gateway_payment_intent_id LIKE 'mp_%'
      OR (p.stripe_payment_intent_id ~ '^[0-9]+$' AND p.stripe_payment_intent_id IS NOT NULL))
     AND p.status = 'succeeded'
     AND p.subscription_id IS NULL
  ) AS pagamentos_sem_assinatura;

