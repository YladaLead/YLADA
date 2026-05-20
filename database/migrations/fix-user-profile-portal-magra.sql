-- =====================================================
-- CORRIGIR PERFIL DO USUÁRIO portalmagra@gmail.com
-- =====================================================
-- Este script corrige o perfil do usuário para 'nutri'
-- Execute no Supabase SQL Editor
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  -- Buscar user_id pelo email (case insensitive)
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER('portalmagra@gmail.com');

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Usuário não encontrado com email: portalmagra@gmail.com';
    RAISE NOTICE 'Verificando todos os emails similares...';
    
    -- Mostrar emails similares
    SELECT email, id FROM auth.users WHERE email ILIKE '%portalmagra%' OR email ILIKE '%portal%magra%' LIMIT 10;
  ELSE
    RAISE NOTICE 'Usuário encontrado: %', v_user_id;
    
    -- Verificar se já existe perfil
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE user_id = v_user_id) INTO v_profile_exists;
    
    IF v_profile_exists THEN
      -- Atualizar perfil existente
      UPDATE user_profiles 
      SET 
        perfil = 'nutri',
        updated_at = NOW()
      WHERE user_id = v_user_id;
      
      RAISE NOTICE 'Perfil atualizado para nutri com sucesso!';
    ELSE
      -- Criar novo perfil
      INSERT INTO user_profiles (user_id, perfil, updated_at, created_at)
      VALUES (v_user_id, 'nutri', NOW(), NOW());
      
      RAISE NOTICE 'Perfil criado para nutri com sucesso!';
    END IF;
  END IF;
END $$;

-- Verificar o resultado
SELECT 
  u.email,
  up.perfil,
  up.updated_at,
  up.user_id
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE LOWER(u.email) = LOWER('portalmagra@gmail.com');

-- Verificar se há outros perfis para este email
SELECT 
  u.email,
  up.perfil,
  up.user_id
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email ILIKE '%portalmagra%' OR u.email ILIKE '%portal%magra%';

