-- =============================================================================
-- Pro Líderes + Pro Estética: contas internas (sem cadastro público neste fluxo)
-- Senha inicial: 123456 (alterar após a reunião / em produção usar senha forte)
-- Execute no Supabase → SQL Editor (como postgres / role com acesso a auth).
-- =============================================================================

-- Extensão para crypt() (geralmente já ativa no Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1) Criar utilizadores em auth.users (se ainda não existirem)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_senha TEXT := '123456';
  v_id UUID;
BEGIN
  -- andre@prolider.com
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(trim(email)) = 'andre@prolider.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'andre@prolider.com',
      crypt(v_senha, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'André', 'name', 'André'),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
    RAISE NOTICE 'Criado: andre@prolider.com';
  ELSE
    RAISE NOTICE 'Já existe: andre@prolider.com';
  END IF;

  -- andre@proestetica.com
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(trim(email)) = 'andre@proestetica.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'andre@proestetica.com',
      crypt(v_senha, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'André', 'name', 'André'),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
    RAISE NOTICE 'Criado: andre@proestetica.com';
  ELSE
    RAISE NOTICE 'Já existe: andre@proestetica.com';
  END IF;
END $$;

-- Se os utilizadores já tinham sido criados sem senha ou com outra, descomente:
-- UPDATE auth.users
-- SET encrypted_password = crypt('123456', gen_salt('bf')), updated_at = NOW()
-- WHERE lower(trim(email)) IN ('andre@prolider.com', 'andre@proestetica.com');

-- -----------------------------------------------------------------------------
-- 2) Tenants (Pro Líderes + Pro Estética) — trigger cria leader_tenant_members
-- -----------------------------------------------------------------------------

INSERT INTO leader_tenants (owner_user_id, slug, display_name, contact_email, vertical_code)
SELECT
  u.id,
  'pl-' || substr(replace(u.id::text, '-', ''), 1, 12),
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.email,
  'h-lider'
FROM auth.users u
WHERE lower(trim(u.email)) = 'andre@prolider.com'
  AND NOT EXISTS (SELECT 1 FROM leader_tenants lt WHERE lt.owner_user_id = u.id);

INSERT INTO leader_tenants (owner_user_id, slug, display_name, contact_email, vertical_code)
SELECT
  u.id,
  'pec-' || substr(replace(u.id::text, '-', ''), 1, 12),
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.email,
  'estetica-corporal'
FROM auth.users u
WHERE lower(trim(u.email)) = 'andre@proestetica.com'
  AND NOT EXISTS (SELECT 1 FROM leader_tenants lt WHERE lt.owner_user_id = u.id);

-- -----------------------------------------------------------------------------
-- 2.1) Perfil e contacto WhatsApp de teste (André Pro Líderes)
-- -----------------------------------------------------------------------------
-- Número informado para testes neste ambiente:
-- 19981868000  -> formatado com DDI BR (55) = 5519981868000

UPDATE user_profiles up
SET
  whatsapp = '19981868000',
  country_code = 'BR',
  updated_at = NOW()
FROM auth.users u
WHERE up.user_id = u.id
  AND lower(trim(u.email)) = 'andre@prolider.com';

UPDATE leader_tenants lt
SET
  whatsapp = '5519981868000',
  contact_email = coalesce(lt.contact_email, 'andre@prolider.com'),
  updated_at = NOW()
FROM auth.users u
WHERE lt.owner_user_id = u.id
  AND lower(trim(u.email)) = 'andre@prolider.com'
  AND lt.vertical_code = 'h-lider';

-- -----------------------------------------------------------------------------
-- 3) Verificação
-- -----------------------------------------------------------------------------
SELECT u.email, u.email_confirmed_at IS NOT NULL AS email_confirmado
FROM auth.users u
WHERE lower(u.email) IN ('andre@prolider.com', 'andre@proestetica.com');

SELECT lt.id, u.email, lt.slug, lt.vertical_code, lt.display_name
FROM leader_tenants lt
JOIN auth.users u ON u.id = lt.owner_user_id
WHERE lower(u.email) IN ('andre@prolider.com', 'andre@proestetica.com');

SELECT u.email, up.nome_completo, up.whatsapp, up.country_code
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE lower(u.email) = 'andre@prolider.com';

-- Login na app: e-mail acima + senha 123456 (trocar em produção).
