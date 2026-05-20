-- =====================================================
-- VERIFICAR COLUNAS NECESSÁRIAS PARA PÁGINA DE CONFIGURAÇÃO NUTRI
-- =====================================================
-- Este script verifica se as colunas necessárias existem
-- e as adiciona caso não existam
-- =====================================================

-- 1. Verificar colunas existentes
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
  AND column_name IN ('nome_completo', 'email', 'whatsapp', 'bio', 'user_slug', 'country_code', 'perfil')
ORDER BY column_name;

-- 2. Adicionar colunas se não existirem (script seguro)
DO $$ 
BEGIN
  -- Adicionar 'nome_completo' se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'nome_completo'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN nome_completo VARCHAR(255);
    RAISE NOTICE '✅ Coluna "nome_completo" adicionada';
  ELSE
    RAISE NOTICE '✓ Coluna "nome_completo" já existe';
  END IF;

  -- Adicionar 'email' se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email VARCHAR(255);
    RAISE NOTICE '✅ Coluna "email" adicionada';
  ELSE
    RAISE NOTICE '✓ Coluna "email" já existe';
  END IF;

  -- Adicionar 'whatsapp' se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN whatsapp VARCHAR(20);
    RAISE NOTICE '✅ Coluna "whatsapp" adicionada';
  ELSE
    RAISE NOTICE '✓ Coluna "whatsapp" já existe';
  END IF;

  -- Adicionar 'bio' se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'bio'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN bio TEXT;
    RAISE NOTICE '✅ Coluna "bio" adicionada';
  ELSE
    RAISE NOTICE '✓ Coluna "bio" já existe';
  END IF;

  -- Adicionar 'user_slug' se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'user_slug'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN user_slug VARCHAR(255);
    RAISE NOTICE '✅ Coluna "user_slug" adicionada';
  ELSE
    RAISE NOTICE '✓ Coluna "user_slug" já existe';
  END IF;

  -- Adicionar 'country_code' se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'country_code'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN country_code VARCHAR(10) DEFAULT 'BR';
    RAISE NOTICE '✅ Coluna "country_code" adicionada';
  ELSE
    RAISE NOTICE '✓ Coluna "country_code" já existe';
  END IF;

  -- Adicionar 'perfil' se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'perfil'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN perfil VARCHAR(50);
    RAISE NOTICE '✅ Coluna "perfil" adicionada';
  ELSE
    RAISE NOTICE '✓ Coluna "perfil" já existe';
  END IF;
END $$;

-- 3. Criar índices úteis (se não existirem)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_user_slug_unique 
ON user_profiles(user_slug) 
WHERE user_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_slug 
ON user_profiles(user_slug);

-- 4. Verificar novamente após adicionar
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
  AND column_name IN ('nome_completo', 'email', 'whatsapp', 'bio', 'user_slug', 'country_code', 'perfil')
ORDER BY column_name;



