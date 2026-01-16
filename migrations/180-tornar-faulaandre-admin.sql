-- Tornar faulaandre@gmail.com admin
-- Execute este script no Supabase SQL Editor

-- 1. Verificar usuário atual
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role_atual,
  up.is_admin as is_admin_atual,
  up.perfil as perfil_atual
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'faulaandre@gmail.com';

-- 2. Adicionar role admin no user_metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'faulaandre@gmail.com';

-- 3. Garantir is_admin = true no user_profiles
INSERT INTO user_profiles (user_id, is_admin, perfil)
SELECT id, true, 'admin'
FROM auth.users
WHERE email = 'faulaandre@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  is_admin = true,
  perfil = COALESCE(user_profiles.perfil, 'admin');

-- 4. Verificar resultado
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role,
  up.is_admin,
  up.perfil,
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'admin' OR up.is_admin = true 
    THEN '✅ ADMIN CONFIGURADO'
    ELSE '❌ AINDA NÃO É ADMIN'
  END as status
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'faulaandre@gmail.com';
