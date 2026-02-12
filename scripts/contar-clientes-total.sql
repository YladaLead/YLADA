-- =====================================================
-- Total de clientes (assinaturas ativas)
-- Rodar no Supabase SQL Editor para ver os números.
-- =====================================================

-- 1) TOTAL GERAL (pessoas com pelo menos 1 assinatura ativa)
SELECT
  COUNT(DISTINCT user_id) AS total_clientes,
  COUNT(*) AS total_assinaturas_ativas
FROM subscriptions
WHERE status = 'active'
  AND current_period_end > NOW();

-- 2) POR ÁREA (clientes e quantidade de assinaturas)
SELECT
  area,
  COUNT(DISTINCT user_id) AS clientes,
  COUNT(*) AS assinaturas
FROM subscriptions
WHERE status = 'active'
  AND current_period_end > NOW()
GROUP BY area
ORDER BY area;

-- 3) RESUMO ÚNICO (uma linha com totais)
SELECT
  (SELECT COUNT(DISTINCT user_id) FROM subscriptions WHERE status = 'active' AND current_period_end > NOW()) AS total_clientes,
  (SELECT COUNT(DISTINCT user_id) FROM subscriptions WHERE status = 'active' AND current_period_end > NOW() AND area = 'nutri') AS nutri,
  (SELECT COUNT(DISTINCT user_id) FROM subscriptions WHERE status = 'active' AND current_period_end > NOW() AND area = 'wellness') AS wellness,
  (SELECT COUNT(DISTINCT user_id) FROM subscriptions WHERE status = 'active' AND current_period_end > NOW() AND area = 'coach') AS coach,
  (SELECT COUNT(DISTINCT user_id) FROM subscriptions WHERE status = 'active' AND current_period_end > NOW() AND area = 'nutra') AS nutra;
