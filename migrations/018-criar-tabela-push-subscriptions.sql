-- ============================================
-- MIGRAÇÃO 018: Criar Tabela de Push Subscriptions
-- Data: 2025-01-27
-- Objetivo: Armazenar subscriptions de notificações push dos usuários
-- ============================================

-- TABELA: push_subscriptions
-- Armazena subscriptions de notificações push para cada usuário/dispositivo
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dados da subscription (Web Push API)
  endpoint TEXT NOT NULL, -- URL do serviço de push
  p256dh TEXT NOT NULL, -- Chave pública do cliente
  auth TEXT NOT NULL, -- Chave de autenticação do cliente
  
  -- Metadados
  user_agent TEXT, -- User agent do navegador
  device_info JSONB, -- Informações do dispositivo (opcional)
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: um endpoint por usuário (evita duplicatas)
  UNIQUE(user_id, endpoint)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_ativo ON push_subscriptions(ativo);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Comentários
COMMENT ON TABLE push_subscriptions IS 'Subscriptions de notificações push dos usuários';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'URL do serviço de push do navegador';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Chave pública do cliente (P-256)';
COMMENT ON COLUMN push_subscriptions.auth IS 'Chave de autenticação do cliente';
COMMENT ON COLUMN push_subscriptions.ativo IS 'Se a subscription está ativa';

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_push_subscriptions_updated_at ON push_subscriptions;

CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_push_subscriptions_updated_at();

-- RLS (Row Level Security)
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias subscriptions
DROP POLICY IF EXISTS "Users can view own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can view own push subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem inserir suas próprias subscriptions
DROP POLICY IF EXISTS "Users can insert own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can insert own push subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias subscriptions
DROP POLICY IF EXISTS "Users can update own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can update own push subscriptions"
  ON push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar suas próprias subscriptions
DROP POLICY IF EXISTS "Users can delete own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);
