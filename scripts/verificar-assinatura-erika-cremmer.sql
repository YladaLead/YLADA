-- =====================================================
-- VERIFICAR ASSINATURA DA ÉRIKA CREMMER
-- Email: evsnutrivibe@gmail.com
-- =====================================================

-- 1. VERIFICAR SE A ASSINATURA EXISTE E ESTÁ ATIVA
SELECT 
  '1. VERIFICAÇÃO DA ASSINATURA' as verificacao,
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount,
  s.amount / 100.0 as valor_reais,
  s.currency,
  s.current_period_start,
  s.current_period_end,
  s.current_period_end > NOW() as nao_expirada,
  s.status = 'active' as status_ativo,
  s.created_at,
  up.email,
  up.nome_completo,
  -- Verificar se atende TODOS os critérios da função hasActiveSubscription
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ ASSINATURA ATIVA'
    WHEN s.status != 'active' THEN '❌ Status não é "active": ' || s.status
    WHEN s.current_period_end <= NOW() THEN '❌ Assinatura expirada em: ' || s.current_period_end::text
    ELSE '❌ Problema desconhecido'
  END as resultado_verificacao
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE LOWER(up.email) = LOWER('evsnutrivibe@gmail.com')
  AND s.area = 'wellness'
ORDER BY s.created_at DESC;

-- 2. VERIFICAR SE HÁ MÚLTIPLAS ASSINATURAS (pode causar confusão)
SELECT 
  '2. CONTAGEM DE ASSINATURAS' as verificacao,
  COUNT(*) as total_assinaturas,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as ativas,
  COUNT(CASE WHEN status = 'canceled' THEN 1 END) as canceladas,
  COUNT(CASE WHEN current_period_end > NOW() THEN 1 END) as nao_expiradas
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.user_id
WHERE LOWER(up.email) = LOWER('evsnutrivibe@gmail.com')
  AND s.area = 'wellness';

-- 3. SIMULAR A QUERY DA FUNÇÃO hasActiveSubscription
SELECT 
  '3. SIMULAÇÃO DA FUNÇÃO hasActiveSubscription' as verificacao,
  s.id,
  s.status,
  s.current_period_end,
  s.current_period_end > NOW() as periodo_valido,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ DEVERIA SER RECONHECIDA'
    ELSE '❌ NÃO SERÁ RECONHECIDA'
  END as resultado
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.user_id
WHERE LOWER(up.email) = LOWER('evsnutrivibe@gmail.com')
  AND s.area = 'wellness'
  AND s.status = 'active'
  AND s.current_period_end > NOW()
LIMIT 1;
