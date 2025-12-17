-- =====================================================
-- SCRIPT: Criar Assinatura para nutri3@ylada.com
-- =====================================================
-- Execute este script APÓS criar o diagnóstico (04-configurar-diagnosticos-teste.sql)
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'nutri3@ylada.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Usuário nutri3@ylada.com não encontrado! Crie primeiro no Dashboard.';
  END IF;

  -- Criar assinatura ativa
  INSERT INTO subscriptions (
    user_id,
    area,
    plan_type,
    status,
    current_period_start,
    current_period_end,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    'nutri',
    'annual',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id, area) DO UPDATE
  SET 
    status = 'active',
    plan_type = 'annual',
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '1 year',
    updated_at = NOW();

  RAISE NOTICE '✅ Assinatura criada para: nutri3@ylada.com';
END $$;

-- =====================================================
-- VERIFICAR SE FUNCIONOU
-- =====================================================
SELECT 
  au.email,
  s.status,
  s.plan_type,
  s.current_period_start,
  s.current_period_end
FROM auth.users au
JOIN subscriptions s ON au.id = s.user_id
WHERE au.email = 'nutri3@ylada.com' AND s.area = 'nutri';


