-- =====================================================
-- CORRIGIR USER_ID DA SUBSCRIPTION DA GLADIS
-- =====================================================
-- Este script corrige o user_id da subscription
-- para o user_id correto do user_profiles

-- =====================================================
-- PASSO 1: IDENTIFICAR O USER_ID CORRETO
-- =====================================================
-- Execute esta query primeiro para ver qual é o user_id correto
SELECT 
  up.user_id as user_id_correto,
  up.email,
  up.nome_completo,
  'Este é o user_id que deve ser usado' as observacao
FROM user_profiles up
WHERE up.email = 'gladisgordaliza@gmail.com'
ORDER BY up.created_at DESC
LIMIT 1;

-- =====================================================
-- PASSO 2: IDENTIFICAR A SUBSCRIPTION COM USER_ID ERRADO
-- =====================================================
-- Execute esta query para ver qual subscription precisa ser corrigida
SELECT 
  s.id as subscription_id,
  s.user_id as user_id_atual,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  'Esta subscription precisa ter o user_id corrigido' as observacao
FROM subscriptions s
WHERE s.id = 'f5f8415f-0f95-489e-a15f-6458a59b5310' -- ID da subscription que você está vendo
   OR s.user_id = '62885dbf-83fd-4d55-8d95-b94bb63064fc' -- User ID que você mencionou
   OR s.user_id = '9ef6f09c-08a0-4999-90df-146d59439976'; -- Outro User ID que você mencionou

-- =====================================================
-- PASSO 3: CORRIGIR O USER_ID DA SUBSCRIPTION
-- =====================================================
-- ⚠️ IMPORTANTE: Substitua 'USER_ID_CORRETO_AQUI' pelo user_id correto
-- que você encontrou no PASSO 1

-- Opção A: Corrigir usando o subscription_id específico
UPDATE subscriptions
SET 
  user_id = (
    SELECT up.user_id 
    FROM user_profiles up 
    WHERE up.email = 'gladisgordaliza@gmail.com'
    ORDER BY up.created_at DESC
    LIMIT 1
  ),
  updated_at = NOW()
WHERE id = 'f5f8415f-0f95-489e-a15f-6458a59b5310' -- ID da subscription que você está vendo
RETURNING 
  id,
  user_id as novo_user_id,
  updated_at;

-- Opção B: Corrigir todas as subscriptions da Gladis que têm user_id errado
-- (Use apenas se tiver certeza de qual é o user_id correto)
UPDATE subscriptions
SET 
  user_id = (
    SELECT up.user_id 
    FROM user_profiles up 
    WHERE up.email = 'gladisgordaliza@gmail.com'
    ORDER BY up.created_at DESC
    LIMIT 1
  ),
  updated_at = NOW()
WHERE user_id IN ('62885dbf-83fd-4d55-8d95-b94bb63064fc', '9ef6f09c-08a0-4999-90df-146d59439976')
  AND EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = (
      SELECT up.user_id 
      FROM user_profiles up 
      WHERE up.email = 'gladisgordaliza@gmail.com'
      ORDER BY up.created_at DESC
      LIMIT 1
    )
  )
RETURNING 
  id,
  user_id as novo_user_id,
  area,
  plan_type,
  status,
  updated_at;

-- =====================================================
-- PASSO 4: VERIFICAR SE FOI CORRIGIDO
-- =====================================================
SELECT 
  'VERIFICAÇÃO FINAL' as tipo,
  s.id as subscription_id,
  s.user_id,
  u.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  CASE 
    WHEN s.user_id = up.user_id THEN '✅ CORRETO'
    ELSE '❌ AINDA ERRADO'
  END as status_correcao
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE u.email = 'gladisgordaliza@gmail.com'
  AND s.status = 'active'
ORDER BY s.current_period_end DESC;

