-- =====================================================
-- VERIFICAÇÃO COMPLETA DO USUÁRIO: Márcia Andreazzi
-- Verifica se existe, se foi deletado, migrado, etc.
-- Plano: Noal (possivelmente Nutri)
-- =====================================================

-- 1. VERIFICAR EM auth.users (tabela principal de autenticação)
-- Buscar por variações do nome: Márcia, Marcia, Andreazzi, Andreasi
SELECT 
  'auth.users' as origem,
  id as user_id,
  email,
  email_confirmed_at,
  created_at as data_criacao,
  last_sign_in_at as ultimo_login,
  deleted_at as data_delecao,
  CASE 
    WHEN deleted_at IS NOT NULL THEN '❌ DELETADO'
    WHEN email_confirmed_at IS NULL THEN '⚠️ EMAIL NÃO CONFIRMADO'
    ELSE '✅ ATIVO'
  END as status
FROM auth.users
WHERE email ILIKE '%marcia%'
   OR email ILIKE '%andreazzi%'
   OR email ILIKE '%andreasi%'
ORDER BY created_at DESC;

-- 2. VERIFICAR EM user_profiles (perfil do usuário)
SELECT 
  'user_profiles' as origem,
  user_id,
  email as profile_email,
  nome_completo,
  perfil,
  created_at as data_criacao,
  updated_at as ultima_atualizacao
FROM user_profiles
WHERE LOWER(TRIM(nome_completo)) ILIKE '%marcia%'
   OR LOWER(TRIM(nome_completo)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(nome_completo)) ILIKE '%andreasi%'
   OR email ILIKE '%marcia%'
   OR email ILIKE '%andreazzi%'
   OR email ILIKE '%andreasi%'
ORDER BY created_at DESC;

-- 3. VERIFICAR ASSINATURAS (subscriptions) - Buscar por usuários recentes
SELECT 
  'subscriptions' as origem,
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount,
  s.currency,
  s.current_period_start,
  s.current_period_end,
  s.created_at,
  s.updated_at,
  au.email as email_auth,
  up.nome_completo,
  up.email as email_profile
FROM subscriptions s
LEFT JOIN auth.users au ON au.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE (LOWER(TRIM(au.email)) ILIKE '%marcia%'
   OR LOWER(TRIM(au.email)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(au.email)) ILIKE '%andreasi%'
   OR LOWER(TRIM(up.nome_completo)) ILIKE '%marcia%'
   OR LOWER(TRIM(up.nome_completo)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(up.nome_completo)) ILIKE '%andreasi%'
   OR LOWER(TRIM(up.email)) ILIKE '%marcia%'
   OR LOWER(TRIM(up.email)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(up.email)) ILIKE '%andreasi%')
ORDER BY s.created_at DESC;

-- 4. VERIFICAR PAGAMENTOS RECENTES (últimas 24 horas)
SELECT 
  'payments_recentes' as origem,
  p.id as payment_id,
  p.user_id,
  p.subscription_id,
  p.amount,
  p.currency,
  p.status as payment_status,
  p.created_at as payment_created,
  au.email as email_auth,
  up.nome_completo,
  up.email as email_profile,
  s.area,
  s.status as subscription_status
FROM payments p
LEFT JOIN auth.users au ON au.id = p.user_id
LEFT JOIN user_profiles up ON up.user_id = p.user_id
LEFT JOIN subscriptions s ON s.id = p.subscription_id
WHERE p.created_at >= NOW() - INTERVAL '24 hours'
  AND (LOWER(TRIM(au.email)) ILIKE '%marcia%'
   OR LOWER(TRIM(au.email)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(au.email)) ILIKE '%andreasi%'
   OR LOWER(TRIM(up.nome_completo)) ILIKE '%marcia%'
   OR LOWER(TRIM(up.nome_completo)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(up.nome_completo)) ILIKE '%andreasi%'
   OR LOWER(TRIM(up.email)) ILIKE '%marcia%'
   OR LOWER(TRIM(up.email)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(up.email)) ILIKE '%andreasi%')
ORDER BY p.created_at DESC;

-- 5. VERIFICAR SE HÁ USUÁRIOS DELETADOS (soft delete)
SELECT 
  'usuarios_deletados' as origem,
  id,
  email,
  deleted_at,
  created_at,
  EXTRACT(DAY FROM (NOW() - deleted_at)) as dias_desde_delecao
