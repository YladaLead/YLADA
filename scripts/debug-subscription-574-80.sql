-- =====================================================
-- DEBUG: Subscription R$ 574,80 que não aparece
-- ID: 5c2d4038-eb71-4c2a-8608-8c73a63f2133
-- =====================================================

-- 1. VERIFICAR TODOS OS DADOS DA SUBSCRIPTION
SELECT 
  s.*,
  up.email,
  up.nome_completo,
  -- Verificar critérios da API
  s.status as status_original,
  CASE 
    WHEN s.status = 'active' THEN 'ativa'
    WHEN s.status = 'canceled' THEN 'cancelada'
    WHEN s.status = 'past_due' THEN 'atrasada'
    WHEN s.status = 'unpaid' THEN 'não paga'
    WHEN s.status = 'trialing' THEN 'trial'
    ELSE 'expirada'
  END as status_formatado_api,
  s.plan_type,
  CASE 
    WHEN s.plan_type = 'annual' THEN 'anual'
    WHEN s.plan_type = 'monthly' THEN 'mensal'
    ELSE 'gratuito'
  END as tipo_formatado_api,
  s.amount / 100.0 as valor_reais,
  s.current_period_end > NOW() as nao_expirada,
  s.status = 'active' as status_ativo
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.id = '5c2d4038-eb71-4c2a-8608-8c73a63f2133';

-- 2. VERIFICAR SE APARECE NA QUERY DA API (sem filtros)
-- A API busca todas as subscriptions e depois formata
SELECT 
  'Simulação da API' as teste,
  s.id,
  s.status,
  s.plan_type,
  s.amount / 100.0 as valor,
  -- Formatação que a API faz:
  CASE 
    WHEN s.status = 'active' THEN 'ativa'
    WHEN s.status = 'canceled' THEN 'cancelada'
    WHEN s.status = 'past_due' THEN 'atrasada'
    WHEN s.status = 'unpaid' THEN 'não paga'
    WHEN s.status = 'trialing' THEN 'trial'
    ELSE 'expirada'
  END as status_formatado,
  CASE 
    WHEN s.plan_type = 'annual' THEN 'anual'
    WHEN s.plan_type = 'monthly' THEN 'mensal'
    ELSE 'gratuito'
  END as tipo_formatado
FROM subscriptions s
WHERE s.id = '5c2d4038-eb71-4c2a-8608-8c73a63f2133';

-- 3. VERIFICAR SE ESTÁ SENDO FILTRADA (receitasAtivas)
-- A API filtra: receitas.filter(r => r.status === 'ativa')
-- Então precisa que status_formatado seja 'ativa'
SELECT 
  'Filtro receitasAtivas' as teste,
  s.id,
  CASE 
    WHEN s.status = 'active' THEN 'ativa'
    ELSE 'NÃO ATIVA'
  END as status_para_filtro,
  CASE 
    WHEN s.status = 'active' THEN '✅ Aparece nos totais'
    ELSE '❌ NÃO aparece nos totais'
  END as resultado
FROM subscriptions s
WHERE s.id = '5c2d4038-eb71-4c2a-8608-8c73a63f2133';

-- 4. VERIFICAR TODAS AS SUBSCRIPTIONS WELLNESS RECENTES (para comparar)
SELECT 
  s.id,
  s.status,
  s.plan_type,
  s.amount / 100.0 as valor_reais,
  s.created_at,
  up.email,
  -- Status formatado pela API
  CASE 
    WHEN s.status = 'active' THEN 'ativa'
    WHEN s.status = 'canceled' THEN 'cancelada'
    WHEN s.status = 'past_due' THEN 'atrasada'
    WHEN s.status = 'unpaid' THEN 'não paga'
    WHEN s.status = 'trialing' THEN 'trial'
    ELSE 'expirada'
  END as status_formatado,
  -- Tipo formatado pela API
  CASE 
    WHEN s.plan_type = 'annual' THEN 'anual'
    WHEN s.plan_type = 'monthly' THEN 'mensal'
    ELSE 'gratuito'
  END as tipo_formatado,
  -- Aparece nos totais?
  CASE 
    WHEN s.status = 'active' THEN '✅ SIM'
    ELSE '❌ NÃO'
  END as aparece_totais
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.area = 'wellness'
  AND s.created_at >= (NOW() - INTERVAL '7 days')
ORDER BY s.created_at DESC;

