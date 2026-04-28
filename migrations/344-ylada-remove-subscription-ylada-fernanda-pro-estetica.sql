-- =====================================================
-- Fernanda (clinicaesteticfer@gmail.com): remover linha `estetica` em subscriptions.
-- Pro Estética corporal → uma linha ativa em `area = 'ylada'` (ver migration 343).
-- Idempotente.
-- =====================================================

DELETE FROM subscriptions s
USING user_profiles up
WHERE s.user_id = up.user_id
  AND lower(trim(up.email)) = lower(trim('clinicaesteticfer@gmail.com'))
  AND s.area = 'estetica';
