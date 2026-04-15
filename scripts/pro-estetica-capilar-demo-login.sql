-- -----------------------------------------------------------------------------
-- Pro Estética CAPILAR — conta demo separada da corporal (outro produto / vertical)
-- Login: demo@proesteticacapilar.com / senha: 123456
-- Não misturar com: demo@proesteticacorporal.com (corporal)
-- Executar no Supabase → SQL Editor (role com acesso a auth).
-- O bootstrap de tenant capilar está em código: isProEsteticaCapilarBootstrapLeaderEmail
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_senha TEXT := '123456';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(trim(email)) = 'demo@proesteticacapilar.com') THEN
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
      'demo@proesteticacapilar.com',
      crypt(v_senha, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Demo Pro Estética Capilar', 'name', 'Demo Pro Estética Capilar'),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
    RAISE NOTICE 'Criado: demo@proesteticacapilar.com (senha 123456)';
  ELSE
    RAISE NOTICE 'Já existe: demo@proesteticacapilar.com';
  END IF;
END $$;
