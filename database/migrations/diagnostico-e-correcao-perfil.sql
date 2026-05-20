-- =====================================================
-- DIAGNÓSTICO E CORREÇÃO COMPLETA DO PERFIL FAULA ANDRÉ
-- =====================================================

-- =====================================================
-- 1. VERIFICAR SE O USUÁRIO EXISTE EM auth.users
-- =====================================================

SELECT 
  id as user_id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- 2. VERIFICAR SE EXISTE PERFIL EM user_profiles
-- =====================================================

SELECT 
  id,
  user_id,
  email,
  nome_completo,
  perfil,
  is_admin,
  is_support,
  user_slug,
  bio,
  created_at,
  updated_at
FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- 3. VERIFICAR SE O user_id CORRESPONDE
-- =====================================================

-- Comparar user_id do auth.users com user_profiles
SELECT 
  au.id as auth_user_id,
  au.email as auth_email,
  up.id as profile_id,
  up.user_id as profile_user_id,
  up.email as profile_email,
  up.is_admin,
  up.is_support
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email = 'faulaandre@gmail.com';

-- =====================================================
-- 4. LIMPAR E RECRIAR PERFIL CORRETAMENTE
-- =====================================================

-- Deletar todos os registros duplicados
DELETE FROM user_profiles WHERE email = 'faulaandre@gmail.com';

-- Criar/atualizar perfil único usando o user_id correto
DO $$
DECLARE
  v_user_id UUID;
  v_profile_id UUID;
BEGIN
  -- Buscar user_id do auth.users
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'faulaandre@gmail.com' 
  LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário faulaandre@gmail.com não encontrado em auth.users';
  END IF;
  
  RAISE NOTICE 'User ID encontrado: %', v_user_id;
  
  -- Verificar se já existe perfil com esse user_id
  SELECT id INTO v_profile_id
  FROM user_profiles
  WHERE user_id = v_user_id;
  
  IF v_profile_id IS NOT NULL THEN
    -- Atualizar existente
    UPDATE user_profiles SET
      perfil = 'wellness',
      nome_completo = 'ANDRE FAULA',
      email = 'faulaandre@gmail.com',
      is_admin = true,
      is_support = true,
      user_slug = COALESCE(user_slug, 'andre'),
      bio = COALESCE(bio, 'Herbalife'),
      country_code = COALESCE(country_code, 'BR'),
      updated_at = NOW()
    WHERE user_id = v_user_id;
    
    RAISE NOTICE '✅ Perfil atualizado! ID: %', v_profile_id;
  ELSE
    -- Criar novo
    INSERT INTO user_profiles (
      user_id,
      perfil,
      nome_completo,
      email,
      whatsapp,
      bio,
      user_slug,
      country_code,
      is_admin,
      is_support
    ) VALUES (
      v_user_id,
      'wellness',
      'ANDRE FAULA',
      'faulaandre@gmail.com',
      NULL,
      'Herbalife',
      'andre',
      'BR',
      true,
      true
    )
    RETURNING id INTO v_profile_id;
    
    RAISE NOTICE '✅ Perfil criado! ID: %', v_profile_id;
  END IF;
END $$;

-- =====================================================
-- 5. VERIFICAR RESULTADO FINAL
-- =====================================================

SELECT 
  'RESULTADO FINAL' as status,
  up.id,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.user_slug,
  up.bio,
  -- Verificar se user_id corresponde
  CASE 
    WHEN au.id = up.user_id THEN '✅ CORRETO'
    ELSE '❌ ERRO: user_id não corresponde'
  END as verificacao_user_id
FROM user_profiles up
LEFT JOIN auth.users au ON au.email = up.email
WHERE up.email = 'faulaandre@gmail.com';

-- =====================================================
-- 6. TESTAR LEITURA COM RLS (SIMULAR CLIENTE)
-- =====================================================

-- Esta query simula o que o cliente Supabase faria
-- Se você conseguir ver o resultado, significa que RLS está funcionando
-- Se não conseguir, há problema com RLS

-- NOTA: Esta query pode não funcionar no SQL Editor se você não estiver autenticado
-- Mas serve para verificar a estrutura

SELECT 
  'Teste de leitura RLS' as teste,
  COUNT(*) as total_registros_encontrados
FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- 7. VERIFICAR POLÍTICAS RLS ATIVAS
-- =====================================================

SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN substring(qual, 1, 100)
    ELSE 'Sem USING'
  END as using_clause
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- =====================================================
-- 8. GARANTIR QUE RLS ESTÁ HABILITADO
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Verificar
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

