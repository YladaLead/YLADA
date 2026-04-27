-- -----------------------------------------------------------------------------
-- Pro Líderes — marcar assinatura YLADA equipe (pro_lideres_team) como PAGA / 1 ANO
-- Uso: Supabase → SQL Editor (role com acesso a auth + public).
-- Ajuste v_email abaixo. Só funciona se esse usuário for owner em leader_tenants.
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_email TEXT := 'deisefaula@gmail.com';
  v_uid UUID;
BEGIN
  SELECT id INTO v_uid
  FROM auth.users
  WHERE lower(trim(email)) = lower(trim(v_email))
  LIMIT 1;

  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', v_email;
  END IF;

  UPDATE leader_tenants
  SET team_invite_pending_quota = 50, updated_at = now()
  WHERE owner_user_id = v_uid;

  IF NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = v_uid AND area = 'pro_lideres_team') THEN
    INSERT INTO subscriptions (
      user_id, area, status, plan_type, features,
      stripe_account, stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency, current_period_start, current_period_end, created_at, updated_at
    )
    VALUES (
      v_uid,
      'pro_lideres_team',
      'active',
      'annual',
      '[]'::jsonb,
      'br',
      'manual_pl_team_1y_' || replace(v_uid::text, '-', '') || '_' || floor(extract(epoch from now()))::text,
      'manual_cus_' || replace(v_uid::text, '-', ''),
      'manual_price_pl_team_1y',
      75000,
      'brl',
      now(),
      now() + interval '1 year',
      now(),
      now()
    );
    RAISE NOTICE 'Criada assinatura pro_lideres_team — pago manualmente, vigência 1 ano, user %', v_uid;
  ELSE
    UPDATE subscriptions
    SET
      status = 'active',
      plan_type = 'annual',
      current_period_start = now(),
      current_period_end = now() + interval '1 year',
      updated_at = now()
    WHERE user_id = v_uid AND area = 'pro_lideres_team';
    RAISE NOTICE 'Atualizada assinatura pro_lideres_team — pago manualmente, vigência 1 ano, user %', v_uid;
  END IF;
END $$;
