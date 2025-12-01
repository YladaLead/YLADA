-- =====================================================
-- CORREÇÃO: Assinaturas com amount=0 mas com pagamentos aprovados
-- =====================================================
-- Identifica assinaturas que têm pagamentos aprovados mas amount=0
-- Isso pode acontecer se o webhook não atualizou o amount corretamente

-- =====================================================
-- 1. IDENTIFICAR ASSINATURAS COM PROBLEMA
-- =====================================================
SELECT 
  s.id AS subscription_id,
  s.user_id,
  up.email,
  s.area,
  s.plan_type,
  s.amount / 100.0 AS valor_assinatura_atual,
  s.status,
  COUNT(p.id) AS total_pagamentos,
  COUNT(CASE WHEN p.status = 'succeeded' THEN 1 END) AS pagamentos_aprovados,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_total_pago,
  MAX(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_ultimo_pagamento,
  s.created_at,
  s.updated_at,
  CASE 
    WHEN s.amount = 0 AND SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) > 0 THEN '⚠️ CORRIGIR'
    ELSE 'OK'
  END AS acao
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.amount = 0
  AND EXISTS (
    SELECT 1 FROM payments p2 
    WHERE p2.subscription_id = s.id 
    AND p2.status = 'succeeded'
  )
GROUP BY s.id, up.email, s.area, s.plan_type, s.amount, s.status, s.created_at, s.updated_at
ORDER BY valor_total_pago DESC;

-- =====================================================
-- 2. CORRIGIR ASSINATURAS (ATUALIZAR amount)
-- =====================================================
-- IMPORTANTE: Execute apenas após revisar os resultados da query 1
-- Esta query atualiza o amount da assinatura com o valor do último pagamento aprovado

UPDATE subscriptions s
SET 
  amount = (
    SELECT MAX(p.amount)
    FROM payments p
    WHERE p.subscription_id = s.id
      AND p.status = 'succeeded'
  ),
  updated_at = NOW()
WHERE s.status = 'active'
  AND s.amount = 0
  AND EXISTS (
    SELECT 1 FROM payments p2 
    WHERE p2.subscription_id = s.id 
    AND p2.status = 'succeeded'
  )
  AND (
    SELECT MAX(p.amount)
    FROM payments p
    WHERE p.subscription_id = s.id
      AND p.status = 'succeeded'
  ) > 0;

-- =====================================================
-- 3. VERIFICAR CORREÇÕES APLICADAS
-- =====================================================
-- Verificar se as correções foram aplicadas corretamente
SELECT 
  s.id AS subscription_id,
  up.email,
  s.area,
  s.plan_type,
  s.amount / 100.0 AS valor_assinatura_corrigido,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_total_pago,
  CASE 
    WHEN s.amount = SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) THEN '✅ CORRIGIDO'
    WHEN s.amount > 0 THEN '✅ TEM VALOR'
    ELSE '⚠️ AINDA ZERO'
  END AS status_correcao
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND EXISTS (
    SELECT 1 FROM payments p2 
    WHERE p2.subscription_id = s.id 
    AND p2.status = 'succeeded'
  )
GROUP BY s.id, up.email, s.area, s.plan_type, s.amount
HAVING s.amount = 0 OR s.amount != SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END)
ORDER BY s.updated_at DESC
LIMIT 20;

-- =====================================================
-- 4. VERIFICAR AS 8 ASSINATURAS ESPECÍFICAS CORRIGIDAS
-- =====================================================
-- Verificar se as 8 assinaturas identificadas foram corrigidas
SELECT 
  s.id AS subscription_id,
  up.email,
  s.area,
  s.plan_type,
  s.amount / 100.0 AS valor_assinatura_corrigido,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) / 100.0 AS valor_total_pago,
  s.updated_at AS data_atualizacao,
  CASE 
    WHEN s.amount = SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) THEN '✅ CORRIGIDO'
    WHEN s.amount > 0 THEN '✅ TEM VALOR'
    ELSE '⚠️ AINDA ZERO'
  END AS status_correcao
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.id IN (
  '5cfd7997-84ac-4182-abb0-80865f36c598', -- olivio.ortola@gmail.com
  '6f4213c5-6d27-4f35-aa6f-3198220b2b2b', -- marta421@outlook.com
  '8330e936-0af0-4341-a0dd-063352951caa', -- mmg.monica@hotmail.com
  'a7a36870-81f8-4c3c-ba76-bc1b436a4cbb', -- angelicafolego345@gmail.com
  'c94f3059-ef84-4edf-a0a5-b53ff9f8f9af', -- claudiavitto@hotmail.com
  'e8a8a085-be4b-4f52-a912-981d02b57eaf', -- vidasaudavelaracy@gmail.com
  'f5f8415f-0f95-489e-a15f-6458a59b5310', -- gladisgordaliza@gmail.com
  'fc1479b7-d984-4bd9-9343-bede5fd2050f'  -- albuquerquegaldino1959@gmail.com
)
GROUP BY s.id, up.email, s.area, s.plan_type, s.amount, s.updated_at
ORDER BY up.email;

