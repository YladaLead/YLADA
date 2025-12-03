-- =====================================================
-- DIAGNÓSTICO COMPLETO: Cliente clube@shakecomvida.com.br
-- User UID: 95fe4bc7-c135-43ad-88c2-ad4b1adf4d09
-- =====================================================

-- 1. VERIFICAR SE O PERFIL EXISTE
SELECT 
  '1. PERFIL DO USUÁRIO' as verificacao,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.created_at,
  up.updated_at,
  CASE 
    WHEN up.user_id IS NULL THEN '❌ PERFIL NÃO EXISTE - PROBLEMA CRÍTICO!'
    WHEN up.perfil IS NULL THEN '⚠️ PERFIL SEM ÁREA DEFINIDA'
    ELSE '✅ PERFIL OK'
  END as status_perfil
FROM user_profiles up
WHERE up.user_id = '95fe4bc7-c135-43ad-88c2-ad4b1adf4d09'
   OR up.email = 'clube@shakecomvida.com.br';

-- 2. VERIFICAR ASSINATURAS (TODAS AS ÁREAS)
SELECT 
  '2. ASSINATURAS DO USUÁRIO' as verificacao,
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount / 100.0 as valor_reais,
  s.currency,
  s.current_period_start,
  s.current_period_end,
  s.created_at,
  s.gateway,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ ATIVA E VÁLIDA'
    WHEN s.status = 'active' AND s.current_period_end <= NOW() THEN '❌ ATIVA MAS EXPIRADA'
    WHEN s.status != 'active' THEN '❌ STATUS: ' || s.status
    ELSE '⚠️ VERIFICAR'
  END as status_assinatura,
  CASE 
    WHEN s.current_period_end > NOW() THEN 
      EXTRACT(DAY FROM (s.current_period_end - NOW())) || ' dias restantes'
    ELSE 
      'EXPIRADA há ' || EXTRACT(DAY FROM (NOW() - s.current_period_end)) || ' dias'
  END as dias_restantes
FROM subscriptions s
WHERE s.user_id = '95fe4bc7-c135-43ad-88c2-ad4b1adf4d09'
ORDER BY s.created_at DESC;

-- 3. VERIFICAR SE HÁ ASSINATURA ANUAL ATIVA
SELECT 
  '3. ASSINATURA ANUAL ESPECÍFICA' as verificacao,
  s.id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  NOW() as agora,
  s.current_period_end > NOW() as ainda_valida,
  CASE 
    WHEN s.plan_type = 'annual' AND s.status = 'active' AND s.current_period_end > NOW() THEN 
      '✅ ASSINATURA ANUAL ATIVA E VÁLIDA'
    WHEN s.plan_type = 'annual' AND s.status = 'active' AND s.current_period_end <= NOW() THEN 
      '❌ ASSINATURA ANUAL EXPIRADA (corrigir current_period_end)'
    WHEN s.plan_type = 'annual' AND s.status != 'active' THEN 
      '❌ ASSINATURA ANUAL COM STATUS: ' || s.status || ' (deveria ser active)'
    WHEN s.plan_type != 'annual' THEN 
      '⚠️ NÃO É PLANO ANUAL (é ' || s.plan_type || ')'
    ELSE 
      '❌ NENHUMA ASSINATURA ANUAL ENCONTRADA'
  END as diagnostico
FROM subscriptions s
WHERE s.user_id = '95fe4bc7-c135-43ad-88c2-ad4b1adf4d09'
  AND s.plan_type = 'annual'
ORDER BY s.created_at DESC
LIMIT 1;

-- 4. VERIFICAR AUTENTICAÇÃO NO SUPABASE AUTH
SELECT 
  '4. AUTENTICAÇÃO SUPABASE' as verificacao,
  au.id as user_id,
  au.email,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  au.last_sign_in_at,
  au.created_at,
  CASE 
    WHEN au.id IS NULL THEN '❌ USUÁRIO NÃO EXISTE NO AUTH'
    WHEN au.email_confirmed_at IS NULL THEN '⚠️ EMAIL NÃO CONFIRMADO'
    ELSE '✅ AUTENTICAÇÃO OK'
  END as status_auth
FROM auth.users au
WHERE au.id = '95fe4bc7-c135-43ad-88c2-ad4b1adf4d09'
   OR au.email = 'clube@shakecomvida.com.br';

-- 5. VERIFICAR PAGAMENTOS RECENTES
SELECT 
  '5. PAGAMENTOS RECENTES' as verificacao,
  p.id,
  p.subscription_id,
  p.amount / 100.0 as valor_reais,
  p.status,
  p.payment_method,
  p.created_at,
  s.plan_type,
  s.area,
  CASE 
    WHEN p.status = 'succeeded' THEN '✅ PAGAMENTO APROVADO'
    WHEN p.status = 'pending' THEN '⏳ PAGAMENTO PENDENTE'
    WHEN p.status = 'failed' THEN '❌ PAGAMENTO FALHOU'
    ELSE '⚠️ STATUS: ' || p.status
  END as status_pagamento
FROM payments p
INNER JOIN subscriptions s ON p.subscription_id = s.id
WHERE s.user_id = '95fe4bc7-c135-43ad-88c2-ad4b1adf4d09'
ORDER BY p.created_at DESC
LIMIT 5;

-- 6. RESUMO FINAL - O QUE ESTÁ ERRADO?
SELECT 
  '6. RESUMO DO DIAGNÓSTICO' as verificacao,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = '95fe4bc7-c135-43ad-88c2-ad4b1adf4d09') THEN 
      '❌ PROBLEMA CRÍTICO: Perfil não existe na tabela user_profiles'
    WHEN NOT EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE user_id = '95fe4bc7-c135-43ad-88c2-ad4b1adf4d09' 
        AND plan_type = 'annual' 
        AND status = 'active' 
        AND current_period_end > NOW()
    ) THEN 
      '❌ PROBLEMA: Não há assinatura anual ativa e válida'
    WHEN EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE user_id = '95fe4bc7-c135-43ad-88c2-ad4b1adf4d09' 
        AND plan_type = 'annual' 
        AND status = 'active' 
        AND current_period_end <= NOW()
    ) THEN 
      '❌ PROBLEMA: Assinatura anual existe mas está expirada (corrigir current_period_end)'
    WHEN EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE user_id = '95fe4bc7-c135-43ad-88c2-ad4b1adf4d09' 
        AND plan_type = 'annual' 
        AND status != 'active'
    ) THEN 
      '❌ PROBLEMA: Assinatura anual existe mas status não é "active"'
    ELSE 
      '✅ TUDO PARECE OK - Problema pode ser de cookies/sessão'
  END as diagnostico_final;

