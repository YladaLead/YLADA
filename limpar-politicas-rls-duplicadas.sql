-- =====================================================
-- LIMPAR POLÍTICAS RLS DUPLICADAS E MANTER APENAS AS CORRETAS
-- =====================================================

-- =====================================================
-- 1. REMOVER TODAS AS POLÍTICAS EXISTENTES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- =====================================================
-- 2. CRIAR APENAS AS POLÍTICAS CORRETAS (SEM DUPLICATAS)
-- =====================================================

-- Política: Usuário pode VER apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuário pode ATUALIZAR apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Usuário pode INSERIR apenas seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Admin pode VER todos os perfis
CREATE POLICY "Admins can view all profiles"
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

-- Política: Admin pode ATUALIZAR todos os perfis
CREATE POLICY "Admins can update all profiles"
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

-- Política: Admin pode INSERIR perfis
CREATE POLICY "Admins can insert profiles"
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
-- 3. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar políticas criadas (deve ter apenas 6 políticas)
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual
    ELSE 'Sem USING'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
    ELSE 'Sem WITH CHECK'
  END as with_check_clause
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Contar políticas (deve retornar 6)
SELECT COUNT(*) as total_policies
FROM pg_policies
WHERE tablename = 'user_profiles';

-- =====================================================
-- 4. GARANTIR QUE RLS ESTÁ HABILITADO
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Verificar se RLS está habilitado
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

