-- ============================================
-- TABELA: Progresso 2-5-10
-- Armazena o progresso diário do método 2-5-10
-- ============================================

CREATE TABLE IF NOT EXISTS wellness_progresso_2510 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  convites INTEGER DEFAULT 0,
  follow_ups INTEGER DEFAULT 0,
  contatos_novos INTEGER DEFAULT 0,
  completo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_progresso_2510_user ON wellness_progresso_2510(user_id);
CREATE INDEX IF NOT EXISTS idx_progresso_2510_data ON wellness_progresso_2510(data DESC);
CREATE INDEX IF NOT EXISTS idx_progresso_2510_user_data ON wellness_progresso_2510(user_id, data DESC);

-- Comentários
COMMENT ON TABLE wellness_progresso_2510 IS 'Progresso diário do método 2-5-10';
COMMENT ON COLUMN wellness_progresso_2510.data IS 'Data do progresso (sem hora, apenas data)';
COMMENT ON COLUMN wellness_progresso_2510.completo IS 'Se completou 2 convites, 5 follow-ups e 10 contatos no dia';
