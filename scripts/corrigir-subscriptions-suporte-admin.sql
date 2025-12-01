-- =====================================================
-- CORREÇÃO: Subscriptions de Suporte e Administrador
-- =====================================================
-- Este script identifica e corrige subscriptions de
-- suporte/admin nas áreas coach, nutri e nutra que
-- podem ter datas de vencimento incorretas
-- 
-- Nota: Wellness já foi validado e está correto

-- =====================================================
-- 1. IDENTIFICAR SUBSCRIPTIONS DE SUPORTE/ADMIN
-- =====================================================
-- Subscriptions que não são migradas e podem ser
-- de suporte ou administrador

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.created_at,
  s.current_period_start,
  s.current_period_end,
  s.is_migrated,
  EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 as dias_validade,
  CASE 
    WHEN s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60 THEN '❌ Mensal com mais de 60 dias'
    WHEN s.plan_type = 'annual' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400 THEN '❌ Anual com mais de 400 dias'
    WHEN s.plan_type = 'free' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400 THEN '❌ Gratuito com mais de 400 dias'
    ELSE '✅ OK'
  END as situacao,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.is_migrated = false  -- Apenas não migradas
  AND s.area IN ('coach', 'nutri', 'nutra')  -- Outras áreas
  AND (
    (s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60)
    OR (s.plan_type = 'annual' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    OR (s.plan_type = 'free' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
  )
ORDER BY s.area, dias_validade DESC;

-- =====================================================
-- 2. VER TODAS AS SUBSCRIPTIONS DE OUTRAS ÁREAS
-- =====================================================
-- Ver todas (mesmo as que parecem corretas) para
-- entender o padrão

SELECT 
  s.area,
  s.plan_type,
  COUNT(*) as total,
  ROUND(AVG(EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400)) as dias_medio,
  MIN(EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400) as dias_min,
  MAX(EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400) as dias_max,
  STRING_AGG(s.id::text, ', ') as subscription_ids
FROM subscriptions s
WHERE s.status = 'active'
  AND s.is_migrated = false
  AND s.area IN ('coach', 'nutri', 'nutra')
GROUP BY s.area, s.plan_type
ORDER BY s.area, s.plan_type;

-- =====================================================
-- 3. CALCULAR DATAS CORRETAS
-- =====================================================
-- Mostra como as datas deveriam ser

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.created_at,
  s.current_period_end as data_atual,
  CASE 
    WHEN s.plan_type = 'monthly' THEN 
      (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 month')::timestamp
    WHEN s.plan_type = 'annual' THEN 
      (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 year')::timestamp
    WHEN s.plan_type = 'free' THEN 
      (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 year')::timestamp
    ELSE s.current_period_end
  END as data_vencimento_corrigida,
  EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 as dias_atual,
  EXTRACT(EPOCH FROM (
    CASE 
      WHEN s.plan_type = 'monthly' THEN (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 month')::timestamp
      WHEN s.plan_type = 'annual' THEN (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 year')::timestamp
      WHEN s.plan_type = 'free' THEN (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 year')::timestamp
      ELSE s.current_period_end
    END - s.created_at
  )) / 86400 as dias_corrigido,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.is_migrated = false
  AND s.area IN ('coach', 'nutri', 'nutra')
  AND (
    (s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60)
    OR (s.plan_type = 'annual' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    OR (s.plan_type = 'free' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
  )
ORDER BY s.area, dias_atual DESC;

-- =====================================================
-- 4. CORRIGIR MENSAIS COM MAIS DE 60 DIAS
-- =====================================================
-- ATENÇÃO: Revise a query 3 antes de executar!

UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 month')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = false
  AND area IN ('coach', 'nutri', 'nutra')
  AND plan_type = 'monthly'
  AND EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 60;

-- =====================================================
-- 5. CORRIGIR ANUAIS COM MAIS DE 400 DIAS
-- =====================================================
-- ATENÇÃO: Revise a query 3 antes de executar!

UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = false
  AND area IN ('coach', 'nutri', 'nutra')
  AND plan_type = 'annual'
  AND EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 400;

-- =====================================================
-- 6. CORRIGIR GRATUITOS COM MAIS DE 400 DIAS
-- =====================================================
-- ATENÇÃO: Revise a query 3 antes de executar!

UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = false
  AND area IN ('coach', 'nutri', 'nutra')
  AND plan_type = 'free'
  AND EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 400;

-- =====================================================
-- 7. VERIFICAR CORREÇÕES APLICADAS
-- =====================================================

SELECT 
  area,
  plan_type,
  COUNT(*) as total,
  ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) as dias_medio,
  MIN(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400) as dias_min,
  MAX(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400) as dias_max,
  CASE 
    WHEN plan_type = 'monthly' AND ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) BETWEEN 28 AND 60 THEN '✅ OK'
    WHEN plan_type = 'annual' AND ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) BETWEEN 350 AND 370 THEN '✅ OK'
    WHEN plan_type = 'free' AND ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) BETWEEN 330 AND 380 THEN '✅ OK'
    ELSE '⚠️ Verificar'
  END as validacao
FROM subscriptions
WHERE status = 'active'
  AND is_migrated = false
  AND area IN ('coach', 'nutri', 'nutra')
GROUP BY area, plan_type
ORDER BY area, plan_type;

-- =====================================================
-- FIM
-- =====================================================
-- IMPORTANTE:
-- 1. Execute a query 1 para ver subscriptions com problemas
-- 2. Execute a query 2 para ver todas as subscriptions (estatísticas)
-- 3. Execute a query 3 para ver as datas corrigidas (REVISAR!)
-- 4. Execute queries 4, 5 e 6 para aplicar correções
-- 5. Execute query 7 para verificar

