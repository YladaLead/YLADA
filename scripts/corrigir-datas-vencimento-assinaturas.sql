-- =====================================================
-- CORREÇÃO: Datas de Vencimento de Assinaturas
-- =====================================================
-- Este script identifica e corrige datas de vencimento
-- que estão claramente incorretas (muito no futuro)
-- 
-- ATENÇÃO: Execute em ambiente de teste primeiro!
-- Revise os resultados antes de aplicar UPDATEs

-- =====================================================
-- 1. IDENTIFICAR SUBSCRIPTIONS COM DATAS INCORRETAS
-- =====================================================
-- Subscriptions com mais de 2 anos de validade (mensal)
-- ou mais de 13 meses (anual) são consideradas incorretas

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
  s.migrated_from,
  EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 as dias_desde_criacao,
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
  AND (
    (s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60)
    OR (s.plan_type = 'annual' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    OR (s.plan_type = 'free' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
  )
ORDER BY dias_desde_criacao DESC;

-- =====================================================
-- 2. CALCULAR DATAS CORRETAS
-- =====================================================
-- Mostra como as datas deveriam ser baseado no tipo de plano

SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.created_at,
  s.current_period_start,
  s.current_period_end as data_vencimento_atual,
  CASE 
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
  AND (
    (s.plan_type = 'monthly' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 60)
    OR (s.plan_type = 'annual' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
    OR (s.plan_type = 'free' AND EXTRACT(EPOCH FROM (s.current_period_end - s.created_at)) / 86400 > 400)
  )
ORDER BY s.created_at DESC;

-- =====================================================
-- 3. CORRIGIR DATAS (EXECUTAR APENAS APÓS REVISAR!)
-- =====================================================
-- ATENÇÃO: Este UPDATE modifica dados reais!
-- Revise os resultados da query 2 antes de executar

-- Para subscriptions mensais: 1 mês a partir de created_at ou current_period_start
UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 month')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND plan_type = 'monthly'
  AND EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 60;

-- Para subscriptions anuais: 1 ano a partir de created_at ou current_period_start
UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND plan_type = 'annual'
  AND EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 400;

-- Para subscriptions gratuitas: 1 ano a partir de created_at ou current_period_start
UPDATE subscriptions
SET 
  current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')::timestamp,
  updated_at = NOW()
WHERE status = 'active'
  AND plan_type = 'free'
  AND EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400 > 400;

-- =====================================================
-- 4. VERIFICAR CORREÇÕES APLICADAS
-- =====================================================
-- Verifica se as correções foram aplicadas corretamente

SELECT 
  area,
  plan_type,
  COUNT(*) as total,
  ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) as dias_medio_apos_correcao,
  CASE 
    WHEN plan_type = 'monthly' AND ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) BETWEEN 28 AND 35 THEN '✅ OK'
    WHEN plan_type = 'annual' AND ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) BETWEEN 360 AND 370 THEN '✅ OK'
    WHEN plan_type = 'free' AND ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) BETWEEN 360 AND 370 THEN '✅ OK'
    ELSE '⚠️ Ainda pode ter problemas'
  END as validacao
FROM subscriptions
WHERE status = 'active'
GROUP BY area, plan_type
ORDER BY area, plan_type;

-- =====================================================
-- 5. CORREÇÃO ESPECIAL PARA MIGRADAS
-- =====================================================
-- Se a subscription migrada tem original_expiry_date,
-- usar essa data se for mais recente que a atual

-- Primeiro, verificar quais têm original_expiry_date
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.current_period_end as data_atual,
  s.original_expiry_date as data_original,
  CASE 
    WHEN s.original_expiry_date IS NOT NULL AND s.original_expiry_date < s.current_period_end THEN '✅ Data original é mais recente'
    WHEN s.original_expiry_date IS NOT NULL AND s.original_expiry_date > s.current_period_end THEN '⚠️ Data original é mais antiga'
    ELSE '❌ Sem data original'
  END as situacao,
  up.email
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.is_migrated = true
  AND s.original_expiry_date IS NOT NULL
ORDER BY s.current_period_end DESC;

-- Se necessário, atualizar para usar original_expiry_date
-- (Descomente apenas se a data original for mais confiável)
/*
UPDATE subscriptions
SET 
  current_period_end = original_expiry_date,
  updated_at = NOW()
WHERE status = 'active'
  AND is_migrated = true
  AND original_expiry_date IS NOT NULL
  AND original_expiry_date < current_period_end;
*/

-- =====================================================
-- FIM DAS CORREÇÕES
-- =====================================================
-- IMPORTANTE:
-- 1. Execute a query 1 primeiro para ver o que será corrigido
-- 2. Execute a query 2 para ver as novas datas
-- 3. Revise cuidadosamente
-- 4. Execute a query 3 para aplicar correções
-- 5. Execute a query 4 para verificar
-- 6. Se necessário, use query 5 para migradas

