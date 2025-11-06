-- =====================================================
-- CONFIGURAR APENAS FAULA ANDRÉ COMO ADMINISTRADOR
-- Desabilitar todos os outros usuários
-- =====================================================

-- =====================================================
-- 1. IDENTIFICAR O USER_ID DO FAULA ANDRÉ
-- =====================================================

-- Ver todos os registros do Faula André
SELECT 
  id,
  user_id,
  email,
  nome_completo,
  perfil,
  is_admin,
  is_support
FROM user_profiles
WHERE email = 'faulaandre@gmail.com'
ORDER BY updated_at DESC;

-- Ver o user_id no auth.users
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- 2. LIMPAR DUPLICATAS DO FAULA ANDRÉ E CRIAR REGISTRO ÚNICO
-- =====================================================

-- Deletar todos os registros duplicados do Faula André
DELETE FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

-- Criar registro único consolidado do Faula André como ADMIN
-- IMPORTANTE: Substitua 'SEU_USER_ID_AQUI' pelo user_id real do auth.users
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar o user_id do Faula André
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'faulaandre@gmail.com'
  LIMIT 1;

  -- Se encontrou o user_id, criar/atualizar o perfil
  IF v_user_id IS NOT NULL THEN
    -- Inserir perfil único com is_admin = true e is_support = true
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
      'wellness', -- Perfil padrão, mas admin pode acessar tudo
      'ANDRE FAULA',
      'faulaandre@gmail.com',
      NULL, -- Preencher depois se necessário
      'Herbalife', -- Bio se tiver
      'andre', -- Slug se tiver
      'BR',
      true, -- ADMIN
      true  -- SUPPORT (pode acessar todas as áreas)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      perfil = 'wellness',
      nome_completo = 'ANDRE FAULA',
      email = 'faulaandre@gmail.com',
      is_admin = true,
      is_support = true,
      updated_at = NOW();
    
    RAISE NOTICE 'Perfil do Faula André criado/atualizado com user_id: %', v_user_id;
  ELSE
    RAISE NOTICE 'Usuário faulaandre@gmail.com não encontrado em auth.users';
  END IF;
END $$;

-- =====================================================
-- 3. DESABILITAR TODOS OS OUTROS USUÁRIOS
-- =====================================================

-- Atualizar is_admin e is_support para false em todos os outros perfis
UPDATE user_profiles
SET 
  is_admin = false,
  is_support = false,
  updated_at = NOW()
WHERE email != 'faulaandre@gmail.com';

-- Ver quantos usuários foram desabilitados
SELECT COUNT(*) as usuarios_desabilitados
FROM user_profiles
WHERE email != 'faulaandre@gmail.com';

-- =====================================================
-- 4. VERIFICAR CONFIGURAÇÃO FINAL
-- =====================================================

-- Ver apenas o perfil do Faula André
SELECT 
  id,
  user_id,
  email,
  nome_completo,
  perfil,
  is_admin,
  is_support,
  whatsapp,
  bio,
  user_slug,
  created_at,
  updated_at
FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

-- Verificar que apenas Faula André é admin
SELECT 
  email,
  nome_completo,
  perfil,
  is_admin,
  is_support
FROM user_profiles
WHERE is_admin = true OR is_support = true;

-- Contar total de usuários
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN email = 'faulaandre@gmail.com' THEN 1 END) as faula_andre,
  COUNT(CASE WHEN email != 'faulaandre@gmail.com' THEN 1 END) as outros_usuarios
FROM user_profiles;

-- =====================================================
-- 5. GARANTIR CONSTRAINT UNIQUE EM user_id
-- =====================================================

-- Verificar se a constraint já existe
SELECT 
  conname as constraint_name,
  contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
AND conname LIKE '%user_id%';

-- Se não existir, criar constraint UNIQUE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'user_profiles_user_id_key'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
    RAISE NOTICE 'Constraint UNIQUE criada em user_id';
  ELSE
    RAISE NOTICE 'Constraint UNIQUE já existe em user_id';
  END IF;
END $$;

-- =====================================================
-- 6. LIMPAR POLÍTICAS RLS DUPLICADAS (OPCIONAL)
-- =====================================================

-- Remover políticas duplicadas
DROP POLICY IF EXISTS "Users can view own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profiles" ON user_profiles;

-- Garantir que as políticas corretas existem
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- Criar políticas corretas
CREATE POLICY IF NOT EXISTS "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all profiles"
ON user_profiles FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.user_id = auth.uid() 
    AND up.is_admin = true
  )
);

CREATE POLICY IF NOT EXISTS "Admins can update all profiles"
ON user_profiles FOR UPDATE
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.user_id = auth.uid() 
    AND up.is_admin = true
  )
)
WITH CHECK (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.user_id = auth.uid() 
    AND up.is_admin = true
  )
);

CREATE POLICY IF NOT EXISTS "Admins can insert profiles"
ON user_profiles FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.user_id = auth.uid() 
    AND up.is_admin = true
  )
);

-- =====================================================
-- 7. VERIFICAÇÃO FINAL COMPLETA
-- =====================================================

-- Resumo final
SELECT 
  'Configuração Final' as status,
  (SELECT COUNT(*) FROM user_profiles WHERE email = 'faulaandre@gmail.com') as registros_faula_andre,
  (SELECT COUNT(*) FROM user_profiles WHERE is_admin = true) as total_admins,
  (SELECT COUNT(*) FROM user_profiles WHERE is_support = true) as total_support,
  (SELECT COUNT(*) FROM user_profiles) as total_usuarios;

-- Ver perfil do Faula André
SELECT 
  'Perfil Faula André' as info,
  user_id,
  email,
  nome_completo,
  perfil,
  is_admin,
  is_support,
  user_slug
FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

