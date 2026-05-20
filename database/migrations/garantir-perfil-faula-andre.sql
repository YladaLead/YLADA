-- =====================================================
-- GARANTIR QUE FAULA ANDRÉ TEM PERFIL VÁLIDO
-- Script simples e direto
-- =====================================================

-- 1. Ver o user_id do Faula André no auth.users
SELECT id as user_id, email FROM auth.users WHERE email = 'faulaandre@gmail.com';

-- 2. Deletar TODOS os registros duplicados
DELETE FROM user_profiles WHERE email = 'faulaandre@gmail.com';

-- 3. Criar registro único com todos os dados corretos
-- IMPORTANTE: Substitua 'SEU_USER_ID_AQUI' pelo user_id da query acima
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'faulaandre@gmail.com' LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Inserir perfil único
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
      'wellness',
      'ANDRE FAULA',
      'faulaandre@gmail.com',
      NULL,
      'Herbalife',
      'andre',
      'BR',
      true,  -- ADMIN
      true   -- SUPPORT
    )
    ON CONFLICT (user_id) DO UPDATE SET
      perfil = 'wellness',
      nome_completo = 'ANDRE FAULA',
      email = 'faulaandre@gmail.com',
      is_admin = true,
      is_support = true,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Perfil criado/atualizado com sucesso! User ID: %', v_user_id;
  ELSE
    RAISE NOTICE '❌ Usuário não encontrado em auth.users';
  END IF;
END $$;

-- 4. Verificar resultado
SELECT 
  id,
  user_id,
  email,
  nome_completo,
  perfil,
  is_admin,
  is_support,
  user_slug,
  bio
FROM user_profiles
WHERE email = 'faulaandre@gmail.com';

-- Deve retornar apenas 1 registro com is_admin=true e is_support=true

