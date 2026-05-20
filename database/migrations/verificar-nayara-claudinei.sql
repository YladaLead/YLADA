-- =====================================================
-- VERIFICAR DADOS DE NAYARA E CLAUDINEI
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. BUSCAR POR EMAIL (substitua pelos emails reais)
SELECT 
  au.id as auth_user_id,
  au.email,
  au.created_at as auth_created_at,
  au.last_sign_in_at,
  up.id as profile_id,
  up.nome_completo,
  up.whatsapp,
  up.perfil,
  up.updated_at as profile_updated_at,
  up.created_at as profile_created_at,
  CASE 
    WHEN up.nome_completo IS NULL OR up.nome_completo = '' THEN '❌ Sem nome'
    WHEN up.whatsapp IS NULL OR up.whatsapp = '' THEN '❌ Sem WhatsApp'
    ELSE '✅ Completo'
  END as status_perfil
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'naytenutri@gmail.com',  -- Email da Nayara
  'claubemestar@gmail.com'  -- Email do Claudinei (ajuste se necessário)
)
ORDER BY au.email;

-- 2. VERIFICAR SE TEM ASSINATURA MIGRADA
SELECT 
  au.email,
  up.nome_completo,
  up.whatsapp,
  s.is_migrated,
  s.status,
  s.current_period_end
FROM subscriptions s
JOIN auth.users au ON s.user_id = au.id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE au.email IN (
  'naytenutri@gmail.com',
  'claubemestar@gmail.com'
)
AND s.is_migrated = true;

-- 3. VERIFICAR ÚLTIMAS ATUALIZAÇÕES DE PERFIL
SELECT 
  email,
  nome_completo,
  whatsapp,
  updated_at,
  CASE 
    WHEN updated_at > NOW() - INTERVAL '1 hour' THEN 'Atualizado há menos de 1 hora ✅'
    WHEN updated_at > NOW() - INTERVAL '1 day' THEN 'Atualizado há menos de 1 dia ✅'
    ELSE 'Atualizado há mais de 1 dia ⚠️'
  END as status_atualizacao
FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN (
    'naytenutri@gmail.com',
    'claubemestar@gmail.com'
  )
);

