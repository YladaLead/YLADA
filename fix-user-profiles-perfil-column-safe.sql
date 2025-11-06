-- Script SEGURO para adicionar colunas necessárias e corrigir perfil
-- Execute no Supabase SQL Editor

-- 1. Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 2. Verificar foreign keys da tabela
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'user_profiles';

-- 3. Adicionar coluna 'perfil' se não existir
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

-- 4. Adicionar coluna 'email' se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email VARCHAR(255);
    RAISE NOTICE 'Coluna "email" adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna "email" já existe';
  END IF;
END $$;

-- 5. Adicionar coluna 'nome_completo' se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'nome_completo'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN nome_completo VARCHAR(255);
    RAISE NOTICE 'Coluna "nome_completo" adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna "nome_completo" já existe';
  END IF;
END $$;

-- 6. Adicionar coluna 'bio' se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'bio'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN bio TEXT;
    RAISE NOTICE 'Coluna "bio" adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna "bio" já existe';
  END IF;
END $$;

-- 7. Adicionar coluna 'user_slug' se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'user_slug'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN user_slug VARCHAR(255);
    RAISE NOTICE 'Coluna "user_slug" adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna "user_slug" já existe';
  END IF;
END $$;

-- 8. Adicionar coluna 'country_code' se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'country_code'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN country_code VARCHAR(10) DEFAULT 'BR';
    RAISE NOTICE 'Coluna "country_code" adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna "country_code" já existe';
  END IF;
END $$;

-- 9. Corrigir foreign key se estiver apontando para tabela errada
-- Se a foreign key aponta para 'users' em vez de 'auth.users', precisamos ajustar
DO $$
BEGIN
  -- Verificar se existe foreign key para 'users' (tabela errada)
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'user_profiles'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'user_id'
    AND ccu.table_name = 'users'
    AND ccu.table_schema = 'public'
  ) THEN
    -- Dropar foreign key incorreta
    ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
    RAISE NOTICE 'Foreign key antiga removida';
    
    -- Criar foreign key correta para auth.users
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE 'Foreign key corrigida para auth.users';
  END IF;
END $$;

-- 10. Adicionar constraint CHECK se não existir
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

-- 11. Criar/atualizar perfil do usuário faulaandre@gmail.com
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
  v_nome TEXT;
BEGIN
  -- Buscar dados do usuário
  SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', email)
  INTO v_user_id, v_email, v_nome
  FROM auth.users
  WHERE email = 'faulaandre@gmail.com';

  IF v_user_id IS NOT NULL THEN
    -- Verificar se o registro já existe
    IF EXISTS (SELECT 1 FROM user_profiles WHERE user_id = v_user_id) THEN
      -- Atualizar registro existente
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'email'
      ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'nome_completo'
      ) THEN
        UPDATE user_profiles 
        SET 
          perfil = 'wellness',
          email = v_email,
          nome_completo = v_nome,
          updated_at = NOW()
        WHERE user_id = v_user_id;
      ELSE
        UPDATE user_profiles 
        SET 
          perfil = 'wellness',
          updated_at = NOW()
        WHERE user_id = v_user_id;
      END IF;
      RAISE NOTICE 'Perfil atualizado para user_id: %', v_user_id;
    ELSE
      -- Inserir novo registro
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'email'
      ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'nome_completo'
      ) THEN
        INSERT INTO user_profiles (user_id, perfil, email, nome_completo)
        VALUES (v_user_id, 'wellness', v_email, v_nome);
      ELSE
        INSERT INTO user_profiles (user_id, perfil)
        VALUES (v_user_id, 'wellness');
      END IF;
      RAISE NOTICE 'Perfil criado para user_id: %', v_user_id;
    END IF;
  ELSE
    RAISE NOTICE 'Usuário faulaandre@gmail.com não encontrado';
  END IF;
END $$;

-- 12. Verificar resultado final
SELECT 
  up.id,
  up.user_id,
  up.perfil,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'nome_completo'
  ) THEN up.nome_completo ELSE NULL END as nome_completo,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'email'
  ) THEN up.email ELSE NULL END as email,
  up.created_at,
  up.updated_at,
  au.email as auth_email
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'faulaandre@gmail.com';
