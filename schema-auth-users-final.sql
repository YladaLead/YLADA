-- =====================================================
-- YLADA - SCHEMA DE AUTENTICAÇÃO E PERFIS DE USUÁRIO
-- SCRIPT SEGURO - Preserva dados existentes
-- =====================================================

-- =====================================================
-- 1. CRIAR TABELA SE NÃO EXISTIR
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  perfil VARCHAR(50),
  nome_completo VARCHAR(255),
  email VARCHAR(255),
  crn VARCHAR(50),
  especialidade_nutri VARCHAR(255),
  nivel_herbalife VARCHAR(50),
  cidade VARCHAR(255),
  estado VARCHAR(2),
  certificacoes TEXT,
  area_coaching VARCHAR(255),
  idioma_preferido VARCHAR(10) DEFAULT 'pt',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- 2. ADICIONAR COLUNAS QUE PODEM FALTAR
-- =====================================================

-- Função helper para adicionar coluna se não existir
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
    p_table_name TEXT,
    p_column_name TEXT,
    p_column_definition TEXT
)
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns c
        WHERE c.table_schema = 'public' 
          AND c.table_name = p_table_name
          AND c.column_name = p_column_name
    ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
            p_table_name,
            p_column_name,
            p_column_definition
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Adicionar todas as colunas necessárias
SELECT add_column_if_not_exists('user_profiles', 'perfil', 'VARCHAR(50)');
SELECT add_column_if_not_exists('user_profiles', 'nome_completo', 'VARCHAR(255)');
SELECT add_column_if_not_exists('user_profiles', 'email', 'VARCHAR(255)');
SELECT add_column_if_not_exists('user_profiles', 'crn', 'VARCHAR(50)');
SELECT add_column_if_not_exists('user_profiles', 'especialidade_nutri', 'VARCHAR(255)');
SELECT add_column_if_not_exists('user_profiles', 'nivel_herbalife', 'VARCHAR(50)');
SELECT add_column_if_not_exists('user_profiles', 'cidade', 'VARCHAR(255)');
SELECT add_column_if_not_exists('user_profiles', 'estado', 'VARCHAR(2)');
SELECT add_column_if_not_exists('user_profiles', 'certificacoes', 'TEXT');
SELECT add_column_if_not_exists('user_profiles', 'area_coaching', 'VARCHAR(255)');
SELECT add_column_if_not_exists('user_profiles', 'idioma_preferido', 'VARCHAR(10)');
SELECT add_column_if_not_exists('user_profiles', 'timezone', 'VARCHAR(50)');
SELECT add_column_if_not_exists('user_profiles', 'created_at', 'TIMESTAMP WITH TIME ZONE');
SELECT add_column_if_not_exists('user_profiles', 'updated_at', 'TIMESTAMP WITH TIME ZONE');
SELECT add_column_if_not_exists('user_profiles', 'last_login', 'TIMESTAMP WITH TIME ZONE');
SELECT add_column_if_not_exists('user_profiles', 'is_active', 'BOOLEAN');

-- Adicionar defaults após criar as colunas
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'user_profiles' 
          AND column_name = 'idioma_preferido'
          AND column_default IS NULL
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN idioma_preferido SET DEFAULT 'pt';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'user_profiles' 
          AND column_name = 'timezone'
          AND column_default IS NULL
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN timezone SET DEFAULT 'America/Sao_Paulo';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'user_profiles' 
          AND column_name = 'created_at'
          AND column_default IS NULL
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN created_at SET DEFAULT NOW();
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'user_profiles' 
          AND column_name = 'updated_at'
          AND column_default IS NULL
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN updated_at SET DEFAULT NOW();
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'user_profiles' 
          AND column_name = 'is_active'
          AND column_default IS NULL
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN is_active SET DEFAULT true;
    END IF;
END $$;

-- Preencher email dos registros existentes
UPDATE user_profiles up
SET email = au.email
FROM auth.users au
WHERE up.user_id = au.id 
  AND (up.email IS NULL OR up.email = '');

-- Preencher perfil padrão para registros sem perfil
UPDATE user_profiles 
SET perfil = 'nutri' 
WHERE perfil IS NULL OR perfil = '';

-- =====================================================
-- 3. ADICIONAR CONSTRAINTS
-- =====================================================

ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_perfil_check;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_perfil_check 
CHECK (perfil IN ('nutri', 'wellness', 'coach', 'nutra'));

-- Tornar perfil NOT NULL apenas se não houver registros NULL
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE perfil IS NULL) THEN
        ALTER TABLE user_profiles ALTER COLUMN perfil SET NOT NULL;
    END IF;
END $$;

-- =====================================================
-- 4. CRIAR ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_perfil ON user_profiles(perfil);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    email,
    nome_completo,
    perfil
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'perfil', 'nutri')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    nome_completo = COALESCE(EXCLUDED.nome_completo, user_profiles.nome_completo),
    perfil = COALESCE(EXCLUDED.perfil, user_profiles.perfil);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 7. FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 8. VIEW PARA DADOS COMPLETOS DO USUÁRIO
-- =====================================================

DROP VIEW IF EXISTS user_complete;

CREATE VIEW user_complete AS
SELECT 
  u.id,
  u.email,
  u.created_at as user_created_at,
  p.perfil,
  p.nome_completo,
  p.crn,
  p.especialidade_nutri,
  p.nivel_herbalife,
  p.cidade,
  p.estado,
  p.certificacoes,
  p.area_coaching,
  p.idioma_preferido,
  p.timezone,
  p.is_active,
  p.last_login
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.user_id;

ALTER VIEW user_complete SET (security_invoker = true);

-- =====================================================
-- 9. LIMPAR FUNÇÃO TEMPORÁRIA
-- =====================================================

DROP FUNCTION IF EXISTS add_column_if_not_exists(TEXT, TEXT, TEXT);

