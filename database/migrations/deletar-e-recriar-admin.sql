-- =====================================================
-- DELETAR E RECRIAR USUÁRIO ADMIN: faulaandre@gmail.com
-- =====================================================
-- Este script:
-- 1. Deleta o usuário existente (auth.users + user_profiles)
-- 2. Cria um novo usuário já autenticado
-- 3. Cria o perfil admin para ele
-- =====================================================

-- =====================================================
-- PASSO 1: DELETAR USUÁRIO EXISTENTE
-- =====================================================

-- 1.1. Deletar do user_profiles primeiro
DELETE FROM user_profiles 
WHERE email = 'faulaandre@gmail.com'
   OR user_id IN (
     SELECT id FROM auth.users WHERE email = 'faulaandre@gmail.com'
   );

-- 1.2. Deletar do auth.users via Supabase Dashboard:
-- 
-- IMPORTANTE: Você precisa deletar manualmente pelo Dashboard:
-- 1. Acesse: Supabase Dashboard > Authentication > Users
-- 2. Procure por: faulaandre@gmail.com
-- 3. Clique nos 3 pontinhos (...) ao lado do usuário
-- 4. Clique em "Delete User"
-- 5. Confirme a exclusão
--
-- OU use a API Admin (se tiver acesso):
-- DELETE FROM auth.users WHERE email = 'faulaandre@gmail.com';

-- =====================================================
-- PASSO 2: CRIAR NOVO USUÁRIO VIA SUPABASE DASHBOARD
-- =====================================================
-- 
-- 1. Acesse: Supabase Dashboard > Authentication > Users
-- 2. Clique em "Add User" ou "Invite User"
-- 3. Preencha:
--    - Email: faulaandre@gmail.com
--    - Password: Hbl@0842 (ou a senha que você quiser)
--    - Auto Confirm User: ✅ (marcar esta opção para já estar autenticado)
-- 4. Clique em "Create User"
--
-- =====================================================

-- =====================================================
-- PASSO 3: CRIAR PERFIL ADMIN APÓS CRIAR O USUÁRIO
-- =====================================================
-- Execute este script DEPOIS de criar o usuário no Dashboard

-- Criar perfil admin para o novo usuário
-- Usando DO $$ para verificar se já existe antes de inserir/atualizar
DO $$
DECLARE
  v_user_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  -- Buscar user_id do email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'faulaandre@gmail.com';
  
  -- Verificar se usuário existe
  IF v_user_id IS NOT NULL THEN
    -- Verificar se perfil já existe
    SELECT EXISTS(
      SELECT 1 FROM user_profiles WHERE user_id = v_user_id
    ) INTO v_profile_exists;
    
    IF v_profile_exists THEN
      -- Atualizar perfil existente
      UPDATE user_profiles
      SET 
        perfil = 'admin',
        is_admin = true,
        is_support = false,
        email = 'faulaandre@gmail.com',
        nome_completo = COALESCE(nome_completo, 'ANDRE FAULA')
      WHERE user_id = v_user_id;
    ELSE
      -- Criar novo perfil
      INSERT INTO user_profiles (
        user_id,
        email,
        perfil,
        is_admin,
        is_support,
        nome_completo
      ) VALUES (
        v_user_id,
        'faulaandre@gmail.com',
        'admin',
        true,
        false,
        'ANDRE FAULA'
      );
    END IF;
  ELSE
    RAISE NOTICE 'Usuário faulaandre@gmail.com não encontrado no auth.users. Crie o usuário primeiro no Dashboard.';
  END IF;
END $$;

-- =====================================================
-- PASSO 4: VERIFICAÇÃO FINAL
-- =====================================================

SELECT 
  up.id,
  up.user_id,
  up.email,
  up.perfil,
  up.is_admin,
  up.is_support,
  up.nome_completo,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  au.created_at as usuario_criado_em
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'faulaandre@gmail.com' 
   OR up.email = 'faulaandre@gmail.com';

