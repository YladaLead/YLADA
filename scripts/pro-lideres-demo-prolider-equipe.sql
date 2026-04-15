-- =============================================================================
-- Pro Líderes — conta demo com equipe e métricas (Análise da equipe / rastreio)
--
-- Login: demo@prolider.com  ·  senha: 123456 (trocar em produção)
-- Membros: pl-equipe-demo-01@ylada.demo … pl-equipe-demo-36@ylada.demo (só dados;
--          não precisam de login para a demo do líder.)
--
-- O que faz:
--   1) Cria o utilizador demo (auth.users) se não existir
--   2) Tenant Pro Líderes (vertical h-lider) + assinatura pro_lideres_team ativa
--   3) Perfil user_profiles do líder
--   4) 36 membros sintéticos (auth + perfil + leader_tenant_members)
--   5) Um link YLADA de catálogo (quiz/diagnóstico) slug fixo + tokens pl_m por pessoa
--   6) Eventos ylada_link_events (views + cta_click WhatsApp) atribuídos por membro
--
-- Idempotência: pode voltar a executar — apaga tokens/eventos deste link-demo e
--               recria tokens + telemetria (mantém contas dos membros).
--
-- Pré-requisitos: migrations Pro Líderes (301–306, 317), motor YLADA (207, 287),
--                 extensão pgcrypto.
-- Executar no Supabase → SQL Editor (role postgres / service).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_senha TEXT := '123456';
  v_leader_id UUID;
  v_tenant_id UUID;
  v_tpl_id UUID;
  v_link_id UUID;
  v_slug TEXT;
  v_i INT;
  v_email TEXT;
  v_member_id UUID;
  v_token TEXT;
  v_views INT;
  v_wa INT;
  v_j INT;
  v_names TEXT[] := ARRAY[
    'Ana Ferreira', 'Bruno Costa', 'Carla Mendes', 'Daniel Rocha', 'Eduarda Lima',
    'Felipe Araújo', 'Gabriela Dias', 'Henrique Melo', 'Inês Cardoso', 'João Teixeira',
    'Kelly Nunes', 'Lucas Freitas', 'Mariana Ribeiro', 'Nicolas Pinto', 'Olívia Ramos',
    'Paulo Duarte', 'Queila Martins', 'Rafael Gomes', 'Sara Lopes', 'Tiago Correia',
    'Úrsula Monteiro', 'Vasco Henriques', 'Wanda Silveira', 'Xavier Antunes', 'Yara Figueiredo',
    'Zeca Barros', 'Alice Neves', 'Bernardo Campos', 'Catarina Sequeira', 'David Moura',
    'Elisa Pacheco', 'Fábio Reis', 'Gisela Tavares', 'Hugo Bastos', 'Iris Fonseca', 'Jaime Cruz'
  ];
