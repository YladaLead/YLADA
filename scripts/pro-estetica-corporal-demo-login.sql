-- -----------------------------------------------------------------------------
-- Pro Estética CORPORAL — conta demo (separada do capilar)
-- Senha inicial: 123456 — trocar após uso / nunca em produção pública exposta
-- Executar no Supabase → SQL Editor (role com acesso a auth).
-- Este ficheiro adiciona a conta demo oficial do Pro Estética corporal: demo@proesteticacorporal.com
-- Capilar (outro e-mail): scripts/pro-estetica-capilar-demo-login.sql
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_senha TEXT := '123456';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(trim(email)) = 'demo@proesteticacorporal.com') THEN
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
      'demo@proesteticacorporal.com',
      crypt(v_senha, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Demo Pro Estética', 'name', 'Demo Pro Estética'),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
    RAISE NOTICE 'Criado: demo@proesteticacorporal.com (senha 123456)';
  ELSE
    RAISE NOTICE 'Já existe: demo@proesteticacorporal.com';
  END IF;
END $$;
