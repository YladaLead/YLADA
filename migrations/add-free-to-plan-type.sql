-- =====================================================
-- ADICIONAR 'free' AO CHECK CONSTRAINT DE plan_type
-- =====================================================

-- Remover constraint antiga
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Adicionar nova constraint que inclui 'free'
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('monthly', 'annual', 'free'));

-- Verificar se foi aplicado
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
  AND conname = 'subscriptions_plan_type_check';

