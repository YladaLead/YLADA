-- =====================================================
-- VERIFICAR CATEGORIZAÇÃO DE ASSINATURAS
-- Script para identificar assinaturas que podem estar
-- categorizadas incorretamente
-- =====================================================

-- 1. VERIFICAR TODAS AS ASSINATURAS ATIVAS E SUAS CATEGORIAS
SELECT 
  '1. TODAS AS ASSINATURAS ATIVAS' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.amount,
  s.amount / 100.0 as valor_reais,
  s.is_migrated,
  s.status,
  up.email,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  -- Categoria esperada
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN '🛟 SUPORTE'
    WHEN s.plan_type = 'free' THEN '🆓 GRATUITA (plan_type=free)'
    WHEN s.amount = 0 AND s.is_migrated != true THEN '🆓 GRATUITA (amount=0)'
    WHEN s.amount > 0 THEN '💳 PAGANTE'
    ELSE '⚠️ VERIFICAR'
  END as categoria_esperada,
  -- Problemas potenciais
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN '✅ OK'
    WHEN s.plan_type = 'free' AND s.amount > 0 THEN '❌ PROBLEMA: plan_type=free mas amount>0'
    WHEN s.plan_type != 'free' AND s.amount = 0 AND s.is_migrated != true THEN '❌ PROBLEMA: Não é free mas amount=0'
    WHEN s.amount > 0 THEN '✅ OK'
    ELSE '⚠️ VERIFICAR'
  END as status_verificacao
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
ORDER BY s.amount DESC, s.created_at DESC;

-- 2. ASSINATURAS COM PLAN_TYPE != 'free' MAS AMOUNT = 0
SELECT 
  '2. ASSINATURAS COM PLAN_TYPE != free MAS AMOUNT = 0' as verificacao,
  s.id,
  s.area,
  s.plan_type,
  s.amount / 100.0 as valor_reais,
  s.is_migrated,
  up.email,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN '✅ É SUPORTE - OK'
    WHEN s.is_migrated = true THEN '⚠️ MIGRADA - Verificar se deveria ser gratuita'
    ELSE '❌ PROBLEMA: Deveria ser gratuita ou ter valor'
  END as acao
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.plan_type != 'free'
  AND s.amount = 0
ORDER BY s.created_at DESC;

-- 3. ASSINATURAS COM PLAN_TYPE = 'free' MAS AMOUNT > 0
SELECT 
  '3. ASSINATURAS COM PLAN_TYPE = free MAS AMOUNT > 0' as verificacao,
  s.id,
  s.area,
  s.plan_type,
  s.amount / 100.0 as valor_reais,
  up.email,
  up.nome_completo,
  '❌ PROBLEMA: Deveria ter plan_type diferente ou amount=0' as acao
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.plan_type = 'free'
  AND s.amount > 0
ORDER BY s.amount DESC;

-- 4. RESUMO POR CATEGORIA ESPERADA
SELECT 
  '4. RESUMO POR CATEGORIA' as verificacao,
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN 'SUPORTE'
    WHEN s.plan_type = 'free' OR (s.amount = 0 AND s.is_migrated != true) THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria,
  COUNT(*) as total,
  SUM(s.amount) / 100.0 as valor_total_reais
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
GROUP BY categoria
ORDER BY categoria;

