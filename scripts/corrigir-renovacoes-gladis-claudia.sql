-- =====================================================
-- CORRIGIR RENOVAÇÕES: GLADIS E CLAUDIA VITTO
-- =====================================================
-- Este script estende o vencimento das subscriptions
-- que foram pagas mas não tiveram o vencimento estendido
-- (porque o código antigo criava nova subscription em vez de estender)

-- =====================================================
-- 1. VERIFICAR SITUAÇÃO ATUAL
-- =====================================================

-- Gladis Zender Sales Gordaliza
SELECT 
  'GLADIS' as pessoa,
  s.id as subscription_id,
  u.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end as vencimento_atual,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento,
  s.created_at,
  s.updated_at
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE u.email = 'gladisgordaliza@gmail.com'
  AND s.status = 'active'
ORDER BY s.current_period_end DESC;

-- Claudia Vitto
SELECT 
  'CLAUDIA' as pessoa,
  s.id as subscription_id,
  u.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end as vencimento_atual,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento,
  s.created_at,
  s.updated_at
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE u.email = 'claudiavitto@hotmail.com'
  AND s.status = 'active'
ORDER BY s.current_period_end DESC;

-- =====================================================
-- 2. ESTENDER VENCIMENTO DA GLADIS (+30 dias)
-- =====================================================
-- Pega a subscription mais recente (com maior current_period_end)
-- e adiciona 30 dias ao vencimento atual

UPDATE subscriptions
SET 
  current_period_end = current_period_end + INTERVAL '30 days',
  current_period_start = NOW(), -- Novo período começa agora
  updated_at = NOW()
WHERE id = (
  SELECT s.id
  FROM subscriptions s
  INNER JOIN auth.users u ON u.id = s.user_id
  WHERE u.email = 'gladisgordaliza@gmail.com'
    AND s.status = 'active'
  ORDER BY s.current_period_end DESC
  LIMIT 1
)
RETURNING 
  id,
  current_period_end as novo_vencimento,
  current_period_end::date - CURRENT_DATE as dias_ate_vencimento;

-- =====================================================
-- 3. ESTENDER VENCIMENTO DA CLAUDIA VITTO (+30 dias)
-- =====================================================

UPDATE subscriptions
SET 
  current_period_end = current_period_end + INTERVAL '30 days',
  current_period_start = NOW(), -- Novo período começa agora
  updated_at = NOW()
WHERE id = (
  SELECT s.id
  FROM subscriptions s
  INNER JOIN auth.users u ON u.id = s.user_id
  WHERE u.email = 'claudiavitto@hotmail.com'
    AND s.status = 'active'
  ORDER BY s.current_period_end DESC
  LIMIT 1
)
RETURNING 
  id,
  current_period_end as novo_vencimento,
  current_period_end::date - CURRENT_DATE as dias_ate_vencimento;

-- =====================================================
-- 4. VERIFICAR RESULTADO FINAL
-- =====================================================

-- Gladis - Verificar se foi atualizado
SELECT 
  'GLADIS (APÓS CORREÇÃO)' as pessoa,
  s.id as subscription_id,
  u.email,
  up.nome_completo,
  s.current_period_end as novo_vencimento,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento,
  s.updated_at as atualizado_em
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE u.email = 'gladisgordaliza@gmail.com'
  AND s.status = 'active'
ORDER BY s.current_period_end DESC
LIMIT 1;

-- Claudia - Verificar se foi atualizado
SELECT 
  'CLAUDIA (APÓS CORREÇÃO)' as pessoa,
  s.id as subscription_id,
  u.email,
  up.nome_completo,
  s.current_period_end as novo_vencimento,
  s.current_period_end::date - CURRENT_DATE as dias_ate_vencimento,
  s.updated_at as atualizado_em
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE u.email = 'claudiavitto@hotmail.com'
  AND s.status = 'active'
ORDER BY s.current_period_end DESC
LIMIT 1;

-- =====================================================
-- OBSERVAÇÕES IMPORTANTES:
-- =====================================================
-- 
-- 1. Este script estende o vencimento em 30 dias a partir
--    da data atual de vencimento (não a partir de hoje)
--
-- 2. Se você quiser estender a partir de HOJE em vez de
--    a partir do vencimento atual, use:
--    current_period_end = NOW() + INTERVAL '30 days'
--
-- 3. O script pega a subscription mais recente (com maior
--    current_period_end) para cada usuária
--
-- 4. Se houver múltiplas subscriptions ativas, apenas a
--    mais recente será atualizada
--
-- 5. Para verificar se há múltiplas subscriptions:
--    Execute as queries da seção 1 primeiro

