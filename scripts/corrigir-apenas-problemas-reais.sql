-- =====================================================
-- CORREÇÃO: Apenas Subscriptions com Problemas Reais
-- =====================================================
-- Este script corrige APENAS subscriptions que realmente
-- têm problemas, não as que estão corretas
-- 
-- Baseado na análise, a maioria está correta!
-- Vamos corrigir apenas as que realmente precisam

-- =====================================================
-- 1. IDENTIFICAR APENAS PROBLEMAS REAIS
-- =====================================================
-- Subscriptions com:
-- - Mensais com mais de 60 dias
-- - Anuais/Gratuitos com mais de 400 dias
-- - Datas muito no futuro (2026+ para mensais)
-- - original_expiry_date mais recente que current_period_end (usar ela)

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.created_at,
  s.current_period_end as data_atual,
  s.original_expiry_date as data_original,
  EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 as dias_validade,
  CASE 
    -- Mensal com mais de 60 dias
    WHEN s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60 THEN '❌ Mensal com mais de 60 dias'
    -- Anual/Gratuito com mais de 400 dias
    WHEN s.plan_type IN ('annual', 'free') AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400 THEN '❌ Anual/Gratuito com mais de 400 dias'
    -- Mensal vencendo em 2026+ (muito no futuro)
    WHEN s.plan_type = 'monthly' AND s.current_period_end > '2026-01-01'::timestamp THEN '❌ Mensal vencendo em 2026+'
    -- original_expiry_date mais recente e válida
    WHEN s.original_expiry_date IS NOT NULL 
         AND s.original_expiry_date < s.current_period_end 
         AND s.original_expiry_date > NOW()
         AND s.original_expiry_date <= (s.created_at + INTERVAL '2 months') THEN '✅ Usar original_expiry_date'
    ELSE '✅ OK - Não precisa correção'
  END as situacao,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.is_migrated = true
  AND (
    -- Mensal com mais de 60 dias
    (s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60)
    -- Anual/Gratuito com mais de 400 dias
    OR (s.plan_type IN ('annual', 'free') AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    -- Mensal vencendo em 2026+
    OR (s.plan_type = 'monthly' AND s.current_period_end > '2026-01-01'::timestamp)
    -- original_expiry_date mais recente e válida
    OR (s.original_expiry_date IS NOT NULL 
        AND s.original_expiry_date < s.current_period_end 
        AND s.original_expiry_date > NOW()
        AND s.original_expiry_date <= (s.created_at + INTERVAL '2 months'))
  )
ORDER BY 
  CASE 
    WHEN s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60 THEN 1
    WHEN s.plan_type = 'monthly' AND s.current_period_end > '2026-01-01'::timestamp THEN 2
    WHEN s.original_expiry_date IS NOT NULL 
         AND s.original_expiry_date < s.current_period_end 
         AND s.original_expiry_date > NOW() THEN 3
    ELSE 4
  END,
  s.current_period_end DESC;

-- =====================================================
-- 2. CALCULAR DATAS CORRETAS (APENAS PARA PROBLEMAS)
-- =====================================================

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.created_at,
  s.current_period_end as data_atual,
  s.original_expiry_date as data_original,
  CASE 
    -- Se original_expiry_date é válida e mais recente, usar ela
    WHEN s.original_expiry_date IS NOT NULL 
         AND s.original_expiry_date < s.current_period_end 
         AND s.original_expiry_date > NOW()
         AND s.original_expiry_date <= (s.created_at + INTERVAL '2 months') THEN s.original_expiry_date
    -- Mensal com mais de 60 dias ou vencendo em 2026+: recalcular
    WHEN s.plan_type = 'monthly' AND (
      EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60
      OR s.current_period_end > '2026-01-01'::timestamp
    ) THEN (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 month')::timestamp
    -- Anual/Gratuito com mais de 400 dias: recalcular
    WHEN s.plan_type IN ('annual', 'free') 
         AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400 
    THEN (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 year')::timestamp
    ELSE s.current_period_end
  END as data_vencimento_corrigida,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.is_migrated = true
  AND (
    (s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60)
    OR (s.plan_type IN ('annual', 'free') AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    OR (s.plan_type = 'monthly' AND s.current_period_end > '2026-01-01'::timestamp)
    OR (s.original_expiry_date IS NOT NULL 
        AND s.original_expiry_date < s.current_period_end 
        AND s.original_expiry_date > NOW()
        AND s.original_expiry_date <= (s.created_at + INTERVAL '2 months'))
  )
ORDER BY s.created_at DESC;

-- =====================================================
-- 3. CORRIGIR USANDO original_expiry_date (SE VÁLIDA)
-- =====================================================
-- Apenas se original_expiry_date for mais recente,
-- válida (não vencida) e razoável (não mais de 2 meses)

UPDATE subscriptions
SET 
  current_period_end = original_expiry_date,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND original_expiry_date IS NOT NULL
  AND original_expiry_date < current_period_end
  AND original_expiry_date > NOW()
  AND original_expiry_date <= (created_at + INTERVAL '2 months');

-- =====================================================
-- 4. CORRIGIR MENAIS COM MAIS DE 60 DIAS OU VENCENDO EM 2026+
-- =====================================================

UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 month')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND plan_type = 'monthly'
  AND (
    EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 60
    OR current_period_end > '2026-01-01'::timestamp
  );

-- =====================================================
-- 5. CORRIGIR ANUAIS/GRATUITOS COM MAIS DE 400 DIAS
-- =====================================================

UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND plan_type IN ('annual', 'free')
  AND EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 400;

-- =====================================================
-- 6. VERIFICAR CORREÇÕES
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
  AND is_migrated = true
GROUP BY area, plan_type
ORDER BY area, plan_type;

-- =====================================================
-- FIM
-- =====================================================
-- IMPORTANTE: Este script corrige APENAS problemas reais
-- Subscriptions corretas (30 dias mensais, 365 dias anuais)
-- NÃO serão alteradas!