BEGIN
  -- Líder: auth.users
  SELECT id INTO v_leader_id FROM auth.users WHERE lower(trim(email)) = 'demo@prolider.com' LIMIT 1;

  IF v_leader_id IS NULL THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'demo@prolider.com',
      crypt(v_senha, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Demo Pro Líderes', 'name', 'Demo Pro Líderes'),
      NOW(), NOW(), '', '', '', ''
    )
    RETURNING id INTO v_leader_id;
    RAISE NOTICE 'Criado auth user: demo@prolider.com';
  ELSE
    UPDATE auth.users
    SET
      encrypted_password = crypt(v_senha, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, NOW()),
      updated_at = NOW()
    WHERE id = v_leader_id;
    RAISE NOTICE 'Atualizada senha / confirmação: demo@prolider.com';
  END IF;

  -- Tenant (um por dono)
  INSERT INTO leader_tenants (owner_user_id, slug, display_name, team_name, contact_email, vertical_code)
  SELECT
    v_leader_id,
    'pl-' || substr(replace(v_leader_id::text, '-', ''), 1, 12),
    'Demo Pro Líderes',
    'Equipe demonstração YLADA',
    'demo@prolider.com',
    'h-lider'
  WHERE NOT EXISTS (SELECT 1 FROM leader_tenants WHERE owner_user_id = v_leader_id);

  SELECT id INTO v_tenant_id FROM leader_tenants WHERE owner_user_id = v_leader_id LIMIT 1;
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Tenant não criado para demo@prolider.com';
  END IF;

  v_slug := 'pl-dpl-' || substr(replace(v_leader_id::text, '-', ''), 1, 12);

  UPDATE leader_tenants
  SET
    display_name = 'Demo Pro Líderes',
    team_name = 'Equipe demonstração YLADA',
    contact_email = 'demo@prolider.com',
    vertical_code = 'h-lider',
    updated_at = NOW()
  WHERE id = v_tenant_id;

  -- Assinatura Pro Líderes equipe (API requireProLideresPaidContext)
  IF NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = v_leader_id AND area = 'pro_lideres_team') THEN
    INSERT INTO subscriptions (
      user_id, area, status, plan_type, features,
      stripe_account, stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency, current_period_start, current_period_end, created_at, updated_at
    )
    VALUES (
      v_leader_id,
      'pro_lideres_team',
      'active',
      'monthly',
      '[]'::jsonb,
      'br',
      'demo_pl_' || v_leader_id::text || '_' || floor(extract(epoch from now()))::text,
      'demo_cus_' || v_leader_id::text,
      'demo_price_pl_team',
      0,
      'brl',
      date_trunc('day', now()),
      now() + interval '5 years',
      now(),
      now()
    );
    RAISE NOTICE 'Assinatura pro_lideres_team criada.';
  ELSE
    UPDATE subscriptions
    SET
      status = 'active',
      plan_type = 'monthly',
      current_period_start = date_trunc('day', now()),
      current_period_end = now() + interval '5 years',
      updated_at = now()
    WHERE user_id = v_leader_id AND area = 'pro_lideres_team';
    RAISE NOTICE 'Assinatura pro_lideres_team atualizada.';
  END IF;

  -- Perfil líder
  IF EXISTS (SELECT 1 FROM user_profiles WHERE user_id = v_leader_id) THEN
    UPDATE user_profiles
    SET email = 'demo@prolider.com', nome_completo = 'Demo Pro Líderes', updated_at = now()
    WHERE user_id = v_leader_id;
  ELSE
    INSERT INTO user_profiles (user_id, email, nome_completo, perfil, updated_at)
    VALUES (v_leader_id, 'demo@prolider.com', 'Demo Pro Líderes', 'seller', now());
  END IF;

  -- Membros 01..36
  FOR v_i IN 1..36 LOOP
    v_email := format('pl-equipe-demo-%s@ylada.demo', lpad(v_i::text, 2, '0'));
    SELECT id INTO v_member_id FROM auth.users WHERE lower(trim(email)) = lower(trim(v_email)) LIMIT 1;

    IF v_member_id IS NULL THEN
      INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
      )
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        v_email,
        crypt(v_senha, gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name', v_names[v_i], 'name', split_part(v_names[v_i], ' ', 1)),
        NOW(), NOW(), '', '', '', ''
      )
      RETURNING id INTO v_member_id;
    END IF;

    IF EXISTS (SELECT 1 FROM user_profiles WHERE user_id = v_member_id) THEN
      UPDATE user_profiles SET email = v_email, nome_completo = v_names[v_i], updated_at = now()
      WHERE user_id = v_member_id;
    ELSE
      INSERT INTO user_profiles (user_id, email, nome_completo, perfil, updated_at)
      VALUES (v_member_id, v_email, v_names[v_i], 'seller', now());
    END IF;

    INSERT INTO leader_tenant_members (leader_tenant_id, user_id, role)
    VALUES (v_tenant_id, v_member_id, 'member'::leader_tenant_member_role)
    ON CONFLICT (leader_tenant_id, user_id) DO NOTHING;
  END LOOP;

  -- Template YLADA (catálogo Pro Líderes)
  SELECT id INTO v_tpl_id
  FROM ylada_link_templates
  WHERE active = true AND type IN ('quiz', 'diagnostico', 'triagem', 'calculator')
  ORDER BY (type = 'quiz') DESC, created_at ASC
  LIMIT 1;

  IF v_tpl_id IS NULL THEN
    RAISE NOTICE 'Sem template YLADA ativo — link demo não criado. Crie templates (207) e reexecute.';
    RETURN;
  END IF;

  SELECT id INTO v_link_id FROM ylada_links WHERE slug = v_slug AND user_id = v_leader_id LIMIT 1;
  IF v_link_id IS NULL THEN
    INSERT INTO ylada_links (
      user_id, template_id, slug, title, config_json, status, created_at, updated_at
    )
    VALUES (
      v_leader_id,
      v_tpl_id,
      v_slug,
      'Demo — Boas práticas de conversa (equipe)',
      jsonb_build_object(
        'page', jsonb_build_object('subtitle', 'Link de demonstração para métricas por membro no Pro Líderes.')
      ),
      'active',
      now(),
      now()
    )
    RETURNING id INTO v_link_id;
    RAISE NOTICE 'Criado ylada_links slug=%', v_slug;
  ELSE
    UPDATE ylada_links SET template_id = v_tpl_id, status = 'active', updated_at = now() WHERE id = v_link_id;
    RAISE NOTICE 'Reutilizado ylada_links id=% slug=%', v_link_id, v_slug;
  END IF;

  DELETE FROM ylada_link_events WHERE link_id = v_link_id;
  DELETE FROM pro_lideres_member_link_tokens
  WHERE leader_tenant_id = v_tenant_id AND ylada_link_id = v_link_id;

  -- Tokens: líder + todos os membros do tenant
  FOR v_member_id IN
    SELECT m.user_id
    FROM leader_tenant_members m
    WHERE m.leader_tenant_id = v_tenant_id
    ORDER BY CASE WHEN m.role = 'leader' THEN 0 ELSE 1 END, m.created_at
  LOOP
    v_token := encode(gen_random_bytes(16), 'hex');
    INSERT INTO pro_lideres_member_link_tokens (leader_tenant_id, member_user_id, ylada_link_id, token)
    VALUES (v_tenant_id, v_member_id, v_link_id, v_token);
  END LOOP;

  -- Telemetria sintética (views + WhatsApp por membro)
  FOR v_member_id IN
    SELECT m.user_id
    FROM leader_tenant_members m
    WHERE m.leader_tenant_id = v_tenant_id
  LOOP
    v_views := 3 + floor(random() * 22)::int;
    v_wa := floor(random() * 5)::int;
    FOR v_j IN 1..v_views LOOP
      INSERT INTO ylada_link_events (link_id, event_type, utm_json, created_at)
      VALUES (
        v_link_id,
        'view',
        jsonb_build_object('pl_member_user_id', v_member_id::text),
        now() - (v_j || ' minutes')::interval
      );
    END LOOP;
    FOR v_j IN 1..v_wa LOOP
      INSERT INTO ylada_link_events (link_id, event_type, utm_json, created_at)
      VALUES (
        v_link_id,
        'cta_click',
        jsonb_build_object('pl_member_user_id', v_member_id::text),
        now() - (v_j || ' hours')::interval
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Concluído. Tenant=% link=% — entre como demo@prolider.com e abra Análise da equipe.', v_tenant_id, v_link_id;
END $$;

-- Verificação rápida
SELECT u.email, u.email_confirmed_at IS NOT NULL AS ok_email
FROM auth.users u
WHERE lower(trim(u.email)) = 'demo@prolider.com';

SELECT count(*)::int AS membros_no_tenant
FROM leader_tenant_members m
JOIN leader_tenants lt ON lt.id = m.leader_tenant_id
JOIN auth.users u ON u.id = lt.owner_user_id
WHERE lower(trim(u.email)) = 'demo@prolider.com';

SELECT l.slug, l.title, count(DISTINCT t.member_user_id)::int AS com_token
FROM ylada_links l
JOIN pro_lideres_member_link_tokens t ON t.ylada_link_id = l.id
JOIN auth.users u ON u.id = l.user_id
WHERE lower(trim(u.email)) = 'demo@prolider.com' AND l.slug LIKE 'pl-dpl-%'
GROUP BY l.id, l.slug, l.title;

SELECT event_type, count(*)::int
FROM ylada_link_events e
JOIN ylada_links l ON l.id = e.link_id
JOIN auth.users u ON u.id = l.user_id
WHERE lower(trim(u.email)) = 'demo@prolider.com' AND l.slug LIKE 'pl-dpl-%'
GROUP BY event_type;
