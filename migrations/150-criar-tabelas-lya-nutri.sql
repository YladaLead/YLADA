-- ============================================
-- MIGRATION: Criar tabelas para LYA Nutri
-- ============================================
-- Data: 2024
-- Descrição: Cria estrutura de dados para a mentora LYA na área Nutri
-- Baseado no DOSSIÊ LYA v1.0

-- ============================================
-- TABELA: lya_interactions
-- Armazena todas as interações da LYA com nutricionistas
-- ============================================
CREATE TABLE IF NOT EXISTS lya_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Mensagens
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  
  -- Compatibilidade (campos duplicados para facilitar queries)
  user_message TEXT,
  lya_response TEXT,
  
  -- Contexto detectado
  profile_detected TEXT CHECK (profile_detected IN ('iniciante_empresarial', 'consolidacao', 'avancada_desorganizada', 'estrategica')),
  state_detected TEXT CHECK (state_detected IN ('caotica', 'confusa', 'clara', 'acelerada')),
  flow_used TEXT CHECK (flow_used IN ('organizacao_inicial', 'postura_empresarial', 'posicionamento_estrategico', 'agenda_rotina', 'atracao_clientes', 'precificacao_ofertas', 'organizacao_financeira', 'crescimento_sustentavel')),
  cycle_used TEXT CHECK (cycle_used IN ('diario', 'semanal', 'mensal')),
  
  -- Metadados
  link_used BOOLEAN DEFAULT FALSE,
  violation_attempt BOOLEAN DEFAULT FALSE,
  thread_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_lya_interactions_user_id ON lya_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_lya_interactions_created_at ON lya_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lya_interactions_thread_id ON lya_interactions(thread_id);

-- ============================================
-- TABELA: lya_context
-- Armazena contexto persistente da nutricionista
-- ============================================
CREATE TABLE IF NOT EXISTS lya_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Classificações
  profile TEXT CHECK (profile IN ('iniciante_empresarial', 'consolidacao', 'avancada_desorganizada', 'estrategica')),
  state TEXT CHECK (state IN ('caotica', 'confusa', 'clara', 'acelerada')),
  active_flow TEXT CHECK (active_flow IN ('organizacao_inicial', 'postura_empresarial', 'posicionamento_estrategico', 'agenda_rotina', 'atracao_clientes', 'precificacao_ofertas', 'organizacao_financeira', 'crescimento_sustentavel')),
  cycle TEXT CHECK (cycle IN ('diario', 'semanal', 'mensal')),
  
  -- Metadados adicionais
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_lya_context_user_id ON lya_context(user_id);
CREATE INDEX IF NOT EXISTS idx_lya_context_profile ON lya_context(profile);
CREATE INDEX IF NOT EXISTS idx_lya_context_active_flow ON lya_context(active_flow);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE lya_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lya_context ENABLE ROW LEVEL SECURITY;

-- Políticas para lya_interactions
CREATE POLICY "Users can view their own interactions"
  ON lya_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON lya_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para lya_context
CREATE POLICY "Users can view their own context"
  ON lya_context FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own context"
  ON lya_context FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own context"
  ON lya_context FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_lya_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_lya_interactions_updated_at
  BEFORE UPDATE ON lya_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_lya_updated_at();

CREATE TRIGGER update_lya_context_updated_at
  BEFORE UPDATE ON lya_context
  FOR EACH ROW
  EXECUTE FUNCTION update_lya_updated_at();

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE lya_interactions IS 'Armazena todas as interações da LYA com nutricionistas';
COMMENT ON TABLE lya_context IS 'Armazena contexto persistente da nutricionista para personalização da LYA';

COMMENT ON COLUMN lya_interactions.profile_detected IS 'Perfil detectado: iniciante_empresarial, consolidacao, avancada_desorganizada, estrategica';
COMMENT ON COLUMN lya_interactions.state_detected IS 'Estado detectado: caotica, confusa, clara, acelerada';
COMMENT ON COLUMN lya_interactions.flow_used IS 'Fluxo empresarial usado na resposta';
COMMENT ON COLUMN lya_interactions.cycle_used IS 'Ciclo de ritmo usado: diario, semanal, mensal';
