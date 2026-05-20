-- =====================================================
-- CORRIGIR STATUS ADMIN DO FAULAANDRE
-- =====================================================
-- Este script garante que faulaandre@gmail.com
-- está configurado como admin
-- =====================================================

-- 1. OBTER USER_ID DO FAULAANDRE
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'faulaandre@gmail.com';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário faulaandre@gmail.com não encontrado em auth.users';
  END IF;
  
  RAISE NOTICE 'User ID encontrado: %', v_user_id;
  
  -- 2. GARANTIR QUE EXISTE PERFIL
  INSERT INTO user_profiles (
    user_id,
    email,
    nome_completo,
    perfil,
    is_admin,
    is_support,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    'faulaandre@gmail.com',
    'ANDRE FAULA',
    'wellness',
    true,  -- ✅ É ADMIN
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    nome_completo = COALESCE(EXCLUDED.nome_completo, user_profiles.nome_completo),
    perfil = COALESCE(EXCLUDED.perfil, user_profiles.perfil),
    is_admin = true,  -- ✅ GARANTIR QUE É ADMIN
    is_support = COALESCE(EXCLUDED.is_support, user_profiles.is_support),
    updated_at = NOW();
  
  RAISE NOTICE '✅ Perfil atualizado/criado com is_admin = true';
END $$;

-- 3. VERIFICAR RESULTADO
SELECT 
  email,
  nome_completo,
  perfil,
  is_admin,
  is_support,
  updated_at,
  CASE 
    WHEN is_admin = true THEN '✅ CORRIGIDO: É ADMIN'
    ELSE '❌ ERRO: Ainda não é admin'
  END as status
FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

