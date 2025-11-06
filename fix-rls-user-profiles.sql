-- =====================================================
-- VERIFICAR E CORRIGIR POLÍTICAS RLS PARA user_profiles
-- Script para garantir que usuários possam ver seus próprios perfis
-- =====================================================

-- =====================================================
-- 1. VERIFICAR POLÍTICAS ATUAIS
-- =====================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- =====================================================
-- 2. VERIFICAR SE RLS ESTÁ HABILITADO
-- =====================================================

SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

-- =====================================================
-- 3. GARANTIR QUE RLS ESTÁ HABILITADO
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. REMOVER POLÍTICAS ANTIGAS (SE NECESSÁRIO)
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- =====================================================
-- 5. CRIAR POLÍTICAS CORRETAS PARA USUÁRIOS NORMAIS
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

-- =====================================================
-- 6. CRIAR POLÍTICAS PARA ADMINS
-- =====================================================

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
-- 7. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar todas as políticas criadas
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

-- =====================================================
-- 8. TESTE MANUAL (Execute como usuário autenticado)
-- =====================================================

-- Testar se consegue ver seu próprio perfil
-- SELECT * FROM user_profiles WHERE user_id = auth.uid();

-- Testar se consegue ver todos os perfis (se admin)
-- SELECT * FROM user_profiles;

