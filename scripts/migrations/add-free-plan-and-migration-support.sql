-- =====================================================
-- ADICIONAR SUPORTE A PLANO GRATUITO E MIGRAÇÃO
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ATUALIZAR TABELA subscriptions
-- =====================================================

-- Adicionar suporte a plano gratuito no plan_type
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('monthly', 'annual', 'free'));

-- Adicionar campos para migração
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS is_migrated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS migrated_from VARCHAR(255),
ADD COLUMN IF NOT EXISTS migrated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS requires_manual_renewal BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_expiry_date TIMESTAMP WITH TIME ZONE;

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_migrated ON subscriptions(is_migrated);
CREATE INDEX IF NOT EXISTS idx_subscriptions_requires_manual_renewal ON subscriptions(requires_manual_renewal);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);

-- =====================================================
-- 2. CRIAR TABELA manual_renewals (OPCIONAL)
-- =====================================================

CREATE TABLE IF NOT EXISTS manual_renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL CHECK (area IN ('wellness', 'nutri', 'coach', 'nutra')),
  renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manual_renewals_subscription_id ON manual_renewals(subscription_id);
CREATE INDEX IF NOT EXISTS idx_manual_renewals_user_id ON manual_renewals(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_renewals_status ON manual_renewals(status);
CREATE INDEX IF NOT EXISTS idx_manual_renewals_renewal_date ON manual_renewals(renewal_date);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_manual_renewals_updated_at ON manual_renewals;
CREATE TRIGGER update_manual_renewals_updated_at
  BEFORE UPDATE ON manual_renewals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. ATUALIZAR FUNÇÃO has_active_subscription
-- =====================================================

-- A função já funciona, mas vamos garantir que está correta
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
-- 4. FUNÇÃO PARA VERIFICAR PLANO GRATUITO
-- =====================================================

CREATE OR REPLACE FUNCTION has_free_plan(
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
    AND plan_type = 'free'
    AND status = 'active'
    AND current_period_end > NOW();
  
  RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. FUNÇÃO PARA LISTAR ASSINATURAS QUE PRECISAM RENOVAÇÃO
-- =====================================================

CREATE OR REPLACE FUNCTION get_subscriptions_needing_renewal(
  p_days_ahead INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  area VARCHAR(50),
  plan_type VARCHAR(20),
  current_period_end TIMESTAMP WITH TIME ZONE,
  requires_manual_renewal BOOLEAN,
  migrated_from VARCHAR(255),
  days_until_expiry INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.area,
    s.plan_type,
    s.current_period_end,
    s.requires_manual_renewal,
    s.migrated_from,
    EXTRACT(DAY FROM (s.current_period_end - NOW()))::INTEGER as days_until_expiry
  FROM subscriptions s
  WHERE s.status = 'active'
    AND s.requires_manual_renewal = true
    AND s.current_period_end > NOW()
    AND s.current_period_end <= (NOW() + (p_days_ahead || ' days')::INTERVAL)
  ORDER BY s.current_period_end ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. RLS PARA manual_renewals
-- =====================================================

ALTER TABLE manual_renewals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own manual renewals" ON manual_renewals;
CREATE POLICY "Users can view their own manual renewals"
  ON manual_renewals FOR SELECT
  USING (auth.uid() = user_id);

-- Admin acessa via service_role (bypass RLS)

-- =====================================================
-- 7. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se campos foram adicionados
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'subscriptions'
  AND column_name IN ('is_migrated', 'migrated_from', 'requires_manual_renewal', 'original_expiry_date')
ORDER BY column_name;

-- Verificar se tabela manual_renewals foi criada
SELECT 
  'Tabela manual_renewals criada!' as status
FROM information_schema.tables
WHERE table_name = 'manual_renewals';

-- Verificar funções
SELECT 
  proname as function_name,
  'Função criada!' as status
FROM pg_proc
WHERE proname IN ('has_free_plan', 'get_subscriptions_needing_renewal')
ORDER BY proname;

