-- =====================================================
-- DIAGNOSTICAR ASSINATURAS MENSais DA ÁREA WELLNESS
-- =====================================================

-- 1. Listar TODAS as assinaturas mensais ativas da área Wellness
SELECT 
  '1. TODAS AS ASSINATURAS MENSais WELLNESS ATIVAS' as verificacao,
  s.id,
  s.area,
  s.plan_type,
  s.amount / 100.0 as valor_reais,
  s.status,
  s.created_at,
  s.current_period_start,
  s.current_period_end,
  up.email,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  -- Categoria CORRETA
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN 'SUPORTE'
    WHEN s.amount = 0 THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria_correta,
  -- Verificar se foi criada hoje
  CASE 
    WHEN DATE(s.created_at) = CURRENT_DATE THEN '✅ CRIADA HOJE'
    ELSE 'Criada em ' || DATE(s.created_at)::text
  END as data_criacao
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly'
ORDER BY s.created_at DESC, s.amount DESC;

-- 2. Contar assinaturas mensais WELLNESS PAGANTES
SELECT 
  '2. CONTAGEM DE ASSINATURAS MENSais WELLNESS PAGANTES' as verificacao,
  COUNT(*) as total_mensais_pagantes,
  SUM(s.amount) / 100.0 as valor_total_reais
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly'
  AND s.amount > 0
  AND (up.is_admin != true AND up.is_support != true);

-- 3. Assinaturas mensais Wellness criadas HOJE
SELECT 
  '3. ASSINATURAS MENSais WELLNESS CRIADAS HOJE' as verificacao,
  s.id,
  s.amount / 100.0 as valor_reais,
  up.email,
  up.nome_completo,
  CASE 
    WHEN s.amount = 0 THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria,
  s.created_at
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly'
  AND DATE(s.created_at) = CURRENT_DATE
ORDER BY s.created_at DESC;

-- 4. Verificar se há filtro de período aplicado que pode estar excluindo assinaturas
-- Assinaturas mensais Wellness criadas nos últimos 7 dias
SELECT 
  '4. ASSINATURAS MENSais WELLNESS (ÚLTIMOS 7 DIAS)' as verificacao,
  s.id,
  s.amount / 100.0 as valor_reais,
  up.email,
  up.nome_completo,
  CASE 
    WHEN s.amount = 0 THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria,
  s.created_at,
  DATE(s.created_at) as data_criacao
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly'
  AND s.created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY s.created_at DESC;

-- 5. Resumo por categoria (Wellness mensal)
SELECT 
  '5. RESUMO WELLNESS MENSAL POR CATEGORIA' as verificacao,
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN 'SUPORTE'
    WHEN s.amount = 0 THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria,
  COUNT(*) as total,
  SUM(s.amount) / 100.0 as valor_total_reais
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly'
GROUP BY categoria
ORDER BY categoria;