FROM auth.users
WHERE deleted_at IS NOT NULL
  AND (email ILIKE '%marcia%'
   OR email ILIKE '%andreazzi%'
   OR email ILIKE '%andreasi%')
ORDER BY deleted_at DESC;

-- 6. VERIFICAR HISTÓRICO COMPLETO (JOIN completo) - ÚLTIMAS 48 HORAS
SELECT 
  'historico_completo' as tipo,
  au.id as user_id,
  au.email as email_auth,
  au.email_confirmed_at,
  au.created_at as auth_created,
  au.deleted_at as auth_deleted,
  au.last_sign_in_at,
  up.email as email_profile,
  up.nome_completo,
  up.perfil,
  s.id as subscription_id,
  s.area as subscription_area,
  s.plan_type,
  s.status as subscription_status,
  s.amount as subscription_amount,
  s.current_period_start,
  s.current_period_end,
  s.created_at as subscription_created,
  CASE 
    WHEN au.deleted_at IS NOT NULL THEN '❌ DELETADO EM AUTH'
    WHEN au.email_confirmed_at IS NULL THEN '⚠️ EMAIL NÃO CONFIRMADO'
    WHEN up.user_id IS NULL THEN '⚠️ SEM PERFIL'
    WHEN s.id IS NULL THEN '⚠️ SEM ASSINATURA'
    WHEN s.status != 'active' THEN '⚠️ ASSINATURA INATIVA'
    WHEN s.current_period_end < NOW() THEN '⚠️ ASSINATURA EXPIRADA'
    ELSE '✅ OK'
  END as status_geral
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
LEFT JOIN subscriptions s ON s.user_id = au.id
WHERE (LOWER(TRIM(au.email)) ILIKE '%marcia%'
   OR LOWER(TRIM(au.email)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(au.email)) ILIKE '%andreasi%'
   OR LOWER(TRIM(up.nome_completo)) ILIKE '%marcia%'
   OR LOWER(TRIM(up.nome_completo)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(up.nome_completo)) ILIKE '%andreasi%'
   OR LOWER(TRIM(up.email)) ILIKE '%marcia%'
   OR LOWER(TRIM(up.email)) ILIKE '%andreazzi%'
   OR LOWER(TRIM(up.email)) ILIKE '%andreasi%')
  AND (au.created_at >= NOW() - INTERVAL '7 days' OR s.created_at >= NOW() - INTERVAL '7 days')
ORDER BY COALESCE(s.created_at, au.created_at) DESC;

-- 7. VERIFICAR ASSINATURAS RECENTES POR ÁREA (últimas 24 horas)
SELECT 
  'assinaturas_recentes' as tipo,
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount,
  s.currency,
  s.current_period_start,
  s.current_period_end,
  s.created_at,
  au.email,
  up.nome_completo,
  CASE 
    WHEN s.status != 'active' THEN '❌ INATIVA'
    WHEN s.current_period_end < NOW() THEN '⚠️ EXPIRADA'
    ELSE '✅ ATIVA'
  END as status_assinatura
FROM subscriptions s
LEFT JOIN auth.users au ON au.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.created_at >= NOW() - INTERVAL '24 hours'
  AND s.area IN ('nutri', 'wellness', 'coach')
ORDER BY s.created_at DESC;

-- 8. VERIFICAR WEBHOOKS/PAGAMENTOS PENDENTES
-- Verificar se há pagamentos que foram processados mas assinatura não foi criada
SELECT 
  'pagamentos_sem_assinatura' as tipo,
  p.id as payment_id,
  p.user_id,
  p.amount,
  p.currency,
  p.status as payment_status,
  p.created_at as payment_created,
  au.email,
  up.nome_completo,
  s.id as subscription_id,
  s.status as subscription_status,
  CASE 
    WHEN s.id IS NULL THEN '❌ PAGAMENTO SEM ASSINATURA'
    WHEN s.status != 'active' THEN '⚠️ ASSINATURA INATIVA'
    ELSE '✅ OK'
  END as problema
FROM payments p
LEFT JOIN auth.users au ON au.id = p.user_id
LEFT JOIN user_profiles up ON up.user_id = p.user_id
LEFT JOIN subscriptions s ON s.id = p.subscription_id
WHERE p.created_at >= NOW() - INTERVAL '24 hours'
  AND p.status = 'succeeded'
  AND (s.id IS NULL OR s.status != 'active')
ORDER BY p.created_at DESC;
