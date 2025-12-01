-- =====================================================
-- VERIFICAR ASSINATURAS GRATUITAS MARCADAS COMO PAGANTES
-- =====================================================

-- 1. Verificar assinaturas de Deise e Naiara Fernandes
SELECT 
  '1. ASSINATURAS DE DEISE E NAIARA' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.amount,
  s.amount / 100.0 as valor_reais,
  s.status,
  s.is_migrated,
  up.email,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  -- Categoria esperada
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN 'SUPORTE'
    WHEN s.plan_type = 'free' THEN 'GRATUITA'
    WHEN s.amount = 0 THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria_esperada,
  -- Problema identificado
  CASE 
    WHEN s.plan_type = 'free' AND s.amount > 0 THEN '❌ PROBLEMA: plan_type=free mas amount>0'
    WHEN s.plan_type != 'free' AND s.amount = 0 THEN '⚠️ plan_type != free mas amount=0 (pode ser gratuita)'
    ELSE '✅ OK'
  END as status_verificacao
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND (up.email LIKE '%deise%' OR up.email LIKE '%naiara%' OR up.nome_completo ILIKE '%deise%' OR up.nome_completo ILIKE '%naiara%')
ORDER BY s.created_at DESC;

-- 2. Verificar TODAS as assinaturas que podem estar incorretas
-- (plan_type = 'free' mas amount > 0, ou amount = 0 mas plan_type != 'free')
SELECT 
  '2. ASSINATURAS COM INCONSISTÊNCIAS' as verificacao,
  s.id,
  s.area,
  s.plan_type,
  s.amount / 100.0 as valor_reais,
  s.status,
  up.email,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  CASE 
    WHEN s.plan_type = 'free' AND s.amount > 0 THEN '❌ plan_type=free mas amount>0 (deveria ser gratuita)'
    WHEN s.plan_type != 'free' AND s.amount = 0 AND (up.is_admin != true AND up.is_support != true) THEN '⚠️ plan_type != free mas amount=0 (pode ser gratuita)'
    ELSE 'VERIFICAR'
  END as problema
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND (
    (s.plan_type = 'free' AND s.amount > 0)
    OR
    (s.plan_type != 'free' AND s.amount = 0 AND (up.is_admin != true AND up.is_support != true))
  )
ORDER BY s.amount DESC, s.created_at DESC;

-- 3. Contar assinaturas anuais pagantes (deveria ser 2, não 5)
SELECT 
  '3. CONTAGEM DE ASSINATURAS ANUAIS PAGANTES' as verificacao,
  COUNT(*) as total_anuais_pagantes,
  SUM(s.amount) / 100.0 as valor_total_reais
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.plan_type = 'annual'
  AND s.amount > 0
  AND (up.is_admin != true AND up.is_support != true);

-- 4. Listar TODAS as assinaturas anuais ativas
SELECT 
  '4. TODAS AS ASSINATURAS ANUAIS ATIVAS' as verificacao,
  s.id,
  s.area,
  s.plan_type,
  s.amount / 100.0 as valor_reais,
  s.status,
  up.email,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN 'SUPORTE'
    WHEN s.amount = 0 THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria_esperada
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.plan_type = 'annual'
ORDER BY s.amount DESC, s.created_at DESC;

