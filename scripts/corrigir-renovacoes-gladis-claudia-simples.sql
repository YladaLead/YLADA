-- =====================================================
-- CORREÇÃO SIMPLES: ESTENDER VENCIMENTO +30 DIAS
-- =====================================================
-- Versão simplificada - apenas os comandos UPDATE
-- Execute as queries de verificação primeiro para confirmar os IDs

-- =====================================================
-- GLADIS - Estender vencimento em 30 dias
-- =====================================================
UPDATE subscriptions
SET 
  current_period_end = current_period_end + INTERVAL '30 days',
  current_period_start = NOW(),
  updated_at = NOW()
WHERE id = (
  SELECT s.id
  FROM subscriptions s
  INNER JOIN auth.users u ON u.id = s.user_id
  WHERE u.email = 'gladisgordaliza@gmail.com'
    AND s.status = 'active'
  ORDER BY s.current_period_end DESC
  LIMIT 1
);

-- =====================================================
-- CLAUDIA VITTO - Estender vencimento em 30 dias
-- =====================================================
UPDATE subscriptions
SET 
  current_period_end = current_period_end + INTERVAL '30 days',
  current_period_start = NOW(),
  updated_at = NOW()
WHERE id = (
  SELECT s.id
  FROM subscriptions s
  INNER JOIN auth.users u ON u.id = s.user_id
  WHERE u.email = 'claudiavitto@hotmail.com'
    AND s.status = 'active'
  ORDER BY s.current_period_end DESC
  LIMIT 1
);

