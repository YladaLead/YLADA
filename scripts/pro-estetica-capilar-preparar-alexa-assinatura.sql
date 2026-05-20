-- Preparar conta Alexia Lima (Pro Estética capilar) — studioalexialima@gmail.com
-- Executar no Supabase SQL Editor (service role / SQL admin).
-- Depois enviar: https://www.ylada.com/pro-estetica-capilar/assinatura

DO $$
DECLARE
  v_email CONSTANT TEXT := 'studioalexialima@gmail.com';
  v_user_id UUID;
  v_tenant_id UUID;
  v_client_id UUID;
  v_until DATE := (CURRENT_DATE + INTERVAL '3 days')::DATE;
BEGIN
  SELECT up.user_id INTO v_user_id
  FROM user_profiles up
  WHERE lower(trim(up.email)) = lower(trim(v_email))
  LIMIT 1;

  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE lower(trim(email)) = lower(trim(v_email)) LIMIT 1;
  END IF;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilizador não encontrado para % — crie a conta em /pro-estetica-capilar/entrar primeiro.', v_email;
  END IF;

  SELECT id INTO v_tenant_id
  FROM leader_tenants
  WHERE owner_user_id = v_user_id
  LIMIT 1;

  IF v_tenant_id IS NULL THEN
    INSERT INTO leader_tenants (
      owner_user_id, slug, display_name, vertical_code, contact_email, created_at, updated_at
    ) VALUES (
      v_user_id,
      'pecap-' || replace(v_user_id::text, '-', '')::text,
      'Alexia Lima',
      'estetica-capilar',
      lower(trim(v_email)),
      NOW(),
      NOW()
    )
    RETURNING id INTO v_tenant_id;
    RAISE NOTICE 'Tenant capilar criado: %', v_tenant_id;
  ELSE
    UPDATE leader_tenants
    SET vertical_code = 'estetica-capilar',
        contact_email = COALESCE(NULLIF(trim(contact_email), ''), lower(trim(v_email))),
        updated_at = NOW()
    WHERE id = v_tenant_id
      AND (vertical_code IS DISTINCT FROM 'estetica-capilar' OR contact_email IS NULL);
    RAISE NOTICE 'Tenant existente: %', v_tenant_id;
  END IF;

  SELECT id INTO v_client_id
  FROM ylada_estetica_consult_clients
  WHERE leader_tenant_id = v_tenant_id
     OR lower(trim(contact_email)) = lower(trim(v_email))
  ORDER BY updated_at DESC NULLS LAST
  LIMIT 1;

  IF v_client_id IS NULL THEN
    INSERT INTO ylada_estetica_consult_clients (
      business_name, segment, contact_email, leader_tenant_id,
      access_valid_until, admin_notes, created_at, updated_at
    ) VALUES (
      'Studio Alexia Lima — Estética capilar',
      'capilar',
      lower(trim(v_email)),
      v_tenant_id,
      v_until,
      'Preparado para link /pro-estetica-capilar/assinatura (cortesia até pagamento MP).',
      NOW(),
      NOW()
    )
    RETURNING id INTO v_client_id;
  ELSE
    UPDATE ylada_estetica_consult_clients
    SET leader_tenant_id = v_tenant_id,
        segment = 'capilar',
        contact_email = lower(trim(v_email)),
        access_valid_until = GREATEST(access_valid_until, v_until),
        updated_at = NOW()
    WHERE id = v_client_id;
  END IF;

  RAISE NOTICE 'OK user=% tenant=% client=% access_until=%',
    v_user_id, v_tenant_id, v_client_id, v_until;
  RAISE NOTICE 'Link: https://www.ylada.com/pro-estetica-capilar/assinatura';
END $$;
