-- =====================================================
-- CRIAR TABELA workshop_inscricoes + coluna participacao_aula
-- Execute este script no Supabase SQL Editor (uma vez).
-- Resolve: relation "workshop_inscricoes" does not exist
-- =====================================================

-- 1) Criar tabela workshop_inscricoes (se não existir)
CREATE TABLE IF NOT EXISTS workshop_inscricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  crn TEXT,
  source TEXT DEFAULT 'workshop_landing_page',
  workshop_type TEXT DEFAULT 'nutri_semanal',
  status TEXT DEFAULT 'inscrito' CHECK (status IN ('inscrito', 'confirmado', 'participou', 'cancelado')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_email ON workshop_inscricoes(email);
CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_telefone ON workshop_inscricoes(telefone);
CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_status ON workshop_inscricoes(status);
CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_workshop_type ON workshop_inscricoes(workshop_type);
CREATE INDEX IF NOT EXISTS idx_workshop_inscricoes_created_at ON workshop_inscricoes(created_at DESC);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_workshop_inscricoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_workshop_inscricoes_updated_at ON workshop_inscricoes;
CREATE TRIGGER trigger_update_workshop_inscricoes_updated_at
  BEFORE UPDATE ON workshop_inscricoes
  FOR EACH ROW
  EXECUTE FUNCTION update_workshop_inscricoes_updated_at();

-- 2) Coluna de participação na aula paga (admin: participou / não participou)
ALTER TABLE workshop_inscricoes
ADD COLUMN IF NOT EXISTS participacao_aula text CHECK (participacao_aula IS NULL OR participacao_aula IN ('participou', 'nao_participou'));

COMMENT ON TABLE workshop_inscricoes IS 'Inscrições workshop (aula gratuita e aula paga Agenda Cheia)';
COMMENT ON COLUMN workshop_inscricoes.participacao_aula IS 'Aula paga: participou | nao_participou. Null = não marcado.';
