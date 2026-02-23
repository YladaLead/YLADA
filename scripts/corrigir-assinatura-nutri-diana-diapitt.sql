-- =====================================================
-- CORREÇÃO DE ACESSO NUTRI: Diana (diapitt@gmail.com)
-- Ela entrou com senha provisória mas vê "Acesso Restrito"
-- (plano com acesso a ferramentas ou completo).
-- Causa: assinatura sem features ou com features incompletas.
-- =====================================================
-- Este script atualiza a assinatura ativa da Diana para
-- incluir features ['ferramentas', 'cursos'] (acesso completo Nutri).
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_sub_id UUID;
  v_email TEXT := 'diapitt@gmail.com';
  v_area TEXT := 'nutri';
  v_features JSONB := '["ferramentas", "cursos"]'::jsonb;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email %. Verifique o e-mail no Supabase Auth (Authentication > Users).', v_email;
  END IF;

  SELECT id INTO v_sub_id
  FROM subscriptions
  WHERE user_id = v_user_id AND area = v_area AND status = 'active'
  ORDER BY current_period_end DESC NULLS LAST
  LIMIT 1;

  IF v_sub_id IS NULL THEN
    RAISE NOTICE 'Nenhuma assinatura ativa encontrada para % na área %.', v_email, v_area;
    RAISE NOTICE 'Crie a assinatura manualmente no Supabase (subscriptions) ou via API de sync do pagamento.';
    RAISE NOTICE 'Ou insira com: INSERT INTO subscriptions (user_id, area, plan_type, features, status, current_period_start, current_period_end, ...) VALUES (''%'', ''nutri'', ''monthly'', ''["ferramentas", "cursos"]''::jsonb, ''active'', NOW(), NOW() + INTERVAL ''1 month'', ...);', v_user_id;
    RETURN;
  END IF;

  UPDATE subscriptions
  SET
    features = v_features,
    updated_at = NOW()
  WHERE id = v_sub_id;

  RAISE NOTICE '✅ Assinatura atualizada para % (Diana). features = ferramentas, cursos.', v_email;
  RAISE NOTICE 'Ela pode recarregar a página ou fazer logout e login novamente para acessar as áreas restritas.';
END $$;
