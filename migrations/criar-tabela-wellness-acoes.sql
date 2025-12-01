-- =====================================================
-- YLADA WELLNESS SYSTEM - Tabela de Ações do Distribuidor
-- =====================================================
-- Armazena ações realizadas pelo distribuidor para gerar
-- notificações e lembretes contextuais

CREATE TABLE IF NOT EXISTS wellness_acoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tipo de ação realizada
  acao_tipo VARCHAR(100) NOT NULL, -- 'gerou_link', 'visualizou_fluxo', 'copiou_script', 'enviou_link', etc.
  
  -- Dados da ação
  acao_descricao VARCHAR(255) NOT NULL, -- Descrição legível da ação
  acao_metadata JSONB, -- Dados adicionais (ex: qual fluxo, qual script, etc.)
  
  -- Contexto
  pagina VARCHAR(255), -- Página onde a ação foi realizada
  rota VARCHAR(500), -- Rota completa
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_wellness_acoes_user_id ON wellness_acoes(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_acoes_acao_tipo ON wellness_acoes(acao_tipo);
CREATE INDEX IF NOT EXISTS idx_wellness_acoes_created_at ON wellness_acoes(created_at);
CREATE INDEX IF NOT EXISTS idx_wellness_acoes_user_created ON wellness_acoes(user_id, created_at DESC);

-- Índice GIN para busca em JSONB
CREATE INDEX IF NOT EXISTS idx_wellness_acoes_metadata ON wellness_acoes USING GIN (acao_metadata);

-- Comentários para documentação
COMMENT ON TABLE wellness_acoes IS 'Armazena ações realizadas pelo distribuidor no Wellness System';
COMMENT ON COLUMN wellness_acoes.acao_tipo IS 'Tipo da ação: gerou_link, visualizou_fluxo, copiou_script, etc.';
COMMENT ON COLUMN wellness_acoes.acao_metadata IS 'Dados adicionais da ação em formato JSON';

