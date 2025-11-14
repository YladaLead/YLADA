-- =====================================================
-- CORRIGIR USER_ID INCONSISTENTE EM TODAS AS MIGRAÇÕES
-- =====================================================
-- Este script identifica e corrige subscriptions com user_id
-- que não bate com o user_profiles (problema comum após migração)

-- =====================================================
-- PASSO 1: IDENTIFICAR TODOS OS CASOS COM PROBLEMA
-- =====================================================
-- Esta query mostra todas as subscriptions migradas onde
-- o user_id da subscription não bate com o user_id do perfil
SELECT 
  'PROBLEMAS ENCONTRADOS' as tipo,
  s.id as subscription_id,
  s.user_id as subscription_user_id,
  u.email,
  up.user_id as perfil_user_id,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  s.is_migrated,
  CASE 
    WHEN s.user_id != up.user_id THEN '❌ USER_ID DIFERENTE'
    WHEN up.user_id IS NULL THEN '❌ SEM PERFIL'
    ELSE '✅ OK'
  END as problema
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.is_migrated = true
  AND s.status = 'active'
  AND (
    -- Subscription.user_id não tem perfil correspondente
    up.user_id IS NULL
    -- OU subscription.user_id é diferente do perfil.user_id
    OR s.user_id != (
      SELECT up2.user_id 
      FROM user_profiles up2 
      WHERE up2.email = u.email
      ORDER BY up2.created_at DESC
      LIMIT 1
    )
  )
ORDER BY u.email, s.created_at DESC;

-- =====================================================
-- PASSO 2: VERIFICAR QUANTOS CASOS PRECISAM CORREÇÃO
-- =====================================================
SELECT 
  COUNT(*) as total_problemas,
  COUNT(DISTINCT u.email) as usuarios_afetados
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.is_migrated = true
  AND s.status = 'active'
  AND (
    up.user_id IS NULL
    OR s.user_id != (
      SELECT up2.user_id 
      FROM user_profiles up2 
      WHERE up2.email = u.email
      ORDER BY up2.created_at DESC
      LIMIT 1
    )
  );

-- =====================================================
-- PASSO 3: CORRIGIR AUTOMATICAMENTE TODOS OS CASOS
-- =====================================================
-- ⚠️ IMPORTANTE: Execute o PASSO 1 primeiro para ver o que será corrigido!
-- Este UPDATE corrige o user_id da subscription para o user_id correto do perfil

UPDATE subscriptions s
SET 
  user_id = (
    SELECT up.user_id 
    FROM user_profiles up 
    INNER JOIN auth.users u2 ON u2.id = up.user_id
    WHERE u2.email = (
      SELECT u.email 
      FROM auth.users u 
      WHERE u.id = s.user_id
    )
    ORDER BY up.created_at DESC
    LIMIT 1
  ),
  updated_at = NOW()
WHERE s.is_migrated = true
  AND s.status = 'active'
  AND EXISTS (
    -- Verificar se há perfil com email correspondente
    SELECT 1 
    FROM auth.users u
    INNER JOIN user_profiles up ON up.user_id = u.id
    WHERE u.email = (
      SELECT u2.email 
      FROM auth.users u2 
      WHERE u2.id = s.user_id
    )
    AND up.user_id != s.user_id -- Só atualizar se for diferente
  )
RETURNING 
  s.id as subscription_id,
  s.user_id as novo_user_id,
  s.area,
  s.plan_type,
  s.status;

-- =====================================================
-- PASSO 4: VERIFICAR RESULTADO DA CORREÇÃO
-- =====================================================
SELECT 
  'APÓS CORREÇÃO' as tipo,
  s.id as subscription_id,
  s.user_id,
  u.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  CASE 
    WHEN s.user_id = up.user_id THEN '✅ CORRIGIDO'
    ELSE '❌ AINDA COM PROBLEMA'
  END as status_correcao
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.is_migrated = true
  AND s.status = 'active'
ORDER BY u.email, s.created_at DESC;

