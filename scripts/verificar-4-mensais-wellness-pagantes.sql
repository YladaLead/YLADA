-- =====================================================
-- VERIFICAR AS 4 ASSINATURAS MENSais WELLNESS PAGANTES
-- =====================================================

-- 1. Listar as 4 assinaturas mensais Wellness pagantes
SELECT 
  '1. AS 4 ASSINATURAS MENSais WELLNESS PAGANTES' as verificacao,
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
  -- Verificar categoria esperada
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN 'SUPORTE'
    WHEN s.amount = 0 THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria_esperada,
  -- Verificar se plan_type está correto
  CASE 
    WHEN s.plan_type = 'monthly' THEN '✅ monthly'
    ELSE '⚠️ ' || s.plan_type
  END as tipo_verificacao
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly'
  AND s.amount > 0
  AND (up.is_admin != true AND up.is_support != true)
ORDER BY s.created_at DESC;

-- 2. Verificar se há alguma assinatura mensal Wellness que deveria ser pagante mas não está
SELECT 
  '2. ASSINATURAS MENSais WELLNESS QUE PODEM ESTAR INCORRETAS' as verificacao,
  s.id,
  s.amount / 100.0 as valor_reais,
  up.email,
  up.nome_completo,
  CASE 
    WHEN s.amount = 0 THEN 'GRATUITA (amount=0)'
    WHEN s.amount > 0 THEN 'PAGANTE (amount>0)'
    ELSE 'VERIFICAR'
  END as categoria_atual,
  s.created_at
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
  AND s.area = 'wellness'
  AND s.plan_type = 'monthly'
  AND (
    -- Verificar se há alguma inconsistência
    (s.amount > 0 AND (up.is_admin = true OR up.is_support = true)) OR
    (s.amount = 0 AND (up.is_admin != true AND up.is_support != true))
  )
ORDER BY s.created_at DESC;

-- 3. Contar total de mensais Wellness por categoria
SELECT 
  '3. CONTAGEM FINAL' as verificacao,
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

