-- =====================================================
-- DIAGNÓSTICO: Quem está contando como cliente na área NUTRI
-- Apenas leitura (SELECT). Não altera nada.
--
-- Lista esperada (informada por você):
-- 1. Jessica
-- 2. Doutora Gláucia Melo
-- 3. Doutora Cynthia Campos
-- 4. Paula Rodrigues
-- 5. Paula Moreira (parceira)
-- =====================================================

-- 1) Total de assinaturas ativas na área nutri
SELECT
  COUNT(*) AS total_assinaturas_ativas,
  COUNT(DISTINCT user_id) AS total_pessoas_contadas_como_clientes
FROM subscriptions
WHERE area = 'nutri'
  AND status = 'active'
  AND current_period_end > NOW();

-- 2) Lista completa: quem está com assinatura ativa em nutri (nome, email, plano, vencimento)
SELECT
  s.id AS subscription_id,
  s.user_id,
  up.nome_completo,
  up.email AS email_perfil,
  au.email AS email_auth,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.created_at AS assinatura_criada_em
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
LEFT JOIN auth.users au ON au.id = s.user_id
WHERE s.area = 'nutri'
  AND s.status = 'active'
  AND s.current_period_end > NOW()
ORDER BY up.nome_completo NULLS LAST, s.created_at;

-- 3) Perfis com perfil = 'nutri' que NÃO têm assinatura ativa (só para conferência)
-- (podem ser ex-clientes, testes ou cadastros sem pagamento)
-- SELECT
--   up.user_id,
--   up.nome_completo,
--   up.email
-- FROM user_profiles up
-- WHERE up.perfil = 'nutri'
--   AND NOT EXISTS (
--     SELECT 1 FROM subscriptions s
--     WHERE s.user_id = up.user_id
--       AND s.area = 'nutri'
--       AND s.status = 'active'
--       AND s.current_period_end > NOW()
--   )
-- ORDER BY up.nome_completo;
