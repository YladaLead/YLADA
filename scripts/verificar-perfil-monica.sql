-- =====================================================
-- SCRIPT: Verificar Perfil da Monica
-- =====================================================
-- Execute este script para verificar o status do perfil da Monica
-- =====================================================

-- 1. Verificar se Monica existe no auth.users
SELECT 
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmado,
  created_at,
  last_sign_in_at,
  updated_at,
  banned_until IS NULL as usuario_nao_banido
FROM auth.users
WHERE email = 'mmg.monica@hotmail.com';

-- 2. Verificar perfil na tabela user_profiles
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  up.created_at,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  au.banned_until IS NULL as usuario_nao_banido
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.email = 'mmg.monica@hotmail.com';

-- 3. Verificar se tem perfil wellness
SELECT 
  up.email,
  up.perfil,
  CASE 
    WHEN up.perfil = 'wellness' THEN '✅ Perfil correto'
    WHEN up.perfil IS NULL THEN '❌ Sem perfil'
    ELSE '⚠️ Perfil incorreto: ' || up.perfil
  END as status_perfil,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  au.banned_until IS NULL as usuario_nao_banido
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.email = 'mmg.monica@hotmail.com';

-- 4. Verificar assinatura wellness (se existir)
SELECT 
  up.email,
  s.status as status_assinatura,
  s.area,
  s.plan_type,
  s.current_period_end,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() AND s.area = 'wellness' THEN '✅ Assinatura wellness ativa'
    WHEN s.status = 'active' AND s.current_period_end <= NOW() AND s.area = 'wellness' THEN '⚠️ Assinatura wellness expirada'
    WHEN s.status = 'canceled' AND s.area = 'wellness' THEN '❌ Assinatura wellness cancelada'
    WHEN s.area != 'wellness' THEN '⚠️ Tem assinatura mas não é wellness: ' || s.area
    ELSE '❌ Sem assinatura wellness'
  END as status_assinatura_detalhado
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
LEFT JOIN subscriptions s ON s.user_id = au.id AND s.area = 'wellness'
WHERE up.email = 'mmg.monica@hotmail.com';

-- 5. Verificar bloqueios de rate limit (se houver)
SELECT 
  up.email,
  nrl.is_blocked,
  nrl.blocked_until,
  nrl.created_at,
  CASE 
    WHEN nrl.is_blocked = true AND nrl.blocked_until > NOW() THEN '🔴 BLOQUEADO AGORA'
    WHEN nrl.is_blocked = true AND nrl.blocked_until <= NOW() THEN '⏰ BLOQUEIO EXPIRADO'
    ELSE '✅ NORMAL'
  END as status_rate_limit
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
LEFT JOIN noel_rate_limits nrl ON nrl.user_id = au.id
WHERE up.email = 'mmg.monica@hotmail.com'
ORDER BY nrl.created_at DESC
LIMIT 10;

-- 6. Verificar se Monica tem perfil wellness_noel_profile
SELECT 
  up.email,
  CASE 
    WHEN wnp.user_id IS NOT NULL THEN '✅ Tem perfil NOEL'
    ELSE '❌ Sem perfil NOEL'
  END as tem_perfil_noel,
  wnp.onboarding_completo,
  wnp.objetivo_principal,
  wnp.tempo_disponivel,
  wnp.experiencia_vendas,
  wnp.created_at as perfil_noel_criado_em
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
LEFT JOIN wellness_noel_profile wnp ON wnp.user_id = au.id
WHERE up.email = 'mmg.monica@hotmail.com';


