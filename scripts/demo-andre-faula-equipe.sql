-- =============================================================================
-- Pro Líderes — DEMO André Faula  (90 dias de uso simulado)
--
-- Login: andre.faula@ylada.demo  ·  senha: ylada2026
--
-- OS 4 PRIMEIROS MEMBROS são situações reais para demo / vídeo:
--   1. Juliana Souza    → CAMPEÃ        — foco + alta conversão
--   2. Marcos Oliveira  → DISPERSO      — 3 links p/ todo mundo, 0 resultado
--   3. Fernanda Costa   → POTENCIAL     — enviou, ninguém clicou, precisa de ajuste
--   4. Ricardo Lima     → INATIVO       — na equipe há 70 dias, nunca usou
--
-- DATAS DE VENCIMENTO:
--   Membros 1-10  → vencem em 2-6 meses (saudável)
--   Membros 11-20 → vencem em 7-12 meses
--   Membros 21-28 → vencem em 10-30 dias (atenção — quase vencendo)
--   Membros 29-33 → JÁ VENCIDOS (expirado — mostra situação real de churn)
--   Membros 34-40 → sem data de vencimento definida
--   Membros 41-50 → pausados / pendentes
--
-- Tabuladores: João · Maria · Demonstração
-- Idempotente. Pré-req: migrations 301-310, 317 + pgcrypto + motor YLADA 207/287
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_senha        TEXT := 'ylada2026';
  v_leader_id    UUID;
  v_tenant_id    UUID;
  v_tpl_id       UUID;
  v_tpl_quiz_id  UUID;
  v_tpl_calc_id  UUID;
  v_link_a       UUID;
  v_link_b       UUID;
  v_link_c       UUID;
  v_slug_base    TEXT;
  v_slug_a       TEXT;
  v_slug_b       TEXT;
  v_slug_c       TEXT;
  v_i            INT;
  v_j            INT;
  v_email        TEXT;
  v_member_id    UUID;
  v_token        TEXT;
  v_views        INT;
  v_wa           INT;
  v_access_state TEXT;
  v_first_name   TEXT;
  v_share_slug   TEXT;
  v_expires_at   TIMESTAMPTZ;

  v_names TEXT[] := ARRAY[
    -- 4 situações demo (dados FIXOS, não aleatórios)
    'Juliana Souza',      -- 1  CAMPEÃ
    'Marcos Oliveira',    -- 2  DISPERSO
    'Fernanda Costa',     -- 3  POTENCIAL REPRESADO
    'Ricardo Lima',       -- 4  INATIVO
    -- Bons (5-22)
    'Patricia Mendes',    'Alessandro Ferreira', 'Camila Rodrigues',   'Diego Barbosa',
    'Aline Santos',       'Paulo Carvalho',      'Roberta Alves',      'Thiago Pereira',
    'Vanessa Moreira',    'Leonardo Nascimento', 'Cristina Campos',    'Anderson Silva',
    'Beatriz Faria',      'Eduardo Lopes',       'Natalia Gomes',      'Samuel Cardoso',
    'Priscila Martins',   'Gustavo Ribeiro',
    -- Médios — quase vencendo (23-28)
    'Claudia Tavares',    'Wellington Dias',     'Amanda Machado',
    'Renato Borges',      'Larissa Teixeira',    'Fabio Cavalcante',
    -- Com acesso VENCIDO (29-33)
    'Simone Correia',     'Marcelo Araujo',      'Tatiane Rocha',
    'Emerson Vieira',     'Michele Cruz',
    -- Sem data de vencimento (34-40)
    'Reginaldo Nunes',    'Jaqueline Melo',      'Cleber Freitas',
    'Rosana Duarte',      'Gilmar Pinto',        'Sueli Ramos',
    'Nilton Moraes',
    -- Pausados (41-46)
    'Keila Batista',      'Ronaldo Monteiro',    'Vania Fernandes',
    'Sandro Lima',        'Cleusa Sousa',        'Mauro Vieira',
    -- Pendentes (47-50)
    'Eliane Nascimento',  'Jose Carvalho',       'Bruna Pires',        'Italo Silveira'
  ];

  v_tabulators       TEXT[] := ARRAY['João', 'Maria', 'Demonstração'];
  v_member_whatsapp  TEXT;

