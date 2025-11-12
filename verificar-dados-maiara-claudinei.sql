-- =====================================================
-- VERIFICAR DADOS DE MAIARA E CLAUDINEI NO SUPABASE
-- =====================================================

-- 1. BUSCAR POR EMAIL (substitua pelos emails reais)
SELECT 
  au.id as auth_user_id,
  au.email,
  au.created_at as auth_created_at,
  au.last_sign_in_at,
  au.updated_at as auth_updated_at,
  up.id as profile_id,
  up.nome_completo,
  up.whatsapp,
  up.perfil,
  up.updated_at as profile_updated_at,
  up.created_at as profile_created_at
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'maiara@email.com',  -- SUBSTITUA PELO EMAIL REAL DA MAIARA
  'claudinei@email.com'  -- SUBSTITUA PELO EMAIL REAL DO CLAUDINEI
)
ORDER BY au.email;

-- 2. VERIFICAR SE OS DADOS FORAM ATUALIZADOS RECENTEMENTE
SELECT 
  email,
  nome_completo,
  whatsapp,
  updated_at,
  CASE 
    WHEN updated_at > NOW() - INTERVAL '1 hour' THEN 'Atualizado há menos de 1 hora'
    WHEN updated_at > NOW() - INTERVAL '1 day' THEN 'Atualizado há menos de 1 dia'
    ELSE 'Atualizado há mais de 1 dia'
  END as status_atualizacao
FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN (
    'maiara@email.com',  -- SUBSTITUA PELO EMAIL REAL DA MAIARA
    'claudinei@email.com'  -- SUBSTITUA PELO EMAIL REAL DO CLAUDINEI
  )
);

-- 3. VERIFICAR SE HÁ ASSINATURAS MIGRADAS PARA ELES
SELECT 
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.is_migrated,
  s.current_period_end,
  au.email,
  up.nome_completo
FROM subscriptions s
JOIN auth.users au ON s.user_id = au.id
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE au.email IN (
  'maiara@email.com',  -- SUBSTITUA PELO EMAIL REAL DA MAIARA
  'claudinei@email.com'  -- SUBSTITUA PELO EMAIL REAL DO CLAUDINEI
)
AND s.is_migrated = true;

-- 4. VERIFICAR LOGS DE ATUALIZAÇÃO (se houver tabela de logs)
-- Nota: Isso depende de ter uma tabela de logs configurada

