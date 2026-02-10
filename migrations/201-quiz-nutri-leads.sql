-- ============================================
-- MIGRATION 201: Tabela de leads do Quiz Nutri Carreira
-- ============================================
-- Uso: quiz de autossegmentação para nutricionistas (diagnóstico + CTA para vídeo Ilada Nutri).
-- Doc: docs/quiz-nutri-carreira-arquitetura.md
-- ============================================

CREATE TABLE IF NOT EXISTS quiz_nutri_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contato (captura antes do resultado)
  nome TEXT,
  email TEXT NOT NULL,
  telefone TEXT,

  -- Segmento (resposta da pergunta 1)
  grupo TEXT NOT NULL CHECK (grupo IN (
    'recem_formada',
    'agenda_instavel',
    'sobrecarregada',
    'financeiro_travado',
    'confusa'
  )),

  -- Respostas completas do quiz (para personalização e analytics)
  respostas JSONB DEFAULT '{}',

  -- Origem
  source TEXT DEFAULT 'quiz_carreira',

  -- Rastreamento
  ip_address TEXT,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_nutri_leads_email ON quiz_nutri_leads(email);
CREATE INDEX IF NOT EXISTS idx_quiz_nutri_leads_grupo ON quiz_nutri_leads(grupo);
CREATE INDEX IF NOT EXISTS idx_quiz_nutri_leads_created_at ON quiz_nutri_leads(created_at DESC);

CREATE OR REPLACE FUNCTION update_quiz_nutri_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_quiz_nutri_leads_updated_at ON quiz_nutri_leads;
CREATE TRIGGER trigger_update_quiz_nutri_leads_updated_at
  BEFORE UPDATE ON quiz_nutri_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_nutri_leads_updated_at();

COMMENT ON TABLE quiz_nutri_leads IS 'Leads do quiz Nutri Carreira (autossegmentação → diagnóstico → vídeo Ilada Nutri)';
