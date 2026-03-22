-- =====================================================
-- Normalizar status = 'active' onde a vigência ainda não passou
-- =====================================================
-- Objetivo: linhas com current_period_end > agora e status diferente de active
-- (ex.: past_due antigo), **exceto** canceladas de propósito (canceled).
--
-- Rode primeiro o SELECT de prévia; só depois descomente o UPDATE.
--
-- Não substitui regras de negócio no app: é ajuste pontual de dados legados.
-- =====================================================

-- Prévia: contagem por status entre assinaturas “ainda dentro da vigência”
SELECT s.status, COUNT(*)::bigint AS qtd
FROM subscriptions s
WHERE s.current_period_end IS NOT NULL
  AND s.current_period_end > NOW()
GROUP BY s.status
ORDER BY qtd DESC;

-- Detalhe (opcional): linhas que o UPDATE abaixo alteraria
/*
SELECT s.id, s.user_id, s.area, s.plan_type, s.status, s.current_period_end
FROM subscriptions s
WHERE s.current_period_end IS NOT NULL
  AND s.current_period_end > NOW()
  AND s.status IS DISTINCT FROM 'active'
  AND s.status IS DISTINCT FROM 'canceled'
ORDER BY s.updated_at DESC NULLS LAST
LIMIT 200;
*/

-- Aplicar (descomente para executar)
/*
UPDATE subscriptions s
SET
  status = 'active',
  updated_at = NOW()
WHERE s.current_period_end IS NOT NULL
  AND s.current_period_end > NOW()
  AND s.status IS DISTINCT FROM 'active'
  AND s.status IS DISTINCT FROM 'canceled'
RETURNING s.id, s.user_id, s.area, s.plan_type, s.status;
*/
