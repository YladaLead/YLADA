-- =====================================================
-- DIAGNÓSTICO E CORREÇÃO RLS - SCRIPT COMPLETO
-- Execute este script COMPLETO no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PARTE 1: DIAGNÓSTICO (ver o que existe)
-- =====================================================

-- Verificar se função is_admin() existe
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'is_admin' 
      AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN 'Função is_admin() EXISTE'
    ELSE 'Função is_admin() NÃO EXISTE'
  END as status_funcao;

-- Verificar quantas políticas existem
SELECT 
  COUNT(*) as total_politicas,
  CASE 
    WHEN COUNT(*) = 0 THEN 'NENHUMA política encontrada'
    WHEN COUNT(*) < 6 THEN CONCAT('Apenas ', COUNT(*), ' políticas (esperado: 6)')
    ELSE 'Todas as políticas existem'
  END as status_politicas
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Listar políticas existentes
SELECT 
  policyname,
  cmd,
  'Política existente' as status
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- =====================================================
-- PARTE 2: CORREÇÃO (criar o que falta)
-- =====================================================

-- Criar função is_admin() (sempre, para garantir que está correta)
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

-- Remover TODAS as políticas antigas (para recriar do zero)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- Garantir que RLS está habilitado
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas para usuários
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

-- Criar políticas para admins
CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  is_admin()
);

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

CREATE POLICY "Admins can insert profiles"
ON user_profiles FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  OR 
  is_admin()
);

-- =====================================================
-- PARTE 3: VERIFICAÇÃO FINAL
-- =====================================================

-- Confirmar que função foi criada
SELECT 
  '✅ Função is_admin() criada com sucesso!' as resultado
FROM pg_proc
WHERE proname = 'is_admin'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Confirmar quantas políticas foram criadas
SELECT 
  COUNT(*) as total_politicas_criadas,
  CASE 
    WHEN COUNT(*) = 6 THEN '✅ Todas as 6 políticas foram criadas!'
    ELSE CONCAT('⚠️ Apenas ', COUNT(*), ' políticas foram criadas (esperado: 6)')
  END as resultado
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Listar todas as políticas criadas
SELECT 
  ROW_NUMBER() OVER (ORDER BY cmd, policyname) as num,
  policyname,
  cmd,
  '✅ Criada' as status
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Verificar RLS
SELECT 
  '✅ RLS está habilitado!' as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'user_profiles'
  AND rowsecurity = true;

