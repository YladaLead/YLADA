-- =====================================================
-- VERIFICAR E CORRIGIR RLS PARA user_profiles
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. VERIFICAR SE A FUNÇÃO is_user_admin() EXISTE
-- =====================================================

SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc
WHERE proname = 'is_user_admin'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- =====================================================
-- 2. VERIFICAR POLÍTICAS ATUAIS
-- =====================================================

SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN substring(qual, 1, 200)
    ELSE 'Sem USING'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN substring(with_check, 1, 200)
    ELSE 'Sem WITH CHECK'
  END as with_check_clause
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- =====================================================
-- 3. CRIAR/ATUALIZAR FUNÇÃO is_user_admin() SE NÃO EXISTIR
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  -- Buscar is_admin diretamente sem usar RLS (SECURITY DEFINER bypassa RLS)
  SELECT COALESCE(is_admin, false) INTO v_is_admin
  FROM public.user_profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(v_is_admin, false);
END;
$$;

-- =====================================================
-- 4. REMOVER POLÍTICAS PROBLEMÁTICAS (QUE CAUSAM RECURSÃO)
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
-- 5. CRIAR POLÍTICAS CORRETAS (SEM RECURSÃO)
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
  public.is_user_admin()
);

-- Política: Admin pode ATUALIZAR todos os perfis
CREATE POLICY "Admins can update all profiles"
ON user_profiles FOR UPDATE
USING (
  auth.uid() = user_id 
  OR 
  public.is_user_admin()
)
WITH CHECK (
  auth.uid() = user_id 
  OR 
  public.is_user_admin()
);

-- Política: Admin pode INSERIR perfis
CREATE POLICY "Admins can insert profiles"
ON user_profiles FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  OR 
  public.is_user_admin()
);

-- =====================================================
-- 6. GARANTIR QUE RLS ESTÁ HABILITADO
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar políticas criadas
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN substring(qual, 1, 150)
    ELSE 'Sem USING'
  END as using_clause
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Testar função helper (deve retornar true/false)
SELECT 
  auth.uid() as current_user_id,
  public.is_user_admin() as is_admin;

-- Verificar se RLS está habilitado
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

