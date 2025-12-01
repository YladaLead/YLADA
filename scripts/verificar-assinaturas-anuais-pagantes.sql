-- =====================================================
-- VERIFICAR ASSINATURAS ANUAIS PAGANTES (DEVERIA SER 1, NÃO 5)
-- =====================================================

-- 1. Listar TODAS as assinaturas anuais ativas e suas categorias
SELECT 
  '1. TODAS AS ASSINATURAS ANUAIS ATIVAS' as verificacao,
  s.id,
  s.area,
  s.plan_type,
  s.amount / 100.0 as valor_reais,
  s.status,
  up.email,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  -- Categoria CORRETA (amount=0 = gratuita, amount>0 = pagante)
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN 'SUPORTE'
    WHEN s.amount = 0 THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria_correta,
  -- Verificar se está sendo categorizada corretamente
  CASE 
    WHEN s.amount = 0 AND (up.is_admin != true AND up.is_support != true) THEN '✅ Deve ser GRATUITA'
    WHEN s.amount > 0 AND (up.is_admin != true AND up.is_support != true) THEN '✅ Deve ser PAGANTE'
    WHEN up.is_admin = true OR up.is_support = true THEN '✅ Deve ser SUPORTE'
    ELSE '⚠️ VERIFICAR'
  END as status_verificacao
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.plan_type = 'annual'
ORDER BY s.amount DESC, s.created_at DESC;

-- 2. Contar assinaturas anuais PAGANTES (deveria ser 1)
SELECT 
  '2. CONTAGEM DE ASSINATURAS ANUAIS PAGANTES' as verificacao,
  COUNT(*) as total_anuais_pagantes,
  SUM(s.amount) / 100.0 as valor_total_reais
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.plan_type = 'annual'
  AND s.amount > 0
  AND (up.is_admin != true AND up.is_support != true);

-- 3. Contar assinaturas anuais GRATUITAS (deveria ser 4)
SELECT 
  '3. CONTAGEM DE ASSINATURAS ANUAIS GRATUITAS' as verificacao,
  COUNT(*) as total_anuais_gratuitas
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.plan_type = 'annual'
  AND s.amount = 0
  AND (up.is_admin != true AND up.is_support != true);

-- 4. Verificar assinaturas específicas mencionadas
SELECT 
  '4. ASSINATURAS ESPECÍFICAS' as verificacao,
  s.id,
  s.area,
  s.plan_type,
  s.amount / 100.0 as valor_reais,
  up.email,
  up.nome_completo,
  CASE 
    WHEN s.amount = 0 THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria_correta
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.plan_type = 'annual'
  AND (
    up.email LIKE '%clube%shake%' OR
    up.email LIKE '%deise%' OR
    up.email LIKE '%amanda%bonfogo%' OR
    up.email LIKE '%naytenutri%' OR
    up.email LIKE '%nayara%' OR
    up.email LIKE '%sperandio%' OR
    up.nome_completo ILIKE '%dário%' OR
    up.nome_completo ILIKE '%rosana%nazato%'
  )
ORDER BY s.amount DESC;

