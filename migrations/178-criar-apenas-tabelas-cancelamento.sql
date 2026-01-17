-- =====================================================
-- CRIAR APENAS AS TABELAS DE CANCELAMENTO
-- (Os campos em subscriptions já existem)
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. TABELA: cancel_attempts
-- =====================================================
CREATE TABLE IF NOT EXISTS cancel_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  
  cancel_reason VARCHAR(50) NOT NULL CHECK (cancel_reason IN (
    'no_time',
    'didnt_understand',
    'no_value',
    'forgot_trial',
    'too_expensive',
    'found_alternative',
    'other'
  )),
  cancel_reason_other TEXT,
  
  retention_offered VARCHAR(50) CHECK (retention_offered IN (
    'extend_trial',
    'guided_tour',
    'show_feature',
    'pause_subscription'
  )),
  retention_accepted BOOLEAN DEFAULT false,
  retention_action_taken VARCHAR(50),
  
  final_action VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (final_action IN (
    'canceled',
    'retained',
    'pending'
  )),
  
  days_since_purchase INTEGER,
  within_guarantee BOOLEAN DEFAULT false,
  request_refund BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  canceled_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_user_id ON cancel_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_subscription_id ON cancel_attempts(subscription_id);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_final_action ON cancel_attempts(final_action);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_created_at ON cancel_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_cancel_reason ON cancel_attempts(cancel_reason);

-- =====================================================
-- 2. TABELA: trial_extensions
-- =====================================================
CREATE TABLE IF NOT EXISTS trial_extensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  cancel_attempt_id UUID REFERENCES cancel_attempts(id) ON DELETE SET NULL,
  
  extension_days INTEGER NOT NULL DEFAULT 7,
  original_expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  new_expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_trial_extensions_user_id ON trial_extensions(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_extensions_subscription_id ON trial_extensions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_trial_extensions_status ON trial_extensions(status);
CREATE INDEX IF NOT EXISTS idx_trial_extensions_cancel_attempt_id ON trial_extensions(cancel_attempt_id);

-- =====================================================
-- 3. RLS (Row Level Security)
-- =====================================================
ALTER TABLE cancel_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_extensions ENABLE ROW LEVEL SECURITY;

-- Políticas para cancel_attempts
DROP POLICY IF EXISTS "Users can view their own cancel attempts" ON cancel_attempts;
CREATE POLICY "Users can view their own cancel attempts"
ON cancel_attempts FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own cancel attempts" ON cancel_attempts;
CREATE POLICY "Users can create their own cancel attempts"
ON cancel_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cancel attempts" ON cancel_attempts;
CREATE POLICY "Users can update their own cancel attempts"
ON cancel_attempts FOR UPDATE
USING (auth.uid() = user_id);

-- Políticas para trial_extensions
DROP POLICY IF EXISTS "Users can view their own trial extensions" ON trial_extensions;
CREATE POLICY "Users can view their own trial extensions"
ON trial_extensions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own trial extensions" ON trial_extensions;
CREATE POLICY "Users can create their own trial extensions"
ON trial_extensions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 4. TRIGGER para updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cancel_attempts_updated_at ON cancel_attempts;
CREATE TRIGGER update_cancel_attempts_updated_at
BEFORE UPDATE ON cancel_attempts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ✅ CONCLUÍDO
-- =====================================================
-- Verificar se foi criado:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
--   AND table_name IN ('cancel_attempts', 'trial_extensions');