BEGIN

  -- ===========================================================================
  -- 1. LÍDER: André Faula
  -- ===========================================================================
  SELECT id INTO v_leader_id FROM auth.users
  WHERE lower(trim(email)) = 'andre.faula@ylada.demo' LIMIT 1;

  IF v_leader_id IS NULL THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'andre.faula@ylada.demo',
      crypt(v_senha, gen_salt('bf')),
      NOW() - interval '90 days',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"André Faula","name":"André"}',
      NOW() - interval '90 days', NOW(),
      '', '', '', ''
    ) RETURNING id INTO v_leader_id;
    RAISE NOTICE 'Criado: andre.faula@ylada.demo id=%', v_leader_id;
  ELSE
    UPDATE auth.users SET
      encrypted_password = crypt(v_senha, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, NOW() - interval '90 days'),
      raw_user_meta_data = '{"full_name":"André Faula","name":"André"}',
      updated_at         = NOW()
    WHERE id = v_leader_id;
  END IF;

  -- ===========================================================================
  -- 2. TENANT
  -- ===========================================================================
  INSERT INTO leader_tenants (
    owner_user_id, slug, display_name, team_name,
    contact_email, whatsapp, vertical_code, message_tone
  )
  SELECT v_leader_id,
    'pl-' || substr(replace(v_leader_id::text, '-', ''), 1, 12),
    'André Faula', 'Equipe Faula — Herbalife',
    'andre.faula@ylada.demo', '+5519981868000', 'h-lider', 'acolhedor'
  WHERE NOT EXISTS (SELECT 1 FROM leader_tenants WHERE owner_user_id = v_leader_id);

  SELECT id INTO v_tenant_id FROM leader_tenants WHERE owner_user_id = v_leader_id LIMIT 1;
  IF v_tenant_id IS NULL THEN RAISE EXCEPTION 'Tenant não criado.'; END IF;

  UPDATE leader_tenants SET
    display_name = 'André Faula', team_name = 'Equipe Faula — Herbalife',
    whatsapp = '+5519981868000', vertical_code = 'h-lider',
    message_tone = 'acolhedor', updated_at = NOW()
  WHERE id = v_tenant_id;

  v_slug_base := 'pl-afaula-' || substr(replace(v_leader_id::text, '-', ''), 1, 8);
  v_slug_a    := v_slug_base || '-rec';
  v_slug_b    := v_slug_base || '-vnd';
  v_slug_c    := v_slug_base || '-cal';

  -- ===========================================================================
  -- 3. ASSINATURA
  -- ===========================================================================
  IF NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = v_leader_id AND area = 'pro_lideres_team') THEN
    INSERT INTO subscriptions (user_id, area, status, plan_type, features, stripe_account,
      stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency, current_period_start, current_period_end, created_at, updated_at)
    VALUES (v_leader_id, 'pro_lideres_team', 'active', 'monthly', '[]'::jsonb, 'br',
      'demo_pl_afaula_' || substr(v_leader_id::text,1,8),
      'demo_cus_afaula_' || substr(v_leader_id::text,1,8),
      'demo_price_pl_team', 0, 'brl',
      NOW() - interval '90 days', NOW() + interval '5 years',
      NOW() - interval '90 days', NOW());
  ELSE
    UPDATE subscriptions SET status = 'active',
      current_period_start = NOW() - interval '90 days',
      current_period_end   = NOW() + interval '5 years',
      updated_at           = NOW()
    WHERE user_id = v_leader_id AND area = 'pro_lideres_team';
  END IF;

  -- ===========================================================================
  -- 4. PERFIL LÍDER
  -- ===========================================================================
  IF EXISTS (SELECT 1 FROM user_profiles WHERE user_id = v_leader_id) THEN
    UPDATE user_profiles SET
      email         = 'andre.faula@ylada.demo',
      nome_completo = 'André Faula',
      whatsapp      = '+5519981868000',
      updated_at    = NOW()
    WHERE user_id = v_leader_id;
  ELSE
    INSERT INTO user_profiles (user_id, email, nome_completo, perfil, whatsapp, updated_at)
    VALUES (v_leader_id, 'andre.faula@ylada.demo', 'André Faula', 'seller', '+5519981868000', NOW());
  END IF;

  -- ===========================================================================
  -- 5. TABULADORES: João, Maria, Demonstração
  -- ===========================================================================
  DELETE FROM leader_tenant_tabulators
  WHERE leader_tenant_id = v_tenant_id
    AND lower(label) IN ('lilian','alexandre','natalia','roberto',
                         'joão','joao','maria','demonstração','demonstracao');

  INSERT INTO leader_tenant_tabulators (leader_tenant_id, label, sort_order)
  VALUES (v_tenant_id,'João',0),(v_tenant_id,'Maria',1),(v_tenant_id,'Demonstração',2)
  ON CONFLICT DO NOTHING;

  -- ===========================================================================
  -- 6. TAREFAS DIÁRIAS
  -- ===========================================================================
  IF NOT EXISTS (SELECT 1 FROM pro_lideres_daily_tasks
    WHERE leader_tenant_id = v_tenant_id AND title = 'Adicionar 3 novos contatos') THEN
    INSERT INTO pro_lideres_daily_tasks
      (leader_tenant_id, title, description, points, execution_weekdays, sort_order, created_by_user_id)
    VALUES
      (v_tenant_id,'Adicionar 3 novos contatos',
       'Prospectar 3 pessoas novas no WhatsApp ou presencialmente',30,ARRAY[1,2,3,4,5],0,v_leader_id),
      (v_tenant_id,'Enviar link do diagnóstico',
       'Compartilhar o link certo para a pessoa certa — recrutamento ou vendas',50,ARRAY[1,2,3,4,5],1,v_leader_id),
      (v_tenant_id,'Follow-up com prospectos',
       'Retomar contato com leads que não responderam',30,ARRAY[1,2,3,4,5],2,v_leader_id),
      (v_tenant_id,'Postar nos stories',
       'Publicar 1 conteúdo de autoridade no Instagram',20,ARRAY[1,2,3,4,5,6],3,v_leader_id),
      (v_tenant_id,'Reunião semanal da equipe',
       'Participar da call de alinhamento Equipe Faula',100,ARRAY[3],4,v_leader_id);
  END IF;

  -- ===========================================================================
  -- 7. CONVITE DEMO PERMANENTE
  -- ===========================================================================
  DELETE FROM leader_tenant_invites WHERE token = 'ylada_pl_afaula_demo_v1';
  INSERT INTO leader_tenant_invites
    (leader_tenant_id, token, invited_email, created_by_user_id, expires_at, status)
  VALUES (v_tenant_id,'ylada_pl_afaula_demo_v1','novo.membro.demo@ylada.app',
    v_leader_id, NOW() + interval '10 years','pending'::leader_tenant_invite_status);

  -- ===========================================================================
  -- 8. MEMBROS (50) — com datas de vencimento
  -- ===========================================================================
  FOR v_i IN 1..50 LOOP
    v_email := format('pl-afaula-%s@ylada.demo', lpad(v_i::text, 2, '0'));

    -- Estado de acesso
    IF v_i <= 40 THEN      v_access_state := 'active';
    ELSIF v_i <= 46 THEN   v_access_state := 'paused';
    ELSE                   v_access_state := 'pending_activation';
    END IF;

    -- Data de vencimento por grupo
    IF    v_i BETWEEN  1 AND 10 THEN v_expires_at := NOW() + ((60 + v_i * 15) || ' days')::interval;  -- 2-6 meses
    ELSIF v_i BETWEEN 11 AND 20 THEN v_expires_at := NOW() + ((210 + v_i * 5) || ' days')::interval;  -- 7-12 meses
    ELSIF v_i BETWEEN 21 AND 28 THEN v_expires_at := NOW() + ((5 + (v_i-20) * 4) || ' days')::interval; -- 5-33 dias (quase vencendo)
    ELSIF v_i BETWEEN 29 AND 33 THEN v_expires_at := NOW() - ((5 + (v_i-28) * 8) || ' days')::interval;  -- VENCIDO há 5-40 dias
    ELSE                              v_expires_at := NULL;  -- sem data definida
    END IF;

    SELECT id INTO v_member_id FROM auth.users
    WHERE lower(trim(email)) = lower(v_email) LIMIT 1;

    IF v_member_id IS NULL THEN
      INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
      ) VALUES (
        gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', v_email,
        crypt(v_senha, gen_salt('bf')),
        NOW() - ((91 - v_i) || ' days')::interval,
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name',v_names[v_i],'name',split_part(v_names[v_i],' ',1)),
        NOW() - ((91 - v_i) || ' days')::interval, NOW(),
        '', '', '', ''
      ) RETURNING id INTO v_member_id;
    END IF;

    IF EXISTS (SELECT 1 FROM user_profiles WHERE user_id = v_member_id) THEN
      UPDATE user_profiles SET
        email         = v_email,
        nome_completo = v_names[v_i],
        whatsapp      = v_member_whatsapp,
        updated_at    = NOW()
      WHERE user_id = v_member_id;
    ELSE
      INSERT INTO user_profiles (user_id, email, nome_completo, perfil, whatsapp, updated_at)
      VALUES (v_member_id, v_email, v_names[v_i], 'seller', v_member_whatsapp, NOW());
    END IF;

    -- Número WA sintético: +55 + DDD (ciclo 10 cidades) + 9 + sequência única
    v_member_whatsapp := '+55'
      || (ARRAY['11','21','31','41','51','61','71','81','85','19'])[1 + ((v_i - 1) % 10)]
      || '9'
      || lpad((91234000 + v_i)::text, 8, '0');

    v_first_name := lower(regexp_replace(split_part(v_names[v_i],' ',1),'[^a-zA-Z0-9]','','g'));
    v_share_slug := v_first_name || '-' || lpad(v_i::text, 2, '0');

    INSERT INTO leader_tenant_members (
      leader_tenant_id, user_id, role,
      team_access_state, team_access_expires_at,
      pro_lideres_share_slug, pro_lideres_tabulator_name
    ) VALUES (
      v_tenant_id, v_member_id, 'member'::leader_tenant_member_role,
      v_access_state, v_expires_at,
      v_share_slug,
      CASE
        WHEN v_i <= 40 AND v_i % 3 = 1 THEN 'João'
        WHEN v_i <= 40 AND v_i % 3 = 2 THEN 'Maria'
        WHEN v_i <= 40                  THEN 'Demonstração'
        ELSE NULL
      END
    )
    ON CONFLICT (leader_tenant_id, user_id) DO UPDATE SET
      team_access_state          = EXCLUDED.team_access_state,
      team_access_expires_at     = EXCLUDED.team_access_expires_at,
      pro_lideres_share_slug     = EXCLUDED.pro_lideres_share_slug,
      pro_lideres_tabulator_name = EXCLUDED.pro_lideres_tabulator_name;

  END LOOP;
  RAISE NOTICE '50 membros prontos com datas de vencimento.';

  -- ===========================================================================
  -- 9. TEMPLATES YLADA
  -- ===========================================================================
  SELECT id INTO v_tpl_quiz_id FROM ylada_link_templates
  WHERE active = true AND type IN ('quiz','diagnostico','triagem')
  ORDER BY created_at ASC LIMIT 1;

  SELECT id INTO v_tpl_calc_id FROM ylada_link_templates
  WHERE active = true AND type IN ('calculator','calculadora')
  ORDER BY created_at ASC LIMIT 1;

  IF v_tpl_quiz_id IS NULL AND v_tpl_calc_id IS NULL THEN
    RAISE NOTICE 'AVISO: nenhum template ativo — links não criados. Rode migrations 207/287.';
    RETURN;
  END IF;
  IF v_tpl_quiz_id IS NULL THEN v_tpl_quiz_id := v_tpl_calc_id; END IF;
  IF v_tpl_calc_id IS NULL THEN v_tpl_calc_id := v_tpl_quiz_id; END IF;

  SELECT id INTO v_tpl_id FROM ylada_link_templates
  WHERE active = true AND type IN ('quiz','diagnostico','triagem')
  ORDER BY created_at DESC LIMIT 1;
  IF v_tpl_id IS NULL THEN v_tpl_id := v_tpl_quiz_id; END IF;

  -- ===========================================================================
  -- 10. 3 LINKS
  -- ===========================================================================
  SELECT id INTO v_link_a FROM ylada_links WHERE slug = v_slug_a AND user_id = v_leader_id LIMIT 1;
  IF v_link_a IS NULL THEN
    INSERT INTO ylada_links (user_id,template_id,slug,title,config_json,cta_whatsapp,status,created_at,updated_at)
    VALUES (v_leader_id,v_tpl_quiz_id,v_slug_a,
      'Oportunidade de Negócio — Diagnóstico',
      '{"page":{"subtitle":"Descubra se essa oportunidade faz sentido para você."}}',
      '+5519981868000',
      'active', NOW()-interval '85 days', NOW()) RETURNING id INTO v_link_a;
  ELSE
    UPDATE ylada_links SET status='active', cta_whatsapp='+5519981868000', updated_at=NOW() WHERE id=v_link_a;
  END IF;

  SELECT id INTO v_link_b FROM ylada_links WHERE slug = v_slug_b AND user_id = v_leader_id LIMIT 1;
  IF v_link_b IS NULL THEN
    INSERT INTO ylada_links (user_id,template_id,slug,title,config_json,cta_whatsapp,status,created_at,updated_at)
    VALUES (v_leader_id,v_tpl_id,v_slug_b,
      'Diagnóstico de Bem-Estar — Produto',
      '{"page":{"subtitle":"Veja como melhorar sua energia, foco e disposição."}}',
      '+5519981868000',
      'active', NOW()-interval '80 days', NOW()) RETURNING id INTO v_link_b;
  ELSE
    UPDATE ylada_links SET status='active', cta_whatsapp='+5519981868000', updated_at=NOW() WHERE id=v_link_b;
  END IF;

  SELECT id INTO v_link_c FROM ylada_links WHERE slug = v_slug_c AND user_id = v_leader_id LIMIT 1;
  IF v_link_c IS NULL THEN
    INSERT INTO ylada_links (user_id,template_id,slug,title,config_json,cta_whatsapp,status,created_at,updated_at)
    VALUES (v_leader_id,v_tpl_calc_id,v_slug_c,
      'Calculadora de Resultados',
      '{"page":{"subtitle":"Quanto você pode ganhar com a oportunidade Herbalife?"}}',
      '+5519981868000',
      'active', NOW()-interval '70 days', NOW()) RETURNING id INTO v_link_c;
  ELSE
    UPDATE ylada_links SET status='active', cta_whatsapp='+5519981868000', updated_at=NOW() WHERE id=v_link_c;
  END IF;

  RAISE NOTICE 'Links: A(rec)=% B(vnd)=% C(cal)=%', v_link_a, v_link_b, v_link_c;

  -- ===========================================================================
  -- 11. TOKENS
  -- ===========================================================================
  DELETE FROM ylada_link_events WHERE link_id IN (v_link_a, v_link_b, v_link_c);
  DELETE FROM pro_lideres_member_link_tokens
  WHERE leader_tenant_id = v_tenant_id AND ylada_link_id IN (v_link_a, v_link_b, v_link_c);

  FOR v_member_id IN
    SELECT m.user_id FROM leader_tenant_members m WHERE m.leader_tenant_id = v_tenant_id
    ORDER BY CASE WHEN m.role='leader' THEN 0 ELSE 1 END, m.created_at
  LOOP
    INSERT INTO pro_lideres_member_link_tokens (leader_tenant_id,member_user_id,ylada_link_id,token)
    VALUES
      (v_tenant_id,v_member_id,v_link_a,encode(gen_random_bytes(16),'hex')),
      (v_tenant_id,v_member_id,v_link_b,encode(gen_random_bytes(16),'hex')),
      (v_tenant_id,v_member_id,v_link_c,encode(gen_random_bytes(16),'hex'));
  END LOOP;
  RAISE NOTICE 'Tokens gerados (3 links × todos os membros).';

  -- ===========================================================================
  -- 12. TELEMETRIA
  --
  -- Membros 1-4: dados FIXOS para as 4 situações demo
  -- Membros 5+:  dados aleatórios por grupo
  -- ===========================================================================

  FOR v_i IN 1..50 LOOP
    v_email := format('pl-afaula-%s@ylada.demo', lpad(v_i::text, 2, '0'));
    SELECT id INTO v_member_id FROM auth.users
    WHERE lower(trim(email)) = lower(v_email) LIMIT 1;
    IF v_member_id IS NULL THEN CONTINUE; END IF;

    -- ================================================================
    -- SITUAÇÃO 1 — JULIANA (Campeã): 1 link focado, alta conversão
    -- ================================================================
    IF v_i = 1 THEN
      -- Link recrutamento: 68 views + 19 cliques  (taxa: 27,9%)
      FOR v_j IN 1..68 LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_a,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*85)+3)::int||' days')::interval - (floor(random()*22)::int||' hours')::interval);
      END LOOP;
      FOR v_j IN 1..19 LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_a,'cta_click',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*85)+3)::int||' days')::interval);
      END LOOP;
      -- Também usa vendas com parcimônia: 14 views + 4 cliques
      FOR v_j IN 1..14 LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_b,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*60)+3)::int||' days')::interval);
      END LOOP;
      FOR v_j IN 1..4 LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_b,'cta_click',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*60)+3)::int||' days')::interval);
      END LOOP;

    -- ================================================================
    -- SITUAÇÃO 2 — MARCOS (Disperso): 3 links p/ todos, 0 resultado
    -- ================================================================
    ELSIF v_i = 2 THEN
      -- Recrutamento: 31 views, 1 clique (3,2%)
      FOR v_j IN 1..31 LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_a,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*30)+1)::int||' days')::interval);
      END LOOP;
      INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
        v_link_a,'cta_click',jsonb_build_object('pl_member_user_id',v_member_id::text),
        NOW() - interval '18 days');
      -- Vendas: 24 views, 0 cliques
      FOR v_j IN 1..24 LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_b,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*30)+1)::int||' days')::interval);
      END LOOP;
      -- Calculadora: 19 views, 0 cliques
      FOR v_j IN 1..19 LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_c,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*30)+1)::int||' days')::interval);
      END LOOP;
      -- Total: 74 views, 1 clique = 1,4% — dispersão total

    -- ================================================================
    -- SITUAÇÃO 3 — FERNANDA (Potencial represado): enviou, ninguém clicou
    -- ================================================================
    ELSIF v_i = 3 THEN
      -- Recrutamento: 11 views, 0 cliques
      FOR v_j IN 1..11 LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_a,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*20)+5)::int||' days')::interval);
      END LOOP;
      -- Vendas: 7 views, 0 cliques
      FOR v_j IN 1..7 LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_b,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*15)+5)::int||' days')::interval);
      END LOOP;
      -- 0 cliques em nenhum link — precisa ajustar a abordagem

    -- ================================================================
    -- SITUAÇÃO 4 — RICARDO (Inativo): na equipe há 70 dias, 0 atividade
    -- ================================================================
    -- ELSIF v_i = 4: não insere nenhum evento (inativo total)

    -- ================================================================
    -- MEMBROS 5-22 (Bons): 1 link focado, boa conversão
    -- ================================================================
    ELSIF v_i BETWEEN 5 AND 22 THEN
      DECLARE v_lnk UUID := CASE WHEN v_i % 2 = 0 THEN v_link_a ELSE v_link_b END;
      BEGIN
        v_views := 15 + floor(random()*20)::int;
        v_wa    :=  4 + floor(random()*7)::int;
        FOR v_j IN 1..v_views LOOP
          INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
            v_lnk,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
            NOW() - ((floor(random()*70)+1)::int||' days')::interval);
        END LOOP;
        FOR v_j IN 1..v_wa LOOP
          INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
            v_lnk,'cta_click',jsonb_build_object('pl_member_user_id',v_member_id::text),
            NOW() - ((floor(random()*70)+1)::int||' days')::interval);
        END LOOP;
        IF v_i % 4 = 0 THEN
          FOR v_j IN 1..(5 + floor(random()*8)::int) LOOP
            INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
              v_link_c,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
              NOW() - ((floor(random()*50)+1)::int||' days')::interval);
          END LOOP;
        END IF;
      END;

    -- ================================================================
    -- MEMBROS 23-28 (Médios — quase vencendo): 2 links, conv diluída
    -- ================================================================
    ELSIF v_i BETWEEN 23 AND 28 THEN
      v_views := 8 + floor(random()*10)::int;
      v_wa    := 1 + floor(random()*2)::int;
      FOR v_j IN 1..v_views LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_a,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*45)+1)::int||' days')::interval);
      END LOOP;
      FOR v_j IN 1..v_wa LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_a,'cta_click',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*45)+1)::int||' days')::interval);
      END LOOP;
      v_views := 5 + floor(random()*8)::int;
      FOR v_j IN 1..v_views LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_b,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((floor(random()*45)+1)::int||' days')::interval);
      END LOOP;

    -- ================================================================
    -- MEMBROS 29-33 (Vencidos): tinham atividade, pararam ao vencer
    -- ================================================================
    ELSIF v_i BETWEEN 29 AND 33 THEN
      -- Atividade existe, mas só antes do vencimento (há 5-40 dias parou)
      v_views := 12 + floor(random()*15)::int;
      v_wa    := floor(random()*3)::int;
      FOR v_j IN 1..v_views LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_a,'view',jsonb_build_object('pl_member_user_id',v_member_id::text),
          -- eventos só até a data de vencimento (45-90 dias atrás)
          NOW() - ((45 + floor(random()*45))::int||' days')::interval);
      END LOOP;
      FOR v_j IN 1..v_wa LOOP
        INSERT INTO ylada_link_events (link_id,event_type,utm_json,created_at) VALUES (
          v_link_a,'cta_click',jsonb_build_object('pl_member_user_id',v_member_id::text),
          NOW() - ((45 + floor(random()*45))::int||' days')::interval);
      END LOOP;

    -- 34-50: sem eventos
    END IF;

  END LOOP;

  RAISE NOTICE '====================================================';
  RAISE NOTICE 'DEMO ANDRÉ FAULA — PRONTO';
  RAISE NOTICE 'Login:  andre.faula@ylada.demo  /  ylada2026';
  RAISE NOTICE 'Tenant: %', v_tenant_id;
  RAISE NOTICE 'Links:  Recrutamento / Bem-Estar / Calculadora';
  RAISE NOTICE 'Equipe: 50 membros (40 ativos · 6 pausados · 4 pendentes)';
  RAISE NOTICE 'Vencimentos: 8 quase vencendo · 5 JÁ VENCIDOS';
  RAISE NOTICE '====================================================';

