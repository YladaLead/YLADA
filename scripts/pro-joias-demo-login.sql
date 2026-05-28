-- -----------------------------------------------------------------------------
-- Pro Joias — conta demo (rede de distribuidoras de joias / bijuterias)
-- Senha inicial: 123456 — trocar após uso / nunca em produção pública exposta
-- Executar no Supabase → SQL Editor (role com acesso a auth).
-- Login: demo@projoias.com  |  Senha: 123456  |  Entrada: /pro-joias/entrar
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_email TEXT := 'demo@projoias.com';
  v_senha TEXT := '123456';
  v_user_id UUID;
BEGIN
  -- 1. Criar usuário no Supabase Auth (se não existir)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(trim(email)) = v_email) THEN
    v_user_id := gen_random_uuid();
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
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_senha, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Demo Pro Joias', 'name', 'Demo Pro Joias'),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
    RAISE NOTICE 'Auth criado: % (senha %)', v_email, v_senha;
  ELSE
    SELECT id INTO v_user_id FROM auth.users WHERE lower(trim(email)) = v_email;
    RAISE NOTICE 'Auth já existe: % (id: %)', v_email, v_user_id;
  END IF;

  -- 2. Criar perfil YLADA (profiles) se não existir
  INSERT INTO profiles (id, email, full_name, updated_at)
  VALUES (v_user_id, v_email, 'Demo Pro Joias', NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  -- 3. Criar tenant Pro Joias se não existir
  IF NOT EXISTS (
    SELECT 1 FROM leader_tenants
    WHERE owner_user_id = v_user_id
      AND vertical_code = 'joias'
  ) THEN
    INSERT INTO leader_tenants (
      id,
      slug,
      display_name,
      team_name,
      owner_user_id,
      contact_email,
      whatsapp,
      vertical_code,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      'joias-demo',
      'Demo Pro Joias',
      'Rede Demo Joias',
      v_user_id,
      v_email,
      NULL,
      'joias',
      NOW(),
      NOW()
    );
    RAISE NOTICE 'Tenant Pro Joias criado para %', v_email;
  ELSE
    RAISE NOTICE 'Tenant Pro Joias já existe para %', v_email;
  END IF;

END $$;
