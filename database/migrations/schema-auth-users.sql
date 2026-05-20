-- =====================================================
-- YLADA - SCHEMA DE AUTENTICAÇÃO E PERFIS DE USUÁRIO
-- Integração com Supabase Auth
-- =====================================================

-- =====================================================
-- 1. CRIAR TABELA DE PERFIS DE USUÁRIO
-- =====================================================

-- Criar tabela (irá falhar silenciosamente se já existir)
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

-- Adicionar coluna 'perfil' se não existir
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS perfil VARCHAR(50);

-- Atualizar valores NULL para 'nutri' (padrão)
UPDATE user_profiles SET perfil = 'nutri' WHERE perfil IS NULL;

-- Remover constraint antiga se existir
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_perfil_check;

-- Adicionar constraint CHECK
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_perfil_check 
CHECK (perfil IN ('nutri', 'wellness', 'coach', 'nutra'));

-- Tornar NOT NULL (já garantimos que não há NULL acima)
ALTER TABLE user_profiles ALTER COLUMN perfil SET NOT NULL;

-- =====================================================
-- 2. ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_perfil ON user_profiles(perfil);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Dropar políticas existentes se houver conflito
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Política: Usuário pode ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuário pode atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Usuário pode inserir apenas seu próprio perfil (na criação)
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 4. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- (Trigger quando novo usuário se registra)
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
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 5. FUNÇÃO PARA ATUALIZAR updated_at
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

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 6. VIEW PARA DADOS COMPLETOS DO USUÁRIO
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

-- Habilitar RLS na view
ALTER VIEW user_complete SET (security_invoker = true);
