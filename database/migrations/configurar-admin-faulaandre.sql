-- =====================================================
-- VERIFICAR E CONFIGURAR ADMIN: faulaandre@gmail.com
-- =====================================================

-- 1. VERIFICAR SE O USUÁRIO EXISTE NO SUPABASE AUTH
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'faulaandre@gmail.com';

-- 2. VERIFICAR SE TEM PERFIL NA TABELA user_profiles
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.nome_completo,
  au.email as auth_email,
  au.email_confirmed_at
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'faulaandre@gmail.com' 
   OR up.email = 'faulaandre@gmail.com';

-- 3. SE O USUÁRIO EXISTE NO AUTH MAS NÃO TEM PERFIL, CRIAR PERFIL ADMIN
-- (Execute apenas se o usuário existir no auth.users mas não tiver perfil)
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar user_id do email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'faulaandre@gmail.com';
  
  -- Se usuário existe e não tem perfil, criar
  IF v_user_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = v_user_id
  ) THEN
    INSERT INTO user_profiles (
      user_id,
      email,
      perfil,
      is_admin,
      is_support,
      nome_completo
    ) VALUES (
      v_user_id,
      'faulaandre@gmail.com',
      'admin',
      true,
      false,
      'Admin'
    );
  END IF;
END $$;

-- 4. SE O PERFIL JÁ EXISTE, ATUALIZAR PARA ADMIN
-- IMPORTANTE: Admin pode ter qualquer perfil base, mas is_admin = true permite acesso total
UPDATE user_profiles up
SET 
  is_admin = true,
  is_support = false,
  perfil = COALESCE(up.perfil, 'admin') -- Manter perfil atual se existir, senão 'admin'
FROM auth.users au
WHERE up.user_id = au.id
  AND au.email = 'faulaandre@gmail.com';

-- 5. VERIFICAÇÃO FINAL
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.nome_completo,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'faulaandre@gmail.com' 
   OR up.email = 'faulaandre@gmail.com';

