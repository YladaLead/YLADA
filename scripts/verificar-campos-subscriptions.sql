-- =====================================================
-- VERIFICAR CAMPOS OBRIGATÓRIOS DA TABELA subscriptions
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- Verificar quais colunas são NOT NULL
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'subscriptions'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar constraints NOT NULL específicas
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
  AND contype = 'c'  -- Check constraints
ORDER BY conname;

-- Verificar se campos Stripe são opcionais (devem ser NULL para planos gratuitos)
SELECT 
  CASE 
    WHEN is_nullable = 'YES' THEN '✅ Opcional (pode ser NULL)'
    ELSE '❌ Obrigatório (NÃO pode ser NULL)'
  END as status,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'subscriptions'
  AND table_schema = 'public'
  AND column_name IN (
    'stripe_account',
    'stripe_subscription_id',
    'stripe_customer_id',
    'stripe_price_id'
  )
ORDER BY column_name;









