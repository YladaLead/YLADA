-- =====================================================
-- YLADA - SCHEMA PARA ASSINATURAS E PAGAMENTOS
-- Suporta Stripe BR e US com múltiplas áreas
-- =====================================================

-- =====================================================
-- TABELA: subscriptions
-- Armazena assinaturas dos usuários
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identificação da área e plano
  area VARCHAR(50) NOT NULL CHECK (area IN ('wellness', 'nutri', 'coach', 'nutra')),
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('monthly', 'annual')),
  
  -- Informações Stripe
  stripe_account VARCHAR(10) NOT NULL CHECK (stripe_account IN ('br', 'us')),
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_price_id VARCHAR(255) NOT NULL,
  
  -- Informações financeiras
  amount INTEGER NOT NULL, -- Valor em centavos
  currency VARCHAR(3) DEFAULT 'usd',
  
  -- Status e datas
  status VARCHAR(50) NOT NULL DEFAULT 'active', 
    -- 'active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete'
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_area ON subscriptions(area);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);

-- =====================================================
-- TABELA: payments
-- Histórico de pagamentos
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações Stripe
  stripe_account VARCHAR(10) NOT NULL CHECK (stripe_account IN ('br', 'us')),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_invoice_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  
  -- Informações financeiras
  amount INTEGER NOT NULL, -- Valor em centavos
  currency VARCHAR(3) DEFAULT 'usd',
  amount_refunded INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(50) NOT NULL,
    -- 'succeeded', 'pending', 'failed', 'refunded', 'partially_refunded'
  
  -- Informações adicionais
  receipt_url TEXT,
  payment_method VARCHAR(50), -- 'card', 'bank_transfer', etc
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- =====================================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS (Row Level Security) Policies
-- =====================================================

-- Habilitar RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies para subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies para payments
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin pode ver tudo (via service_role)
-- Nota: Admin acessa via supabaseAdmin que bypassa RLS

-- =====================================================
-- FUNÇÃO: Verificar se usuário tem assinatura ativa
-- =====================================================
CREATE OR REPLACE FUNCTION has_active_subscription(
  p_user_id UUID,
  p_area VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM subscriptions
  WHERE user_id = p_user_id
    AND area = p_area
    AND status = 'active'
    AND current_period_end > NOW();
  
  RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO: Obter assinatura ativa do usuário
-- =====================================================
CREATE OR REPLACE FUNCTION get_active_subscription(
  p_user_id UUID,
  p_area VARCHAR(50)
)
RETURNS TABLE (
  id UUID,
  area VARCHAR(50),
  plan_type VARCHAR(20),
  status VARCHAR(50),
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_account VARCHAR(10)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.area,
    s.plan_type,
    s.status,
    s.current_period_end,
    s.stripe_account
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.area = p_area
    AND s.status = 'active'
    AND s.current_period_end > NOW()
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================
COMMENT ON TABLE subscriptions IS 'Armazena assinaturas dos usuários com suporte a Stripe BR e US';
COMMENT ON COLUMN subscriptions.stripe_account IS 'Conta Stripe usada: br ou us';
COMMENT ON COLUMN subscriptions.amount IS 'Valor em centavos (ex: 6000 = R$ 60.00)';
COMMENT ON COLUMN subscriptions.status IS 'Status da assinatura: active, canceled, past_due, unpaid, trialing, incomplete';

COMMENT ON TABLE payments IS 'Histórico de pagamentos das assinaturas';
COMMENT ON COLUMN payments.amount IS 'Valor em centavos';
COMMENT ON COLUMN payments.status IS 'Status do pagamento: succeeded, pending, failed, refunded, partially_refunded';

