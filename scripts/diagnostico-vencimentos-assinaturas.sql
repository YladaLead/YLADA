-- =====================================================
-- DIAGNÓSTICO: Problemas com Vencimentos de Assinaturas
-- =====================================================
-- Execute este script no Supabase SQL Editor para identificar problemas
-- Data: [Data Atual]

-- =====================================================
-- 1. MÚLTIPLAS SUBSCRIPTIONS ATIVAS POR USUÁRIO/ÁREA
-- =====================================================
-- Identifica usuários com mais de uma subscription ativa
-- para a mesma área (deve ser apenas 1)

SELECT 
  s.user_id,
  s.area,
  COUNT(*) as total_ativas,
  STRING_AGG(s.id::text, ', ') as subscription_ids,
  STRING_AGG(s.current_period_end::text, ', ') as datas_vencimento,
  STRING_AGG(s.created_at::text, ', ') as datas_criacao,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
GROUP BY s.user_id, s.area, up.email, up.nome_completo
HAVING COUNT(*) > 1
ORDER BY total_ativas DESC, s.user_id;

-- =====================================================
-- 2. SUBSCRIPTIONS VENCIDAS MAS COM STATUS ATIVO
-- =====================================================
-- Identifica subscriptions que aparecem como ativas
-- mas a data de vencimento já passou

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.current_period_end::date - CURRENT_DATE as dias_vencido,
  s.created_at,
  s.updated_at,
  up.email,
  up.nome_completo,
  s.stripe_subscription_id,
  s.is_migrated,
  s.migrated_from
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.current_period_end < NOW()
ORDER BY s.current_period_end ASC;

-- =====================================================
-- 3. DATAS DE VENCIMENTO REPETIDAS
-- =====================================================
-- Identifica datas de vencimento que aparecem múltiplas vezes
-- (pode indicar problema de migração ou webhook duplicado)

SELECT 
  current_period_end::date as data_vencimento,
  COUNT(*) as total_subscriptions,
  COUNT(DISTINCT user_id) as usuarios_diferentes,
  COUNT(DISTINCT area) as areas_diferentes,
  STRING_AGG(user_id::text, ', ') as user_ids,
  STRING_AGG(area, ', ') as areas,
  STRING_AGG(id::text, ', ') as subscription_ids
FROM subscriptions
WHERE status = 'active'
GROUP BY current_period_end::date
HAVING COUNT(*) > 1
ORDER BY total_subscriptions DESC, data_vencimento DESC;

-- =====================================================
-- 4. SUBSCRIPTIONS CRIADAS RECENTEMENTE MAS JÁ VENCIDAS
-- =====================================================
-- Identifica subscriptions criadas nos últimos 30 dias
-- mas que já estão vencidas (indica problema no cálculo)

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.status,
  s.created_at,
  s.current_period_end,
  s.current_period_end::date - s.created_at::date as dias_diferenca,
  CASE 
    WHEN s.current_period_end::date - s.created_at::date < 0 THEN '❌ Vencida antes de ser criada'
    WHEN s.current_period_end::date - s.created_at::date < 28 THEN '⚠️ Menos de 1 mês'
    WHEN s.current_period_end::date - s.created_at::date < 365 THEN '✅ Entre 1 mês e 1 ano'
    ELSE '✅ Mais de 1 ano'
  END as validacao,
  up.email,
  up.nome_completo,
  s.is_migrated,
  s.migrated_from
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.created_at > NOW() - INTERVAL '30 days'
  AND s.current_period_end < NOW()
ORDER BY s.created_at DESC;

-- =====================================================
-- 5. PAGAMENTOS RECENTES VS VENCIMENTOS ANTIGOS
-- =====================================================
-- Identifica subscriptions com pagamentos recentes
-- mas data de vencimento antiga (indica problema na renovação)

