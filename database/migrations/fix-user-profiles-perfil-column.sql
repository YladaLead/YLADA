-- Script para adicionar coluna 'perfil' se não existir
-- Execute no Supabase SQL Editor

-- 1. Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 2. Adicionar coluna 'perfil' se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'perfil'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN perfil VARCHAR(50);
    RAISE NOTICE 'Coluna "perfil" adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna "perfil" já existe';
  END IF;
END $$;

-- 3. Atualizar valores NULL para 'nutri' (padrão temporário)
UPDATE user_profiles SET perfil = 'nutri' WHERE perfil IS NULL;

-- 4. Adicionar constraint CHECK se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_profiles_perfil_check'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_perfil_check 
    CHECK (perfil IN ('nutri', 'wellness', 'coach', 'nutra', 'admin'));
    RAISE NOTICE 'Constraint CHECK adicionada';
  ELSE
    RAISE NOTICE 'Constraint CHECK já existe';
  END IF;
END $$;

-- 5. Tornar NOT NULL (opcional - pode causar erro se houver NULLs)
-- Descomente apenas se tiver certeza que não há valores NULL
-- ALTER TABLE user_profiles ALTER COLUMN perfil SET NOT NULL;

-- 6. Criar/atualizar perfil do usuário andre@gmail.com
-- Primeiro, garantir que o perfil existe
INSERT INTO user_profiles (user_id, perfil, email, nome_completo)
SELECT 
  id,
  'wellness',
  email,
  COALESCE(user_metadata->>'full_name', user_metadata->>'name', email)
FROM auth.users
WHERE email = 'andre@gmail.com'
ON CONFLICT (user_id) DO UPDATE
SET 
  perfil = 'wellness',
  updated_at = NOW();

-- 7. Verificar resultado
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

