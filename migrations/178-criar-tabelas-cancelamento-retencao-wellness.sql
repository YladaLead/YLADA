-- =====================================================
-- MIGRAÇÃO: SISTEMA DE RETENÇÃO ANTES DO CANCELAMENTO (WELLNESS)
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. TABELA: cancel_attempts (se não existir)
-- Registra todas as tentativas de cancelamento e retenções
-- =====================================================
CREATE TABLE IF NOT EXISTS cancel_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  
  -- Motivo do cancelamento
  cancel_reason VARCHAR(50) NOT NULL CHECK (cancel_reason IN (
    'no_time',
    'didnt_understand',
    'no_value',
    'forgot_trial',
    'too_expensive',
    'found_alternative',
    'other'
  )),
  cancel_reason_other TEXT, -- Se escolheu "other"
  
  -- Ações de retenção
  retention_offered VARCHAR(50) CHECK (retention_offered IN (
    'extend_trial',
    'guided_tour',
    'show_feature',
    'pause_subscription'
  )),
  retention_accepted BOOLEAN DEFAULT false,
  retention_action_taken VARCHAR(50), -- O que foi feito exatamente
  
  -- Resultado final
  final_action VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (final_action IN (
    'canceled',
    'retained',
    'pending'
  )),
  
  -- Informações adicionais
  days_since_purchase INTEGER,
  within_guarantee BOOLEAN DEFAULT false,
  request_refund BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  canceled_at TIMESTAMP WITH TIME ZONE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_user_id ON cancel_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_subscription_id ON cancel_attempts(subscription_id);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_final_action ON cancel_attempts(final_action);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_created_at ON cancel_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_cancel_reason ON cancel_attempts(cancel_reason);

-- =====================================================
-- 2. TABELA: trial_extensions (se não existir)
-- Registra extensões de trial oferecidas
-- =====================================================
CREATE TABLE IF NOT EXISTS trial_extensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  cancel_attempt_id UUID REFERENCES cancel_attempts(id) ON DELETE SET NULL,
  
  -- Detalhes da extensão
  extension_days INTEGER NOT NULL DEFAULT 7,
  original_expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  new_expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_trial_extensions_user_id ON trial_extensions(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_extensions_subscription_id ON trial_extensions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_trial_extensions_status ON trial_extensions(status);
CREATE INDEX IF NOT EXISTS idx_trial_extensions_cancel_attempt_id ON trial_extensions(cancel_attempt_id);

-- =====================================================
-- 3. ADICIONAR CAMPOS NA TABELA subscriptions
-- =====================================================
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS retention_offered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS retention_attempts_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS paused_until TIMESTAMP WITH TIME ZONE;

-- Índice para queries rápidas
CREATE INDEX IF NOT EXISTS idx_subscriptions_retention_offered_at ON subscriptions(retention_offered_at);

-- =====================================================
-- 4. RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE cancel_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_extensions ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios cancel_attempts
DROP POLICY IF EXISTS "Users can view their own cancel attempts" ON cancel_attempts;
CREATE POLICY "Users can view their own cancel attempts"
ON cancel_attempts
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuários podem criar seus próprios cancel_attempts
DROP POLICY IF EXISTS "Users can create their own cancel attempts" ON cancel_attempts;
CREATE POLICY "Users can create their own cancel attempts"
ON cancel_attempts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar seus próprios cancel_attempts
DROP POLICY IF EXISTS "Users can update their own cancel attempts" ON cancel_attempts;
CREATE POLICY "Users can update their own cancel attempts"
ON cancel_attempts
FOR UPDATE
USING (auth.uid() = user_id);

-- Política: Usuários podem ver suas próprias trial_extensions
DROP POLICY IF EXISTS "Users can view their own trial extensions" ON trial_extensions;
CREATE POLICY "Users can view their own trial extensions"
ON trial_extensions
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuários podem criar suas próprias trial_extensions
DROP POLICY IF EXISTS "Users can create their own trial extensions" ON trial_extensions;
CREATE POLICY "Users can create their own trial extensions"
ON trial_extensions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 5. TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at automaticamente
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
-- ✅ MIGRAÇÃO CONCLUÍDA
-- =====================================================
