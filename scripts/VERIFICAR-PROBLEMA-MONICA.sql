-- =====================================================
-- DIAGNÓSTICO: Por que apenas a Monica está com erro 401?
-- Execute no Supabase SQL Editor
-- Substitua 'email_da_monica@...' pelo email real dela
-- =====================================================

-- 1. Buscar dados básicos da Monica
SELECT 
  id as auth_user_id,
  email,
  created_at as conta_criada_em,
  last_sign_in_at as ultimo_login,
  confirmed_at as email_confirmado,
  banned_until,
  CASE 
    WHEN banned_until IS NOT NULL THEN '🚫 BANIDA'
    WHEN confirmed_at IS NULL THEN '⚠️ EMAIL NÃO CONFIRMADO'
    ELSE '✅ OK'
  END as status_conta
FROM auth.users
WHERE email = 'mmg.monica@hotmail.com';

-- 2. Verificar o perfil da Monica na tabela user_profiles
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.created_at,
  CASE 
    WHEN up.perfil IS NULL THEN '❌ PERFIL NÃO DEFINIDO'
    WHEN up.perfil != 'wellness' THEN '⚠️ PERFIL DIFERENTE: ' || up.perfil
    ELSE '✅ wellness'
  END as status_perfil
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE u.email = 'mmg.monica@hotmail.com';

-- 3. Verificar assinatura ativa da Monica
SELECT 
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.canceled_at,
  CASE 
    WHEN s.status = 'active' AND (s.current_period_end IS NULL OR s.current_period_end > NOW()) THEN '✅ ATIVA'
    WHEN s.status = 'active' AND s.current_period_end < NOW() THEN '❌ EXPIRADA'
    WHEN s.status = 'canceled' THEN '❌ CANCELADA'
    WHEN s.status = 'past_due' THEN '⚠️ PAGAMENTO PENDENTE'
    ELSE '❓ ' || COALESCE(s.status, 'SEM ASSINATURA')
  END as status_assinatura
FROM subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE u.email = 'mmg.monica@hotmail.com'
  AND s.area = 'wellness'
ORDER BY s.created_at DESC
LIMIT 5;

-- 4. Verificar se Monica tem perfil NOEL (onboarding)
SELECT 
  wnp.id,
  wnp.user_id,
  wnp.onboarding_completo,
  wnp.tipo_trabalho,
  wnp.meta_financeira,
  wnp.created_at,
  wnp.updated_at,
  CASE 
    WHEN wnp.onboarding_completo = true THEN '✅ ONBOARDING COMPLETO'
    ELSE '⚠️ ONBOARDING INCOMPLETO'
  END as status_onboarding
FROM wellness_noel_profile wnp
JOIN auth.users u ON u.id = wnp.user_id
WHERE u.email = 'mmg.monica@hotmail.com';

-- 5. Verificar últimas interações da Monica com o NOEL
SELECT 
  ni.created_at,
  LEFT(ni.user_message, 50) as mensagem,
  ni.module,
  ni.source,
  CASE 
    WHEN ni.noel_response IS NOT NULL THEN '✅ Respondido'
    ELSE '❌ Sem resposta'
  END as status
FROM noel_interactions ni
JOIN auth.users u ON u.id = ni.user_id
WHERE u.email = 'mmg.monica@hotmail.com'
ORDER BY ni.created_at DESC
LIMIT 10;

-- 6. Verificar se há sessões ativas da Monica
SELECT 
  COUNT(*) as total_sessions,
  MAX(s.created_at) as ultima_sessao_criada
FROM auth.sessions s
JOIN auth.users u ON u.id = s.user_id
WHERE u.email = 'mmg.monica@hotmail.com';

-- 7. DIAGNÓSTICO RESUMIDO
-- Execute cada query acima e verifique:
-- a) Se a conta está OK (não banida, email confirmado)
-- b) Se o perfil está como 'wellness'
-- c) Se tem assinatura ATIVA para 'wellness'
-- d) Se tem perfil NOEL (onboarding)
-- e) Se as interações recentes foram bem-sucedidas

-- =====================================================
-- POSSÍVEIS CAUSAS DO ERRO 401 APENAS PARA MONICA:
-- =====================================================
-- 
-- 1. SESSÃO EXPIRADA/CORROMPIDA
--    → Solução: Pedir para Monica fazer LOGOUT e LOGIN novamente
--
-- 2. PERFIL NÃO É 'wellness'
--    → O campo 'perfil' em user_profiles precisa ser 'wellness'
--    → Se estiver NULL ou diferente, a API retorna 401
--
-- 3. ASSINATURA INATIVA/EXPIRADA
--    → Verificar se tem assinatura ativa para área 'wellness'
--
-- 4. EMAIL NÃO CONFIRMADO
--    → Verificar confirmed_at em auth.users
--
-- 5. CONTA BANIDA
--    → Verificar banned_until em auth.users
--
-- 6. CACHE CORROMPIDO NO NAVEGADOR/PWA
--    → Solução: Limpar dados do app/navegador
--
-- =====================================================

-- CORREÇÃO RÁPIDA (se o perfil estiver errado):
-- UPDATE user_profiles 
-- SET perfil = 'wellness'
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'email_da_monica@...');