END $$;

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================
SELECT up.nome_completo, u.email, u.email_confirmed_at IS NOT NULL AS ok
FROM auth.users u LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE lower(trim(u.email)) = 'andre.faula@ylada.demo';

SELECT m.team_access_state, m.role, count(*)::int AS total,
  sum(CASE WHEN m.team_access_expires_at < NOW() THEN 1 ELSE 0 END)::int AS ja_vencidos,
  sum(CASE WHEN m.team_access_expires_at BETWEEN NOW() AND NOW()+interval '30 days' THEN 1 ELSE 0 END)::int AS vence_em_30d
FROM leader_tenant_members m
JOIN leader_tenants lt ON lt.id = m.leader_tenant_id
JOIN auth.users u ON u.id = lt.owner_user_id
WHERE lower(trim(u.email)) = 'andre.faula@ylada.demo'
GROUP BY m.team_access_state, m.role ORDER BY m.role DESC, m.team_access_state;

SELECT l.title,
  event_type,
  count(*)::int AS eventos,
  count(DISTINCT (e.utm_json->>'pl_member_user_id'))::int AS membros
FROM ylada_link_events e
JOIN ylada_links l ON l.id = e.link_id
JOIN auth.users u ON u.id = l.user_id
WHERE lower(trim(u.email)) = 'andre.faula@ylada.demo'
GROUP BY l.title, event_type ORDER BY l.title, event_type;
