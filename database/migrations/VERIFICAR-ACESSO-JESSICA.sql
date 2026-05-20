-- =====================================================
-- VERIFICAÇÃO COMPLETA DE ACESSO - JESSICA SOUZA
-- =====================================================
-- 
-- Email: jessica.souza17@yahoo.com
-- Área: Nutri
-- 
-- Este script verifica TODOS os aspectos da conta:
-- 1. Usuário no Supabase Auth
-- 2. Email confirmado
-- 3. Perfil criado
-- 4. Assinatura ativa
-- 5. Diagnóstico completo (se necessário)
--
-- =====================================================

-- =====================================================
-- 1. VERIFICAÇÃO COMPLETA DO USUÁRIO
-- =====================================================

SELECT 
  '🔍 VERIFICAÇÃO COMPLETA' as tipo,
  au.id as user_id,
  au.email as auth_email,
  au.email_confirmed_at,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN '❌ Email NÃO confirmado'
    ELSE '✅ Email confirmado'
  END as status_email,
  au.created_at as data_criacao_auth,
  up.id as profile_id,
  up.nome_completo,
  up.perfil,
  up.diagnostico_completo,
  up.is_active,
  up.created_at as data_criacao_perfil,
  CASE 
    WHEN up.id IS NULL THEN '❌ Perfil NÃO existe'
    WHEN up.perfil != 'nutri' THEN '⚠️ Perfil incorreto: ' || up.perfil
    WHEN up.is_active = false THEN '⚠️ Perfil inativo'
    ELSE '✅ Perfil OK'
  END as status_perfil
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE LOWER(au.email) = LOWER('jessica.souza17@yahoo.com');

-- =====================================================
-- 2. VERIFICAÇÃO DE ASSINATURA
-- =====================================================

SELECT 
  '💳 VERIFICAÇÃO DE ASSINATURA' as tipo,
  au.email,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  CASE 
    WHEN s.id IS NULL THEN '❌ SEM assinatura'
    WHEN s.status != 'active' THEN '⚠️ Assinatura com status: ' || s.status
    WHEN s.current_period_end < NOW() THEN '❌ Assinatura EXPIRADA'
    WHEN s.current_period_end >= NOW() THEN '✅ Assinatura ATIVA'
    ELSE '⚠️ Status desconhecido'
  END as status_assinatura,
  s.created_at as data_criacao_assinatura
FROM auth.users au
LEFT JOIN subscriptions s ON au.id = s.user_id AND s.area = 'nutri'
WHERE LOWER(au.email) = LOWER('jessica.souza17@yahoo.com');

-- =====================================================
-- 3. VERIFICAÇÃO DE DIAGNÓSTICO
-- =====================================================

SELECT 
  '📋 VERIFICAÇÃO DE DIAGNÓSTICO' as tipo,
  au.email,
  up.diagnostico_completo,
  CASE 
    WHEN up.diagnostico_completo IS NULL THEN '⚠️ Flag não definida'
    WHEN up.diagnostico_completo = true THEN '✅ Diagnóstico completo'
    ELSE '❌ Diagnóstico NÃO completo'
  END as status_diagnostico,
  d.id as diagnostico_id,
  d.created_at as data_diagnostico
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN diagnosticos d ON au.id = d.user_id AND d.area = 'nutri'
WHERE LOWER(au.email) = LOWER('jessica.souza17@yahoo.com');

-- =====================================================
-- 4. RESUMO FINAL - TUDO QUE PRECISA ESTAR OK
-- =====================================================

SELECT 
  '📊 RESUMO FINAL' as tipo,
  au.email,
  CASE 
    WHEN au.id IS NULL THEN '❌ USUÁRIO NÃO EXISTE no Supabase Auth'
    WHEN au.email_confirmed_at IS NULL THEN '⚠️ Email não confirmado'
    WHEN up.id IS NULL THEN '❌ PERFIL NÃO EXISTE'
    WHEN up.perfil != 'nutri' THEN '❌ PERFIL INCORRETO: ' || up.perfil
    WHEN up.is_active = false THEN '⚠️ Perfil inativo'
    WHEN s.id IS NULL THEN '❌ SEM ASSINATURA'
    WHEN s.status != 'active' THEN '⚠️ Assinatura inativa: ' || s.status
    WHEN s.current_period_end < NOW() THEN '❌ Assinatura EXPIRADA'
    WHEN up.diagnostico_completo = false THEN '⚠️ Diagnóstico não completo (OK se for primeiro acesso)'
    ELSE '✅ TUDO OK - Conta configurada corretamente!'
  END as status_geral,
  au.email_confirmed_at IS NOT NULL as email_ok,
  up.id IS NOT NULL as perfil_ok,
  (up.perfil = 'nutri' AND up.is_active = true) as perfil_correto,
  (s.id IS NOT NULL AND s.status = 'active' AND s.current_period_end >= NOW()) as assinatura_ok,
  up.diagnostico_completo as tem_diagnostico
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN subscriptions s ON au.id = s.user_id AND s.area = 'nutri'
WHERE LOWER(au.email) = LOWER('jessica.souza17@yahoo.com');

