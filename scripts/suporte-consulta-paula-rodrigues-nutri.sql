-- =====================================================
-- SUPORTE: Paula Rodrigues / Ana Paula Rodrigues (Nutri)
-- Cobrança indevida – cancelou nos 7 dias
-- Use no Supabase → SQL Editor para obter dados para reembolso e cancelamento no gateway
-- =====================================================

-- 1) Usuário e perfil (qualquer um dos emails)
SELECT
  '1_usuario' AS bloco,
  au.id AS user_id,
  au.email AS email_auth,
  up.nome_completo,
  up.perfil AS area
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
WHERE LOWER(au.email) IN (
  LOWER('anarodriguespr10@gmail.com'),
  LOWER('paula.rodrigues@example.com')
)
   OR LOWER(up.nome_completo) LIKE '%paula%rodrigues%'
   OR LOWER(up.nome_completo) LIKE '%ana paula%rodrigues%';

-- 2) Assinaturas Nutri (ativas e canceladas)
SELECT
  '2_assinaturas' AS bloco,
  s.id AS subscription_id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount / 100.0 AS valor_reais,
  s.current_period_start,
  s.current_period_end,
  s.canceled_at,
  s.created_at AS assinatura_criada_em,
  s.stripe_subscription_id,
  s.stripe_customer_id
FROM subscriptions s
WHERE s.area = 'nutri'
  AND s.user_id IN (
    SELECT id FROM auth.users WHERE LOWER(email) = LOWER('anarodriguespr10@gmail.com')
    UNION
    SELECT user_id FROM user_profiles WHERE LOWER(nome_completo) LIKE '%paula%rodrigues%'
  )
ORDER BY s.created_at DESC;

-- 3) Pagamentos (para achar ID da transação no Mercado Pago / Stripe e valor)
SELECT
  '3_pagamentos' AS bloco,
  p.id AS payment_id,
  p.user_id,
  p.subscription_id,
  p.stripe_payment_intent_id AS id_transacao_gateway,
  p.amount / 100.0 AS valor_reais,
  p.status,
  p.payment_method,
  p.created_at
FROM payments p
WHERE p.user_id IN (SELECT id FROM auth.users WHERE LOWER(email) = LOWER('anarodriguespr10@gmail.com'))
   OR p.subscription_id IN (
     SELECT id FROM subscriptions WHERE area = 'nutri'
       AND user_id IN (SELECT id FROM auth.users WHERE LOWER(email) = LOWER('anarodriguespr10@gmail.com'))
   )
ORDER BY p.created_at DESC;

-- 4) Tentativas de cancelamento (se usou o fluxo de cancelar pelo app)
SELECT
  '4_cancel_attempts' AS bloco,
  ca.id AS cancel_attempt_id,
  ca.user_id,
  ca.subscription_id,
  ca.cancel_reason,
  ca.request_refund,
  ca.final_action,
  ca.canceled_at,
  ca.created_at
FROM cancel_attempts ca
WHERE ca.user_id IN (SELECT id FROM auth.users WHERE LOWER(email) = LOWER('anarodriguespr10@gmail.com'))
   OR ca.subscription_id IN (
     SELECT id FROM subscriptions WHERE area = 'nutri'
       AND user_id IN (SELECT id FROM auth.users WHERE LOWER(email) = LOWER('anarodriguespr10@gmail.com'))
   )
ORDER BY ca.created_at DESC;
