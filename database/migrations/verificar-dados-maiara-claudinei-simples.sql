-- =====================================================
-- VERIFICAR DADOS DE MAIARA E CLAUDINEI NO SUPABASE
-- =====================================================
-- SUBSTITUA OS EMAILS PELOS REAIS ANTES DE EXECUTAR
-- =====================================================

-- 1. BUSCAR DADOS COMPLETOS (SUBSTITUA OS EMAILS)
SELECT 
  au.email,
  au.created_at as data_cadastro_auth,
  au.last_sign_in_at as ultimo_login,
  up.nome_completo,
  up.whatsapp,
  up.perfil,
  up.updated_at as data_atualizacao_perfil,
  up.created_at as data_criacao_perfil
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'SUBSTITUA_PELO_EMAIL_DA_MAIARA',
  'SUBSTITUA_PELO_EMAIL_DO_CLAUDINEI'
)
ORDER BY au.email;

-- 2. VERIFICAR SE OS DADOS FORAM ATUALIZADOS RECENTEMENTE
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
    'SUBSTITUA_PELO_EMAIL_DA_MAIARA',
    'SUBSTITUA_PELO_EMAIL_DO_CLAUDINEI'
  )
);

-- 3. VERIFICAR ASSINATURAS MIGRADAS
SELECT 
  au.email,
  up.nome_completo,
  s.area,
  s.plan_type,
  s.status,
  s.is_migrated,
  s.current_period_end
FROM subscriptions s
JOIN auth.users au ON s.user_id = au.id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE au.email IN (
  'SUBSTITUA_PELO_EMAIL_DA_MAIARA',
  'SUBSTITUA_PELO_EMAIL_DO_CLAUDINEI'
)
AND s.is_migrated = true;

