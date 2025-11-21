-- =====================================================
-- ATIVAR ASSINATURAS COACH PARA USUÁRIOS EXISTENTES
-- =====================================================
-- Este script verifica se os usuários existem e cria/atualiza
-- suas assinaturas na área Coach por 1 ano
-- 
-- IMPORTANTE: Se o usuário não existir, use o script Node.js:
-- node scripts/criar-contas-coach-com-senha-provisoria.js
-- =====================================================

-- =====================================================
-- 1. LISTAR USUÁRIOS E VERIFICAR STATUS
-- =====================================================
SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  up.nome_completo,
  up.perfil,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM subscriptions s 
      WHERE s.user_id = u.id 
      AND s.area = 'coach' 
      AND s.status = 'active'
      AND s.current_period_end > NOW()
    ) THEN '✅ Tem assinatura ativa'
    ELSE '❌ Sem assinatura ativa'
  END as status_assinatura
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email IN (
  'amandabonfogo01@gmail.com',
  'naytenutri@gmail.com',
  'deisefaula@gmail.com'
)
ORDER BY u.email;

-- =====================================================
-- 2. CRIAR/ATUALIZAR ASSINATURAS
-- =====================================================
DO $$
DECLARE
  usuario RECORD;
  subscription_id UUID;
  period_start TIMESTAMP WITH TIME ZONE;
  period_end TIMESTAMP WITH TIME ZONE;
  dias_validade INTEGER := 365; -- 1 ano
BEGIN
  -- Loop pelos usuários
  FOR usuario IN 
    SELECT 
      u.id as user_id,
      u.email,
      COALESCE(up.nome_completo, 'Usuário') as nome
    FROM auth.users u
    LEFT JOIN user_profiles up ON up.user_id = u.id
    WHERE u.email IN (
      'amandabonfogo01@gmail.com',
      'naytenutri@gmail.com',
      'deisefaula@gmail.com'
    )
  LOOP
    RAISE NOTICE '📧 Processando: % (ID: %)', usuario.email, usuario.user_id;
    
    -- Verificar se já tem assinatura ativa
    SELECT id INTO subscription_id
    FROM subscriptions
    WHERE user_id = usuario.user_id
      AND area = 'coach'
      AND status = 'active'
      AND current_period_end > NOW()
    LIMIT 1;
    
    IF subscription_id IS NOT NULL THEN
      RAISE NOTICE '   ✅ Usuário % já tem assinatura ativa (ID: %)', usuario.email, subscription_id;
      
      -- Atualizar para garantir 1 ano a partir de hoje
      period_start := NOW();
      period_end := NOW() + (dias_validade || ' days')::INTERVAL;
      
      UPDATE subscriptions
      SET 
        current_period_start = period_start,
        current_period_end = period_end,
        status = 'active',
        cancel_at_period_end = false,
        updated_at = NOW()
      WHERE id = subscription_id;
      
      RAISE NOTICE '   ✅ Assinatura atualizada até %', period_end;
    ELSE
      -- Criar nova assinatura
      period_start := NOW();
      period_end := NOW() + (dias_validade || ' days')::INTERVAL;
      
      INSERT INTO subscriptions (
        user_id,
        area,
        plan_type,
        stripe_account,
        stripe_subscription_id,
        stripe_customer_id,
        stripe_price_id,
        amount,
        currency,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end
      ) VALUES (
        usuario.user_id,
        'coach',
        'annual',
        'br',
        'manual_' || usuario.user_id::TEXT || '_coach_' || EXTRACT(EPOCH FROM NOW())::BIGINT,
        'manual_' || usuario.user_id::TEXT,
        'manual',
        0, -- Gratuito
        'brl',
        'active',
        period_start,
        period_end,
        false
      )
      RETURNING id INTO subscription_id;
      
      RAISE NOTICE '   ✅ Nova assinatura criada (ID: %) válida até %', subscription_id, period_end;
    END IF;
    
    -- Garantir que o perfil está correto
    INSERT INTO user_profiles (
      user_id,
      email,
      nome_completo,
      perfil,
      created_at,
      updated_at
    )
    VALUES (
      usuario.user_id,
      usuario.email,
      usuario.nome,
      'coach',
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      perfil = 'coach',
      updated_at = NOW();
    
    RAISE NOTICE '   ✅ Perfil atualizado';
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Processo concluído!';
END $$;

-- =====================================================
-- 3. VERIFICAR RESULTADO FINAL
-- =====================================================
SELECT 
  u.email,
  up.nome_completo,
  s.id as subscription_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.current_period_end - NOW() as dias_restantes,
  CASE 
    WHEN s.current_period_end > NOW() THEN '✅ Ativa'
    ELSE '❌ Expirada'
  END as status_final
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.area = 'coach'
WHERE u.email IN (
  'amandabonfogo01@gmail.com',
  'naytenutri@gmail.com',
  'deisefaula@gmail.com'
)
ORDER BY u.email;

