-- =====================================================
-- VERIFICAR SUBSCRIPTION ESPECÍFICA QUE NÃO APARECE
-- Use este script para verificar uma subscription específica
-- =====================================================

-- Substitua o ID abaixo pelo ID da subscription que não está aparecendo
-- ID encontrado: 5c2d4038-eb71-4c2a-8608-8c73a63f2133 (R$ 574,80 - Wellness - 01/12/2025)

-- 1. VERIFICAR SUBSCRIPTION ESPECÍFICA
SELECT 
  '1. DETALHES DA SUBSCRIPTION' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount,
  s.amount / 100.0 as valor_reais,
  s.currency,
  s.current_period_start,
  s.current_period_end,
  s.created_at,
  s.is_migrated,
  s.migrated_from,
  up.email,
  up.nome_completo,
  -- Verificar se atende critérios da API
  CASE 
    WHEN s.status = 'active' THEN '✅ Status OK'
    ELSE '❌ Status: ' || s.status
  END as status_check,
  CASE 
    WHEN s.current_period_end > NOW() THEN '✅ Não expirou'
    ELSE '❌ Já expirou em: ' || s.current_period_end::text
  END as expiracao_check,
  CASE 
    WHEN s.plan_type = 'free' THEN '⚠️ Plano gratuito (não conta na receita)'
    WHEN s.amount IS NULL OR s.amount = 0 THEN '⚠️ Valor zero ou nulo'
    ELSE '✅ Tem valor'
  END as valor_check
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.id = '5c2d4038-eb71-4c2a-8608-8c73a63f2133';  -- ⚠️ SUBSTITUA PELO ID

-- 2. VERIFICAR SE HÁ PAGAMENTO REGISTRADO
SELECT 
  '2. PAGAMENTO REGISTRADO' as verificacao,
  p.id as payment_id,
  p.subscription_id,
  p.amount / 100.0 as valor_reais,
  p.status,
  p.created_at,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Pagamento registrado'
    ELSE '❌ SEM PAGAMENTO REGISTRADO'
  END as tem_pagamento
FROM payments p
WHERE p.subscription_id = '5c2d4038-eb71-4c2a-8608-8c73a63f2133';  -- ⚠️ SUBSTITUA PELO ID

-- 3. VERIFICAR SE APARECE NA QUERY DA API (simular filtro da API)
SELECT 
  '3. SIMULAÇÃO DA QUERY DA API' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount / 100.0 as valor_reais,
  s.current_period_end,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() AND s.plan_type != 'free' AND (s.amount IS NOT NULL AND s.amount > 0) THEN '✅ DEVERIA APARECER'
    ELSE '❌ NÃO APARECE - Verificar critérios'
  END as aparece_na_api
FROM subscriptions s
WHERE s.id = '5c2d4038-eb71-4c2a-8608-8c73a63f2133';  -- ⚠️ SUBSTITUA PELO ID

-- 4. VERIFICAR TODAS AS SUBSCRIPTIONS RECENTES DA MESMA ÁREA (para comparar)
SELECT 
  '4. OUTRAS SUBSCRIPTIONS WELLNESS RECENTES' as verificacao,
  s.id,
  s.plan_type,
  s.status,
  s.amount / 100.0 as valor_reais,
  s.created_at,
  up.email,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ Ativa'
    ELSE '❌ Inativa/Expirada'
  END as status_visual
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.area = 'wellness'
  AND s.created_at >= (NOW() - INTERVAL '7 days')
ORDER BY s.created_at DESC;

