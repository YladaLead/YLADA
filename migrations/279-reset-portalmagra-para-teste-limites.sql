-- =====================================================
-- Reset da conta portalmagra@gmail.com para teste de limites
-- =====================================================
-- Deixa a conta como se tivesse acabado de se cadastrar,
-- para testar: 1 link ativo, 10 Noel/mês, 10 WhatsApp/mês.
-- Conta foi transferida da área Coach (migração 278).
-- Execute no Supabase SQL Editor.
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_sub_id UUID;
  v_month_ref TEXT := to_char(NOW(), 'YYYY-MM');
BEGIN
  -- 1) Resolver user_id (aceita portalmagra ou portal.magra)
  SELECT u.id INTO v_user_id
  FROM auth.users u
  WHERE u.email ILIKE 'portalmagra@gmail.com'
     OR u.email ILIKE 'portal.magra@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado: portalmagra@gmail.com (ou portal.magra@gmail.com)';
  END IF;

  RAISE NOTICE 'User_id: %', v_user_id;

  -- 2) Assinatura YLADA em plano FREE (para aplicar limites)
  SELECT id INTO v_sub_id
  FROM subscriptions
  WHERE user_id = v_user_id AND area = 'ylada'
  LIMIT 1;

  IF v_sub_id IS NOT NULL THEN
    UPDATE subscriptions
    SET plan_type = 'free',
        status = 'active',
        current_period_start = date_trunc('month', NOW()),
        current_period_end = date_trunc('month', NOW()) + INTERVAL '1 month',
        updated_at = NOW()
    WHERE id = v_sub_id;
    RAISE NOTICE 'Assinatura ylada atualizada para plano free.';
  ELSE
    INSERT INTO subscriptions (
      user_id, area, status, plan_type,
      stripe_account, stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency,
      current_period_start, current_period_end, created_at, updated_at
    )
    VALUES (
      v_user_id, 'ylada', 'active', 'free',
      'br',
      'free_reset_' || v_user_id::text || '_' || extract(epoch from NOW())::bigint,
      'free_' || v_user_id::text,
      'free',
      0,
      'brl',
      date_trunc('month', NOW()),
      date_trunc('month', NOW()) + INTERVAL '1 month',
      NOW(), NOW()
    );
    RAISE NOTICE 'Assinatura ylada free criada.';
  END IF;

  -- 3) Zerar uso mensal do Noel (freemium)
  DELETE FROM ylada_noel_monthly_usage WHERE user_id = v_user_id;
  RAISE NOTICE 'Uso mensal do Noel zerado.';

  -- 4) Perfil YLADA como “cadastro novo” → redireciona ao onboarding
  UPDATE ylada_noel_profile
  SET
    area_specific = jsonb_build_object(
      'nome', '',
      'whatsapp', '',
      'countryCode', 'BR'
    ),
    profile_type = NULL,
    profession = NULL,
    updated_at = NOW()
  WHERE user_id = v_user_id AND segment = 'ylada';
  RAISE NOTICE 'Perfil YLADA resetado para onboarding (nome/whatsapp vazios, profile_type/profession NULL).';

  -- 5) Remover todos os links (limite free = 1 ativo; começa com 0)
  -- CASCADE remove ylada_diagnosis_metrics e ylada_link_events
  DELETE FROM ylada_links WHERE user_id = v_user_id;
  RAISE NOTICE 'Links removidos (contagem WhatsApp do mês zerada por CASCADE).';

  -- 6) Opcional: desbloquear rate limit do Noel, se existir
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'noel_rate_limits') THEN
    UPDATE noel_rate_limits
    SET is_blocked = false, blocked_until = NULL, updated_at = NOW()
    WHERE user_id = v_user_id;
    IF FOUND THEN
      RAISE NOTICE 'Rate limit Noel desbloqueado.';
    END IF;
  END IF;

  RAISE NOTICE 'Concluído: portalmagra@gmail.com configurada para teste de limites (0 Noel, 0 links, onboarding).';
END $$;