-- =====================================================
-- 5. CORREÇÕES AUTOMÁTICAS (se necessário)
-- =====================================================
-- Execute estas correções APENAS se algo estiver faltando

-- 5.1. Criar/Atualizar Perfil (se não existir ou estiver incorreto)
INSERT INTO user_profiles (user_id, perfil, email, nome_completo, is_active)
SELECT 
  au.id,
  'nutri',
  'jessica.souza17@yahoo.com',
  COALESCE(au.raw_user_meta_data->>'full_name', 'Jessica Souza', 'Jessica Souza'),
  true
FROM auth.users au
WHERE LOWER(au.email) = LOWER('jessica.souza17@yahoo.com')
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.user_id = au.id
  )
ON CONFLICT (user_id) 
DO UPDATE SET
  perfil = 'nutri',
  email = 'jessica.souza17@yahoo.com',
  is_active = true,
  updated_at = NOW();

-- 5.2. Criar Assinatura (se não existir)
-- NOTA: Ajuste os valores conforme necessário (plano anual/mensal, etc)
DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER('jessica.souza17@yahoo.com');

  IF v_user_id IS NULL THEN
    RAISE NOTICE '⚠️ Usuário não encontrado. Crie primeiro no Supabase Dashboard > Authentication > Users';
    RETURN;
  END IF;

  -- Verificar se já existe assinatura
  SELECT id INTO v_subscription_id
  FROM subscriptions
  WHERE user_id = v_user_id
    AND area = 'nutri'
  LIMIT 1;

  IF v_subscription_id IS NULL THEN
    -- Criar assinatura anual (ajuste conforme necessário)
    INSERT INTO subscriptions (
      user_id,
      area,
      plan_type,
      status,
      current_period_start,
      current_period_end,
      created_at,
      updated_at
    )
    VALUES (
      v_user_id,
      'nutri',
      'annual', -- ou 'monthly' conforme o plano
      'active',
      NOW(),
      NOW() + INTERVAL '1 year', -- Ajuste conforme necessário
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Assinatura criada para jessica.souza17@yahoo.com';
  ELSE
    -- Atualizar assinatura existente para garantir que está ativa
    UPDATE subscriptions
    SET 
      status = 'active',
      current_period_end = GREATEST(current_period_end, NOW() + INTERVAL '1 year'),
      updated_at = NOW()
    WHERE id = v_subscription_id;
    
    RAISE NOTICE '✅ Assinatura atualizada para jessica.souza17@yahoo.com';
  END IF;
END $$;

-- =====================================================
-- 6. VERIFICAÇÃO FINAL APÓS CORREÇÕES
-- =====================================================

SELECT 
  '✅ VERIFICAÇÃO FINAL' as tipo,
  au.email,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  up.perfil = 'nutri' as perfil_correto,
  up.is_active as perfil_ativo,
  s.status = 'active' as assinatura_ativa,
  s.current_period_end >= NOW() as assinatura_valida,
  up.diagnostico_completo as tem_diagnostico,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN '⚠️ Confirmar email no Dashboard'
    WHEN up.perfil != 'nutri' THEN '❌ Perfil incorreto'
    WHEN s.status != 'active' THEN '❌ Assinatura inativa'
    WHEN s.current_period_end < NOW() THEN '❌ Assinatura expirada'
    ELSE '✅ TUDO OK!'
  END as status_final
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN subscriptions s ON au.id = s.user_id AND s.area = 'nutri'
WHERE LOWER(au.email) = LOWER('jessica.souza17@yahoo.com');

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================
-- 
-- 1. Execute este script no Supabase SQL Editor
-- 
-- 2. Verifique os resultados de cada seção:
--    - Seção 1: Verifica usuário e perfil
--    - Seção 2: Verifica assinatura
--    - Seção 3: Verifica diagnóstico
--    - Seção 4: Resumo geral
-- 
-- 3. Se algo estiver faltando:
--    - As correções automáticas (Seção 5) serão executadas
--    - Verifique novamente com a Seção 6
-- 
-- 4. Se o usuário NÃO existe no Supabase Auth:
--    - Vá em Authentication > Users > Add User
--    - Email: jessica.souza17@yahoo.com
--    - Password: [defina uma senha]
--    - Auto Confirm User: ✅ MARCAR
--    - Execute este script novamente
-- 
-- 5. Se o email não estiver confirmado:
--    - Vá em Authentication > Users
--    - Clique no usuário jessica.souza17@yahoo.com
--    - Clique em "Confirm Email"
-- 
-- 6. Para testar o acesso:
--    - Acesse: /pt/nutri/login
--    - Email: jessica.souza17@yahoo.com
--    - Senha: [senha definida]
-- 
-- 7. Fluxo esperado após login:
--    - Se NÃO tem diagnóstico: /pt/nutri/onboarding
--    - Se TEM diagnóstico: /pt/nutri/home