SELECT 
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.status,
  s.current_period_end,
  s.created_at as subscription_criada,
  MAX(p.created_at) as ultimo_pagamento,
  COUNT(p.id) as total_pagamentos,
  CASE 
    WHEN MAX(p.created_at) > s.current_period_end THEN '❌ Pagamento após vencimento'
    WHEN MAX(p.created_at) IS NOT NULL AND s.current_period_end < NOW() THEN '⚠️ Vencida mas teve pagamento'
    ELSE '✅ OK'
  END as situacao,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN payments p ON p.subscription_id = s.id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
GROUP BY s.id, s.user_id, s.area, s.status, s.current_period_end, s.created_at, up.email, up.nome_completo
HAVING (MAX(p.created_at) > s.current_period_end)
    OR (MAX(p.created_at) IS NOT NULL AND s.current_period_end < NOW())
ORDER BY ultimo_pagamento DESC NULLS LAST;

-- =====================================================
-- 6. SUBSCRIPTIONS MIGRADAS COM PROBLEMAS
-- =====================================================
-- Identifica subscriptions migradas que podem ter problemas

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.status,
  s.current_period_end,
  s.created_at,
  s.is_migrated,
  s.migrated_from,
  s.requires_manual_renewal,
  CASE 
    WHEN s.current_period_end < NOW() THEN '❌ Vencida'
    WHEN s.current_period_end::date - CURRENT_DATE < 7 THEN '⚠️ Vence em menos de 7 dias'
    ELSE '✅ OK'
  END as situacao,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.is_migrated = true
  AND s.status = 'active'
ORDER BY s.current_period_end ASC;

-- =====================================================
-- 7. RESUMO GERAL
-- =====================================================
-- Estatísticas gerais sobre subscriptions

SELECT 
  'Total de Subscriptions Ativas' as metrica,
  COUNT(*)::text as valor
FROM subscriptions
WHERE status = 'active'

UNION ALL

SELECT 
  'Subscriptions Vencidas (mas status ativo)' as metrica,
  COUNT(*)::text as valor
FROM subscriptions
WHERE status = 'active' AND current_period_end < NOW()

UNION ALL

SELECT 
  'Usuários com Múltiplas Subscriptions Ativas' as metrica,
  COUNT(DISTINCT user_id)::text as valor
FROM (
  SELECT user_id, area
  FROM subscriptions
  WHERE status = 'active'
  GROUP BY user_id, area
  HAVING COUNT(*) > 1
) as duplicatas

UNION ALL

SELECT 
  'Subscriptions Migradas' as metrica,
  COUNT(*)::text as valor
FROM subscriptions
WHERE is_migrated = true AND status = 'active'

UNION ALL

SELECT 
  'Subscriptions Criadas nos Últimos 30 Dias' as metrica,
  COUNT(*)::text as valor
FROM subscriptions
WHERE created_at > NOW() - INTERVAL '30 days' AND status = 'active'

UNION ALL

SELECT 
  'Subscriptions que Vencem nos Próximos 7 Dias' as metrica,
  COUNT(*)::text as valor
FROM subscriptions
WHERE status = 'active' 
  AND current_period_end BETWEEN NOW() AND NOW() + INTERVAL '7 days';

-- =====================================================
-- 8. ANÁLISE POR ÁREA
-- =====================================================
-- Estatísticas por área para identificar padrões

SELECT 
  area,
  COUNT(*) as total_ativas,
  COUNT(*) FILTER (WHERE current_period_end < NOW()) as vencidas,
  COUNT(*) FILTER (WHERE current_period_end BETWEEN NOW() AND NOW() + INTERVAL '7 days') as vencem_em_7_dias,
  COUNT(*) FILTER (WHERE is_migrated = true) as migradas,
  ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) as dias_medio_validade
FROM subscriptions
WHERE status = 'active'
GROUP BY area
ORDER BY area;

-- =====================================================
-- FIM DO DIAGNÓSTICO
-- =====================================================
-- Execute cada query individualmente para análise detalhada
-- Ou execute todas de uma vez para visão completa

