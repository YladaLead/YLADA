-- =====================================================
-- CONTA DEMO NUTRA: perfil + assinatura ativa
-- Garantir que demo.nutra@ylada.app (ou .com) tenha acesso à área Nutra
-- Script de vídeos: node scripts/criar-contas-demo-videos.js (usa @ylada.app)
-- =====================================================

DO $$
DECLARE
  demo_user_id UUID;
  existing_subscription_id UUID;
  demo_email TEXT;
BEGIN
  SELECT user_id, email INTO demo_user_id, demo_email
  FROM user_profiles
  WHERE email IN ('demo.nutra@ylada.app', 'demo.nutra@ylada.com')
  LIMIT 1;

  IF demo_user_id IS NULL THEN
    RAISE NOTICE '⚠️ Usuário demo.nutra@ylada.app não encontrado. Rode: node scripts/criar-contas-demo-videos.js';
    RETURN;
  END IF;

  -- Garantir perfil nutra
  UPDATE user_profiles
  SET perfil = 'nutra', updated_at = NOW()
  WHERE user_id = demo_user_id AND (perfil IS NULL OR perfil != 'nutra');

  -- Verificar assinatura existente
  SELECT id INTO existing_subscription_id
  FROM subscriptions
  WHERE user_id = demo_user_id AND area = 'nutra'
  LIMIT 1;

  IF existing_subscription_id IS NOT NULL THEN
    UPDATE subscriptions
    SET
      status = 'active',
      plan_type = 'free',
      features = '["cursos", "completo"]'::jsonb,
      current_period_start = NOW(),
      current_period_end = NOW() + INTERVAL '1 year',
      updated_at = NOW()
    WHERE id = existing_subscription_id;
    RAISE NOTICE '✅ Assinatura Nutra atualizada para %', demo_email;
  ELSE
    INSERT INTO subscriptions (
      user_id, area, status, plan_type, features,
      stripe_account, stripe_subscription_id, stripe_customer_id, stripe_price_id,
      amount, currency, current_period_start, current_period_end, created_at, updated_at
    )
    VALUES (
      demo_user_id, 'nutra', 'active', 'free', '["cursos", "completo"]'::jsonb,
      'br', 'free_' || demo_user_id::text || '_nutra_' || EXTRACT(EPOCH FROM NOW())::bigint,
      'free_' || demo_user_id::text, 'free', 0, 'brl',
      NOW(), NOW() + INTERVAL '1 year', NOW(), NOW()
    );
    RAISE NOTICE '✅ Assinatura Nutra criada para %', demo_email;
  END IF;
END $$;
