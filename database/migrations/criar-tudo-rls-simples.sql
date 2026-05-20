-- =====================================================
-- CRIAR TUDO PARA RLS - SCRIPT SIMPLES E DIRETO
-- Execute este script COMPLETO no Supabase SQL Editor
-- =====================================================

-- PASSO 1: Criar função is_admin()
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

-- PASSO 2: Remover TODAS as políticas antigas
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- PASSO 3: Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- PASSO 4: Criar política para usuários VEREM seu próprio perfil
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- PASSO 5: Criar política para usuários ATUALIZAREM seu próprio perfil
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- PASSO 6: Criar política para usuários INSERIREM seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- PASSO 7: Criar política para admins VEREM todos os perfis
CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  is_admin()
);

-- PASSO 8: Criar política para admins ATUALIZAREM todos os perfis
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

-- PASSO 9: Criar política para admins INSERIREM perfis
CREATE POLICY "Admins can insert profiles"
ON user_profiles FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  OR 
  is_admin()
);

-- =====================================================
-- VERIFICAÇÃO: Ver se tudo foi criado
-- =====================================================

-- Verificar função
SELECT 'Função is_admin() criada!' as status
FROM pg_proc
WHERE proname = 'is_admin';

-- Contar políticas (deve retornar 6)
SELECT 
  COUNT(*) as total_politicas,
  'Políticas criadas!' as status
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Listar todas as políticas
SELECT 
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

