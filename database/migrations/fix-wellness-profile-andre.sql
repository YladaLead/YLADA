-- Script para verificar e corrigir perfil do usuário andre@gmail.com
-- Execute no Supabase SQL Editor

-- 1. Verificar se o usuário existe na auth.users
SELECT 
  id,
  email,
  user_metadata->>'perfil' as perfil_metadata,
  user_metadata->>'name' as nome_metadata,
  created_at
FROM auth.users
WHERE email = 'andre@gmail.com';

-- 2. Verificar se existe perfil na tabela user_profiles
SELECT 
  up.*,
  au.email,
  au.user_metadata
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'andre@gmail.com';

-- 3. Se o perfil não existe ou está incorreto, criar/atualizar:
-- Opção A: Criar perfil se não existir
INSERT INTO user_profiles (user_id, perfil, nome_completo, email)
SELECT 
  id,
  'wellness', -- Perfil correto
  COALESCE(user_metadata->>'full_name', user_metadata->>'name', email),
  email
FROM auth.users
WHERE email = 'andre@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE user_id = auth.users.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Opção B: Atualizar perfil se existir mas estiver incorreto
UPDATE user_profiles
SET 
  perfil = 'wellness',
  updated_at = NOW()
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'andre@gmail.com'
)
AND (perfil IS NULL OR perfil != 'wellness');

-- 4. Verificar resultado final
SELECT 
  up.id,
  up.user_id,
  up.perfil,
  up.nome_completo,
  up.email,
  up.created_at,
  up.updated_at,
  au.email as auth_email
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'andre@gmail.com';

