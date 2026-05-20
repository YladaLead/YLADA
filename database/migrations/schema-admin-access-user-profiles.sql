-- =====================================================
-- PERMITIR ACESSO ADMIN À TABELA user_profiles
-- Script para dar acesso completo aos admins verem todos os perfis
-- =====================================================

-- =====================================================
-- 1. VERIFICAR SE COLUNA is_admin EXISTE
-- =====================================================

-- Adicionar coluna is_admin se não existir
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Adicionar coluna is_support se não existir
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_support BOOLEAN DEFAULT false;

-- =====================================================
-- 2. CRIAR POLÍTICAS RLS PARA ADMIN
-- =====================================================

-- Dropar políticas antigas de admin se existirem
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- Política: Admin pode VER todos os perfis
CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
USING (
  -- Usuário pode ver seu próprio perfil OU
  auth.uid() = user_id 
  OR 
  -- É admin (verifica na tabela user_profiles)
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
  -- Usuário pode atualizar seu próprio perfil OU
  auth.uid() = user_id 
  OR 
  -- É admin
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.user_id = auth.uid() 
    AND up.is_admin = true
  )
)
WITH CHECK (
  -- Usuário pode atualizar seu próprio perfil OU
  auth.uid() = user_id 
  OR 
  -- É admin
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
  -- Usuário pode inserir seu próprio perfil OU
  auth.uid() = user_id 
  OR 
  -- É admin
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.user_id = auth.uid() 
    AND up.is_admin = true
  )
);

-- =====================================================
-- 3. VERIFICAÇÃO E QUERIES ÚTEIS
-- =====================================================

-- Verificar todas as políticas ativas
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

-- Query útil: Ver todos os perfis (como admin)
-- SELECT * FROM user_profiles ORDER BY created_at DESC;

-- Query útil: Ver perfis por área
-- SELECT perfil, COUNT(*) as total FROM user_profiles GROUP BY perfil;

-- Query útil: Ver perfis Wellness com informações completas
-- SELECT 
--   id,
--   user_id,
--   perfil,
--   nome_completo,
--   email,
--   whatsapp,
--   bio,
--   user_slug,
--   country_code,
--   created_at,
--   updated_at
-- FROM user_profiles
-- WHERE perfil = 'wellness'
-- ORDER BY created_at DESC;

