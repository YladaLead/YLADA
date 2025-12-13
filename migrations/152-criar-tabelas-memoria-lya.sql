-- ============================================
-- MIGRATION: Criar tabelas de Memória e Aprendizado LYA
-- ============================================
-- Data: 2024
-- Descrição: Fase 1 - Fundação de memória (sem OpenAI ainda)
-- Baseado no plano de aprendizado da LYA

-- ============================================
-- TABELA: ai_state_user
-- Estado vivo da usuária (perfil, preferências, restrições)
-- ============================================
CREATE TABLE IF NOT EXISTS ai_state_user (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  perfil JSONB DEFAULT '{}',           -- Exemplo: { "nicho": "nutrição", "objetivos": "emagrecimento" }
  preferencias JSONB DEFAULT '{}',     -- Exemplo: { "metas": ["aumentar clientes", "gestão de redes sociais"] }
  restricoes JSONB DEFAULT '{}',       -- Exemplo: { "dietas": ["low-carb", "sem-glúten"] }
  ultima_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_state_user_user_id ON ai_state_user(user_id);

-- ============================================
-- TABELA: ai_memory_events
-- Memória de ações, resultados e feedbacks (aprendizado real)
-- ============================================
CREATE TABLE IF NOT EXISTS ai_memory_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,              -- 'acao', 'resultado', 'feedback'
  conteudo JSONB DEFAULT '{}',     -- Exemplo: { "acao": "realizou post", "resultado": "10 novos seguidores" }
  util BOOLEAN,                    -- Indica se a ação foi útil (pode ser NULL)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_memory_events_user_id ON ai_memory_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_events_tipo ON ai_memory_events(tipo);
CREATE INDEX IF NOT EXISTS idx_ai_memory_events_created_at ON ai_memory_events(created_at DESC);

-- Constraint para garantir tipo válido
ALTER TABLE ai_memory_events
DROP CONSTRAINT IF EXISTS ai_memory_events_tipo_check;

ALTER TABLE ai_memory_events
ADD CONSTRAINT ai_memory_events_tipo_check
CHECK (tipo IN ('acao', 'resultado', 'feedback'));

-- ============================================
-- TABELA: ai_knowledge_chunks
-- Cérebro institucional (scripts, fluxos, regras do YLADA)
-- ============================================
CREATE TABLE IF NOT EXISTS ai_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL,         -- 'fluxo', 'script', 'metodologia', 'regra'
  titulo TEXT NOT NULL,            -- Título do conteúdo (ex: "fluxo de vendas", "script de follow-up")
  conteudo TEXT NOT NULL,          -- Conteúdo completo
  embedding TEXT,                  -- Embeddings como TEXT por enquanto (pode migrar para VECTOR depois)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_chunks_categoria ON ai_knowledge_chunks(categoria);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE ai_state_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memory_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Políticas para ai_state_user
DROP POLICY IF EXISTS "Users can view own ai state" ON ai_state_user;
CREATE POLICY "Users can view own ai state"
ON ai_state_user FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ai state" ON ai_state_user;
CREATE POLICY "Users can insert own ai state"
ON ai_state_user FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ai state" ON ai_state_user;
CREATE POLICY "Users can update own ai state"
ON ai_state_user FOR UPDATE
USING (auth.uid() = user_id);

-- Políticas para ai_memory_events
DROP POLICY IF EXISTS "Users can view own memory events" ON ai_memory_events;
CREATE POLICY "Users can view own memory events"
ON ai_memory_events FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own memory events" ON ai_memory_events;
CREATE POLICY "Users can insert own memory events"
ON ai_memory_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Políticas para ai_knowledge_chunks (público para leitura, admin para escrita)
DROP POLICY IF EXISTS "Users can view knowledge chunks" ON ai_knowledge_chunks;
CREATE POLICY "Users can view knowledge chunks"
ON ai_knowledge_chunks FOR SELECT
USING (true); -- Todos podem ler conhecimento institucional

DROP POLICY IF EXISTS "Admin can manage knowledge chunks" ON ai_knowledge_chunks;
CREATE POLICY "Admin can manage knowledge chunks"
ON ai_knowledge_chunks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND (user_profiles.is_admin = true OR user_profiles.is_support = true)
  )
);

-- ============================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_ai_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS update_ai_knowledge_chunks_updated_at ON ai_knowledge_chunks;
CREATE TRIGGER update_ai_knowledge_chunks_updated_at
  BEFORE UPDATE ON ai_knowledge_chunks
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_knowledge_updated_at();

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE ai_state_user IS 'Estado vivo da usuária (perfil, preferências, restrições)';
COMMENT ON TABLE ai_memory_events IS 'Memória de ações, resultados e feedbacks (aprendizado real)';
COMMENT ON TABLE ai_knowledge_chunks IS 'Cérebro institucional (scripts, fluxos, regras do YLADA)';

COMMENT ON COLUMN ai_memory_events.tipo IS 'Tipo de evento: acao, resultado ou feedback';
COMMENT ON COLUMN ai_memory_events.util IS 'Indica se a ação foi útil (NULL = não avaliado ainda)';
COMMENT ON COLUMN ai_knowledge_chunks.embedding IS 'Embeddings como TEXT por enquanto (pode migrar para VECTOR(1536) depois com pgvector)';

