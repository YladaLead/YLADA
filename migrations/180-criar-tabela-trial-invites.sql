-- ============================================
-- MIGRATION: Criar tabela trial_invites
-- Descrição: Armazena links de convite para trial de 3 dias
-- ============================================

CREATE TABLE IF NOT EXISTS trial_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Token único do link (usado na URL)
  token TEXT NOT NULL UNIQUE,
  
  -- Dados pré-preenchidos do convite
  nome_completo TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT,
  
  -- Dados do criador do convite
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by_email TEXT,
  
  -- Status e controle
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'used', 'expired', 'cancelled'
  used_at TIMESTAMPTZ,
  used_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Expiração
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_trial_invites_token ON trial_invites(token);
CREATE INDEX IF NOT EXISTS idx_trial_invites_email ON trial_invites(email);
CREATE INDEX IF NOT EXISTS idx_trial_invites_status ON trial_invites(status);
CREATE INDEX IF NOT EXISTS idx_trial_invites_created_by ON trial_invites(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_trial_invites_expires_at ON trial_invites(expires_at);

-- RLS (Row Level Security)
ALTER TABLE trial_invites ENABLE ROW LEVEL SECURITY;

-- Política: Apenas admins podem ver todos os convites
CREATE POLICY "Admins can view all trial invites"
  ON trial_invites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Política: Criador do convite pode ver seus próprios convites
CREATE POLICY "Users can view their own trial invites"
  ON trial_invites
  FOR SELECT
  USING (created_by_user_id = auth.uid());

-- Política: Apenas admins podem criar convites (via API com service role)
-- A criação será feita via API com service role, então não precisa de política INSERT

-- Comentários
COMMENT ON TABLE trial_invites IS 'Armazena links de convite para trial de 3 dias gratuitos';
COMMENT ON COLUMN trial_invites.token IS 'Token único usado na URL do convite';
COMMENT ON COLUMN trial_invites.status IS 'Status: pending (aguardando uso), used (já foi usado), expired (expirado), cancelled (cancelado)';
COMMENT ON COLUMN trial_invites.expires_at IS 'Data de expiração do link (padrão: 7 dias após criação)';
