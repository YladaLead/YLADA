-- =====================================================
-- SCRIPT PARA VERIFICAR VENCIMENTOS DE ASSINATURAS
-- =====================================================
-- Este script mostra onde encontrar os vencimentos no Supabase
-- Tabela: subscriptions
-- Campo: current_period_end

-- =====================================================
-- 1. VER TODAS AS ASSINATURAS COM VENCIMENTO
-- =====================================================
SELECT 
  s.id as subscription_id,
  u.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start as inicio_periodo,
  s.current_period_end as vencimento,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento,
  s.created_at as criado_em,
  s.updated_at as atualizado_em,
  s.welcome_email_sent as email_enviado
FROM subscriptions s
LEFT JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
ORDER BY s.current_period_end ASC;

-- =====================================================
-- 2. VER ASSINATURAS VENCENDO EM 30 DIAS
-- =====================================================
SELECT 
  s.id as subscription_id,
  u.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.current_period_end as vencimento,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento
FROM subscriptions s
LEFT JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.current_period_end::date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
ORDER BY s.current_period_end ASC;

-- =====================================================
-- 3. VER ASSINATURAS JÁ VENCIDAS
-- =====================================================
SELECT 
  s.id as subscription_id,
  u.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.current_period_end as vencimento,
  CURRENT_DATE - s.current_period_end::date as dias_vencido
FROM subscriptions s
LEFT JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.current_period_end < NOW()
ORDER BY s.current_period_end ASC;

-- =====================================================
-- 4. VER ASSINATURAS DE UM USUÁRIO ESPECÍFICO
-- =====================================================
-- Substitua 'EMAIL_DO_USUARIO' pelo email desejado
SELECT 
  s.id as subscription_id,
  u.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start as inicio_periodo,
  s.current_period_end as vencimento,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento,
  s.welcome_email_sent as email_enviado
FROM subscriptions s
LEFT JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE u.email = 'gladisgordaliza@gmail.com' -- OU outro email
ORDER BY s.current_period_end DESC;

-- =====================================================
-- 5. VER PAGAMENTOS RELACIONADOS A UMA ASSINATURA
-- =====================================================
SELECT 
  p.id as payment_id,
  p.amount / 100.0 as valor_reais,
  p.currency,
  p.status as status_pagamento,
  p.payment_method,
  p.created_at as data_pagamento,
  s.current_period_end as vencimento_apos_pagamento
FROM payments p
INNER JOIN subscriptions s ON s.id = p.subscription_id
WHERE s.user_id = (SELECT id FROM auth.users WHERE email = 'gladisgordaliza@gmail.com')
ORDER BY p.created_at DESC;

-- =====================================================
-- RESUMO: ONDE ENCONTRAR VENCIMENTOS
-- =====================================================
-- Tabela: subscriptions
-- Campo principal: current_period_end (TIMESTAMP WITH TIME ZONE)
-- 
-- Para verificar vencimento:
-- 1. Acesse Supabase Dashboard
-- 2. Vá em "Table Editor"
-- 3. Selecione tabela "subscriptions"
-- 4. Coluna "current_period_end" mostra o vencimento
-- 
-- Filtros úteis:
-- - status = 'active' (apenas ativas)
-- - current_period_end > NOW() (ainda não vencidas)
-- - current_period_end < NOW() (já vencidas)

