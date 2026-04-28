-- =====================================================
-- Fernanda (clinicaesteticfer@gmail.com): remover assinatura duplicada em `ylada`.
-- Usa só Pro Estética + perfil estética → uma linha em `subscriptions` com area = estetica.
-- Idempotente (DELETE sem erro se já não existir).
-- =====================================================

DELETE FROM subscriptions s
USING user_profiles up
WHERE s.user_id = up.user_id
  AND lower(trim(up.email)) = lower(trim('clinicaesteticfer@gmail.com'))
  AND s.area = 'ylada';
