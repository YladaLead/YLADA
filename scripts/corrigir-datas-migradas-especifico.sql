-- =====================================================
-- CORREÇÃO ESPECÍFICA: Subscriptions Migradas
-- =====================================================
-- Este script corrige subscriptions migradas que têm
-- datas de vencimento incorretas
-- 
-- Baseado nos resultados da análise, muitas foram
-- migradas com datas em 2025-12-12 18:19:XX (suspeito)

-- =====================================================
-- 1. IDENTIFICAR SUBSCRIPTIONS MIGRADAS COM PROBLEMAS
-- =====================================================
-- Subscriptions migradas com datas muito no futuro
-- ou datas suspeitas (todas no mesmo horário)

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.created_at,
  s.current_period_start,
  s.current_period_end as data_atual,
  s.original_expiry_date as data_original,
  s.migrated_from,
  EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 as dias_desde_criacao,
  CASE 
    WHEN s.original_expiry_date IS NOT NULL 
         AND s.original_expiry_date < s.current_period_end 
         AND s.original_expiry_date > NOW() THEN '✅ Usar data original'
    WHEN s.original_expiry_date IS NOT NULL 
         AND s.original_expiry_date = s.current_period_end THEN '⚠️ Datas iguais - recalcular'
    WHEN EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400 THEN '❌ Data muito no futuro'
    WHEN s.current_period_end::text LIKE '2025-12-12 18:19:%' THEN '❌ Data suspeita (migração em lote)'
    ELSE '✅ OK'
  END as situacao,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.is_migrated = true
  AND (
    -- Data muito no futuro
    (s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60)
    OR (s.plan_type = 'annual' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    OR (s.plan_type = 'free' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    -- Data suspeita (migração em lote)
    OR s.current_period_end::text LIKE '2025-12-12 18:19:%'
    -- Data original mais recente que atual
    OR (s.original_expiry_date IS NOT NULL 
        AND s.original_expiry_date < s.current_period_end 
        AND s.original_expiry_date > NOW())
  )
ORDER BY s.current_period_end DESC;

-- =====================================================
-- 2. CALCULAR DATAS CORRETAS PARA MIGRADAS
-- =====================================================
-- Prioridade:
-- 1. Se original_expiry_date existe e é válida, usar ela
-- 2. Se não, calcular baseado em created_at + tipo de plano
-- 3. Se created_at for suspeito, usar current_period_start

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.created_at,
  s.current_period_start,
  s.current_period_end as data_atual,
  s.original_expiry_date as data_original,
  CASE 
    -- Prioridade 1: Usar original_expiry_date se for válida e mais recente
    WHEN s.original_expiry_date IS NOT NULL 
         AND s.original_expiry_date < s.current_period_end 
         AND s.original_expiry_date > NOW() THEN s.original_expiry_date
    -- Prioridade 2: Calcular baseado em created_at ou current_period_start
    WHEN s.plan_type = 'monthly' THEN 
      (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 month')::timestamp
    WHEN s.plan_type = 'annual' THEN 
      (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 year')::timestamp
    WHEN s.plan_type = 'free' THEN 
      (GREATEST(s.created_at, s.current_period_start) + INTERVAL '1 year')::timestamp
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
    OR (s.plan_type = 'annual' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    OR (s.plan_type = 'free' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    OR s.current_period_end::text LIKE '2025-12-12 18:19:%'
    OR (s.original_expiry_date IS NOT NULL 
        AND s.original_expiry_date < s.current_period_end 
        AND s.original_expiry_date > NOW())
  )
ORDER BY s.created_at DESC;

-- =====================================================
-- 3. CORRIGIR USANDO original_expiry_date (SE VÁLIDA)
-- =====================================================
-- Primeiro, corrigir as que têm original_expiry_date válida
-- e mais recente que current_period_end

UPDATE subscriptions
SET 
  current_period_end = original_expiry_date,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND original_expiry_date IS NOT NULL
  AND original_expiry_date < current_period_end
  AND original_expiry_date > NOW();

-- =====================================================
-- 4. CORRIGIR DATAS SUSPEITAS (2025-12-12 18:19:XX)
-- =====================================================
-- Corrigir subscriptions que foram migradas em lote
-- com datas suspeitas

-- Para mensais: 1 mês a partir de created_at ou current_period_start
UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 month')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND plan_type = 'monthly'
  AND (
    current_period_end::text LIKE '2025-12-12 18:19:%'
    OR EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 60
  );

-- Para anuais: 1 ano a partir de created_at ou current_period_start
UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND plan_type = 'annual'
  AND (
    current_period_end::text LIKE '2025-12-12 18:19:%'
    OR EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 400
  );

-- Para gratuitos: 1 ano a partir de created_at ou current_period_start
UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND plan_type = 'free'
  AND (
    current_period_end::text LIKE '2025-12-12 18:19:%'
    OR EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 400
  );

-- =====================================================
-- 5. CORRIGIR OUTRAS DATAS INCORRETAS
-- =====================================================
-- Corrigir outras subscriptions migradas com datas muito no futuro
-- que não foram pegas pelas queries anteriores

UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 month')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND plan_type = 'monthly'
  AND EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 60
  AND current_period_end::text NOT LIKE '2025-12-12 18:19:%';

UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND plan_type IN ('annual', 'free')
  AND EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 400
  AND current_period_end::text NOT LIKE '2025-12-12 18:19:%';

-- =====================================================
-- 6. VERIFICAR CORREÇÕES APLICADAS
-- =====================================================
-- Verifica se as correções foram aplicadas corretamente

SELECT 
  area,
  plan_type,
  COUNT(*) as total_migradas,
  ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) as dias_medio_apos_correcao,
  COUNT(*) FILTER (WHERE current_period_end::text LIKE '2025-12-12 18:19:%') as ainda_com_data_suspeita,
  CASE 
    WHEN plan_type = 'monthly' AND ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) BETWEEN 28 AND 35 THEN '✅ OK'
    WHEN plan_type = 'annual' AND ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) BETWEEN 360 AND 370 THEN '✅ OK'
    WHEN plan_type = 'free' AND ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) BETWEEN 360 AND 370 THEN '✅ OK'
    ELSE '⚠️ Ainda pode ter problemas'
  END as validacao
FROM subscriptions
WHERE status = 'active'
  AND is_migrated = true
GROUP BY area, plan_type
ORDER BY area, plan_type;

-- =====================================================
-- 7. LISTAR SUBSCRIPTIONS CORRIGIDAS
-- =====================================================
-- Mostra todas as subscriptions migradas após correção

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.created_at,
  s.current_period_end,
  s.original_expiry_date,
  EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 as dias_validade,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.is_migrated = true
ORDER BY s.current_period_end ASC;

-- =====================================================
-- FIM DAS CORREÇÕES ESPECÍFICAS PARA MIGRADAS
-- =====================================================
-- IMPORTANTE:
-- 1. Execute a query 1 para ver o que será corrigido
-- 2. Execute a query 2 para ver as novas datas
-- 3. Revise cuidadosamente
-- 4. Execute as queries 3, 4 e 5 para aplicar correções
-- 5. Execute a query 6 para verificar
-- 6. Execute a query 7 para ver todas as migradas

