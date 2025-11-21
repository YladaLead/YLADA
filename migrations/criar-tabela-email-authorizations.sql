-- =====================================================
-- TABELA: email_authorizations
-- Autorizações pendentes por email (antes do cadastro)
-- =====================================================

CREATE TABLE IF NOT EXISTS email_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Email autorizado
  email VARCHAR(255) NOT NULL,
  
  -- Área e período
  area VARCHAR(50) NOT NULL CHECK (area IN ('wellness', 'nutri', 'coach', 'nutra')),
  expires_in_days INTEGER NOT NULL DEFAULT 365, -- Dias de validade
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'activated', 'expired', 'cancelled')),
  
  -- Quando foi ativada (se já foi)
  activated_at TIMESTAMP WITH TIME ZONE,
  activated_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Informações do criador
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT, -- Notas opcionais do admin
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_email_authorizations_email ON email_authorizations(email);
CREATE INDEX IF NOT EXISTS idx_email_authorizations_area ON email_authorizations(area);
CREATE INDEX IF NOT EXISTS idx_email_authorizations_status ON email_authorizations(status);
CREATE INDEX IF NOT EXISTS idx_email_authorizations_activated_user_id ON email_authorizations(activated_user_id);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_email_authorizations_updated_at ON email_authorizations;
CREATE TRIGGER update_email_authorizations_updated_at
  BEFORE UPDATE ON email_authorizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (apenas admin pode ver/criar)
ALTER TABLE email_authorizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all authorizations" ON email_authorizations;
CREATE POLICY "Admins can view all authorizations"
  ON email_authorizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND (user_profiles.is_admin = true OR user_profiles.is_support = true)
    )
  );

DROP POLICY IF EXISTS "Admins can insert authorizations" ON email_authorizations;
CREATE POLICY "Admins can insert authorizations"
  ON email_authorizations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND (user_profiles.is_admin = true OR user_profiles.is_support = true)
    )
  );

DROP POLICY IF EXISTS "Admins can update authorizations" ON email_authorizations;
CREATE POLICY "Admins can update authorizations"
  ON email_authorizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND (user_profiles.is_admin = true OR user_profiles.is_support = true)
    )
  );

-- Comentários
COMMENT ON TABLE email_authorizations IS 'Autorizações pendentes por email - ativadas automaticamente quando usuário se cadastra';
COMMENT ON COLUMN email_authorizations.email IS 'Email que será autorizado (case-insensitive)';
COMMENT ON COLUMN email_authorizations.expires_in_days IS 'Dias de validade da assinatura quando ativada';
COMMENT ON COLUMN email_authorizations.status IS 'pending: aguardando cadastro, activated: já foi usada, expired: expirada, cancelled: cancelada';

