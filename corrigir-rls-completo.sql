-- =====================================================
-- CORRIGIR RLS PARA user_profiles - SCRIPT COMPLETO
-- Execute este script COMPLETO no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. GARANTIR QUE A FUNÇÃO is_admin() EXISTE
-- =====================================================

-- A função is_admin() já deve existir, mas vamos garantir que está correta
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND is_admin = true
  );
END;
$$;

-- =====================================================
-- 2. REMOVER TODAS AS POLÍTICAS ANTIGAS
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
-- 3. GARANTIR QUE RLS ESTÁ HABILITADO
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CRIAR POLÍTICAS CORRETAS (SEM RECURSÃO)
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

-- Política: Admin pode VER todos os perfis (usa função helper para evitar recursão)
CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  is_admin()
);

-- Política: Admin pode ATUALIZAR todos os perfis
CREATE POLICY "Admins can update all profiles"
ON user_profiles FOR UPDATE
USING (
  auth.uid() = user_id 
  OR 
  is_admin()
)
WITH CHECK (
  auth.uid() = user_id 
  OR 
  is_admin()
);

-- Política: Admin pode INSERIR perfis
CREATE POLICY "Admins can insert profiles"
ON user_profiles FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  OR 
  is_admin()
);

-- =====================================================
-- 5. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se a função is_admin() existe
SELECT 
  proname as function_name,
  'Função existe!' as status
FROM pg_proc
WHERE proname = 'is_admin'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Verificar políticas criadas
SELECT 
  policyname,
  cmd,
  'Política ativa' as status
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Verificar se RLS está habilitado
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  'RLS está habilitado!' as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

