-- ============================================
-- MIGRATION 176: Criar Tabela de Inscrições do Workshop
-- ============================================
-- Descrição: Cria a tabela para armazenar inscrições do workshop de nutricionistas
-- Data: 2025-01-27
-- ============================================

-- Criar tabela workshop_inscricoes
CREATE TABLE IF NOT EXISTS workshop_inscricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados do inscrito
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  crn TEXT, -- CRN (Conselho Regional de Nutricionistas) - opcional
  
  -- Metadados
  source TEXT DEFAULT 'workshop_landing_page',
  workshop_type TEXT DEFAULT 'nutri_semanal',
  status TEXT DEFAULT 'inscrito' CHECK (status IN ('inscrito', 'confirmado', 'participou', 'cancelado')),
  
  -- Rastreamento
  ip_address TEXT,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_email ON workshop_inscricoes(email);
CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_telefone ON workshop_inscricoes(telefone);
CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_status ON workshop_inscricoes(status);
CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_workshop_type ON workshop_inscricoes(workshop_type);
CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_created_at ON workshop_inscricoes(created_at DESC);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_workshop_inscricoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_workshop_inscricoes_updated_at
  BEFORE UPDATE ON workshop_inscricoes
  FOR EACH ROW
  EXECUTE FUNCTION update_workshop_inscricoes_updated_at();

-- Comentários nas colunas para documentação
COMMENT ON TABLE workshop_inscricoes IS 'Armazena inscrições de nutricionistas no workshop';
COMMENT ON COLUMN workshop_inscricoes.nome IS 'Nome completo do inscrito';
COMMENT ON COLUMN workshop_inscricoes.email IS 'Email do inscrito';
COMMENT ON COLUMN workshop_inscricoes.telefone IS 'Telefone/WhatsApp do inscrito (apenas números)';
COMMENT ON COLUMN workshop_inscricoes.crn IS 'CRN (Conselho Regional de Nutricionistas) - opcional';
COMMENT ON COLUMN workshop_inscricoes.source IS 'Origem da inscrição (ex: workshop_landing_page)';
COMMENT ON COLUMN workshop_inscricoes.workshop_type IS 'Tipo de workshop (ex: nutri_semanal)';
COMMENT ON COLUMN workshop_inscricoes.status IS 'Status da inscrição: inscrito, confirmado, participou, cancelado';

-- ============================================
-- FIM DA MIGRATION 176
-- ============================================

