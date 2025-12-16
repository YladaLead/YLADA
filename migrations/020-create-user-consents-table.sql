-- =====================================================
-- MIGRAÇÃO 020: Criar Tabela de Consentimentos (LGPD/GDPR)
-- =====================================================
-- Objetivo: Registrar consentimentos dos usuários para
-- conformidade com LGPD e GDPR
-- =====================================================

-- Tabela para registro de consentimentos
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type VARCHAR(50) NOT NULL, -- 'privacy_policy', 'terms_of_use', 'cookies', 'marketing', 'analytics'
  version VARCHAR(20) NOT NULL DEFAULT '1.0', -- Versão do documento aceito
  granted BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45), -- Para auditoria
  user_agent TEXT, -- Para auditoria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_consent_type ON user_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_user_consents_granted ON user_consents(granted);
CREATE INDEX IF NOT EXISTS idx_user_consents_user_consent ON user_consents(user_id, consent_type, granted);

-- RLS: Usuários só veem seus próprios consentimentos
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

-- Política: Usuário pode ver apenas seus próprios consentimentos
DROP POLICY IF EXISTS "Users can view own consents" ON user_consents;
CREATE POLICY "Users can view own consents"
ON user_consents FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuário pode inserir apenas seus próprios consentimentos
DROP POLICY IF EXISTS "Users can insert own consents" ON user_consents;
CREATE POLICY "Users can insert own consents"
ON user_consents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuário pode atualizar apenas seus próprios consentimentos
DROP POLICY IF EXISTS "Users can update own consents" ON user_consents;
CREATE POLICY "Users can update own consents"
ON user_consents FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Admin pode ver todos os consentimentos
DROP POLICY IF EXISTS "Admins can view all consents" ON user_consents;
CREATE POLICY "Admins can view all consents"
ON user_consents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_user_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_user_consents_updated_at_trigger ON user_consents;
CREATE TRIGGER update_user_consents_updated_at_trigger
  BEFORE UPDATE ON user_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_user_consents_updated_at();

-- Comentários para documentação
COMMENT ON TABLE user_consents IS 'Registro de consentimentos dos usuários para conformidade LGPD/GDPR';
COMMENT ON COLUMN user_consents.consent_type IS 'Tipo de consentimento: privacy_policy, terms_of_use, cookies, marketing, analytics';
COMMENT ON COLUMN user_consents.version IS 'Versão do documento aceito (ex: 1.0, 2.0)';
COMMENT ON COLUMN user_consents.granted IS 'Se o consentimento foi concedido (true) ou revogado (false)';
COMMENT ON COLUMN user_consents.ip_address IS 'IP do usuário no momento do consentimento (para auditoria)';
COMMENT ON COLUMN user_consents.user_agent IS 'User agent do navegador (para auditoria)';














