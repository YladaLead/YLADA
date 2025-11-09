-- =====================================================
-- ATUALIZAR TABELAS PARA SUPORTAR MERCADO PAGO
-- =====================================================

-- =====================================================
-- ATUALIZAR TABELA: subscriptions
-- =====================================================

-- Adicionar campo gateway (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'gateway'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN gateway VARCHAR(20) DEFAULT 'stripe';
  END IF;
END $$;

-- Tornar campos Stripe opcionais e adicionar campos genéricos
ALTER TABLE subscriptions 
  ALTER COLUMN stripe_account DROP NOT NULL,
  ALTER COLUMN stripe_subscription_id DROP NOT NULL,
  ALTER COLUMN stripe_customer_id DROP NOT NULL,
  ALTER COLUMN stripe_price_id DROP NOT NULL;

-- Adicionar campos genéricos para gateway
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'gateway_subscription_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN gateway_subscription_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'gateway_customer_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN gateway_customer_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'gateway_price_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN gateway_price_id VARCHAR(255);
  END IF;
END $$;

-- Migrar dados existentes do Stripe para campos genéricos
UPDATE subscriptions 
SET 
  gateway = 'stripe',
  gateway_subscription_id = stripe_subscription_id,
  gateway_customer_id = stripe_customer_id,
  gateway_price_id = stripe_price_id
WHERE gateway_subscription_id IS NULL;

-- Criar índice único para gateway_subscription_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_gateway_subscription_id 
ON subscriptions(gateway_subscription_id) 
WHERE gateway_subscription_id IS NOT NULL;

-- Atualizar constraint do stripe_account para aceitar NULL
ALTER TABLE subscriptions 
  DROP CONSTRAINT IF EXISTS subscriptions_stripe_account_check;

ALTER TABLE subscriptions 
  ADD CONSTRAINT subscriptions_stripe_account_check 
  CHECK (stripe_account IS NULL OR stripe_account IN ('br', 'us'));

-- =====================================================
-- ATUALIZAR TABELA: payments
-- =====================================================

-- Adicionar campo gateway (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'gateway'
  ) THEN
    ALTER TABLE payments ADD COLUMN gateway VARCHAR(20) DEFAULT 'stripe';
  END IF;
END $$;

-- Tornar campos Stripe opcionais
ALTER TABLE payments 
  ALTER COLUMN stripe_account DROP NOT NULL;

-- Adicionar campos genéricos para gateway
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'gateway_payment_intent_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN gateway_payment_intent_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'gateway_invoice_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN gateway_invoice_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'gateway_charge_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN gateway_charge_id VARCHAR(255);
  END IF;
END $$;

-- Migrar dados existentes do Stripe para campos genéricos
UPDATE payments 
SET 
  gateway = 'stripe',
  gateway_payment_intent_id = stripe_payment_intent_id,
  gateway_invoice_id = stripe_invoice_id,
  gateway_charge_id = stripe_charge_id
WHERE gateway_payment_intent_id IS NULL;

-- Criar índice único para gateway_payment_intent_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_gateway_payment_intent_id 
ON payments(gateway_payment_intent_id) 
WHERE gateway_payment_intent_id IS NOT NULL;

-- Atualizar constraint do stripe_account para aceitar NULL
ALTER TABLE payments 
  DROP CONSTRAINT IF EXISTS payments_stripe_account_check;

ALTER TABLE payments 
  ADD CONSTRAINT payments_stripe_account_check 
  CHECK (stripe_account IS NULL OR stripe_account IN ('br', 'us'));

-- =====================================================
-- COMENTÁRIOS
-- =====================================================
COMMENT ON COLUMN subscriptions.gateway IS 'Gateway de pagamento: stripe ou mercadopago';
COMMENT ON COLUMN subscriptions.gateway_subscription_id IS 'ID da assinatura no gateway (stripe_subscription_id ou preference_id do MP)';
COMMENT ON COLUMN payments.gateway IS 'Gateway de pagamento: stripe ou mercadopago';
COMMENT ON COLUMN payments.gateway_payment_intent_id IS 'ID do pagamento no gateway (stripe_payment_intent_id ou payment_id do MP)';

