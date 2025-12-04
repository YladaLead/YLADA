-- ============================================
-- SISTEMA NOEL - ÁREA WELLNESS
-- Base de Conhecimento e Embeddings
-- ============================================

-- 1. Tabela de itens da base de conhecimento
CREATE TABLE IF NOT EXISTS knowledge_wellness_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mentor', 'suporte', 'tecnico')),
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_knowledge_wellness_category ON knowledge_wellness_items(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_wellness_subcategory ON knowledge_wellness_items(subcategory);
CREATE INDEX IF NOT EXISTS idx_knowledge_wellness_tags ON knowledge_wellness_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_wellness_active ON knowledge_wellness_items(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_knowledge_wellness_slug ON knowledge_wellness_items(slug);

-- 2. Tabela de embeddings (vetores de busca semântica)
CREATE TABLE IF NOT EXISTS knowledge_wellness_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES knowledge_wellness_items(id) ON DELETE CASCADE,
  embedding_vector vector(1536), -- OpenAI text-embedding-3-small = 1536 dimensões
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id)
);

-- Índice para busca por similaridade (usando pgvector)
CREATE INDEX IF NOT EXISTS idx_wellness_embeddings_vector 
ON knowledge_wellness_embeddings 
USING ivfflat (embedding_vector vector_cosine_ops)
WITH (lists = 100);

-- 3. Tabela de queries dos usuários (logs e aprendizado)
CREATE TABLE IF NOT EXISTS wellness_user_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('knowledge_base', 'ia_generated', 'hybrid')),
  module_type TEXT CHECK (module_type IN ('mentor', 'suporte', 'tecnico')),
  knowledge_item_id UUID REFERENCES knowledge_wellness_items(id),
  similarity_score NUMERIC,
  tokens_used INTEGER DEFAULT 0,
  model_used TEXT,
  was_helpful BOOLEAN,
  user_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para análise
CREATE INDEX IF NOT EXISTS idx_wellness_queries_user ON wellness_user_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_queries_source ON wellness_user_queries(source_type);
CREATE INDEX IF NOT EXISTS idx_wellness_queries_module ON wellness_user_queries(module_type);
CREATE INDEX IF NOT EXISTS idx_wellness_queries_created ON wellness_user_queries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_queries_helpful ON wellness_user_queries(was_helpful) WHERE was_helpful = true;

-- 4. Tabela de aprendizado contínuo (itens sugeridos para adicionar)
CREATE TABLE IF NOT EXISTS wellness_learning_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  suggested_response TEXT NOT NULL,
  suggested_category TEXT CHECK (suggested_category IN ('mentor', 'suporte', 'tecnico')),
  frequency INTEGER DEFAULT 1,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_learning_frequency ON wellness_learning_suggestions(frequency DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_learning_approved ON wellness_learning_suggestions(approved) WHERE approved = false;

-- 5. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_wellness_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_wellness_knowledge_updated_at ON knowledge_wellness_items;
CREATE TRIGGER trigger_update_wellness_knowledge_updated_at
  BEFORE UPDATE ON knowledge_wellness_items
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_knowledge_updated_at();

-- 6. RLS (Row Level Security) - apenas usuários autenticados podem ler
ALTER TABLE knowledge_wellness_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_wellness_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_user_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_learning_suggestions ENABLE ROW LEVEL SECURITY;

-- Políticas: usuários autenticados podem ler itens ativos
DROP POLICY IF EXISTS "Users can read active knowledge items" ON knowledge_wellness_items;
CREATE POLICY "Users can read active knowledge items"
  ON knowledge_wellness_items FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Users can read embeddings" ON knowledge_wellness_embeddings;
CREATE POLICY "Users can read embeddings"
  ON knowledge_wellness_embeddings FOR SELECT
  TO authenticated
  USING (true);

-- Usuários podem ver apenas suas próprias queries
DROP POLICY IF EXISTS "Users can view own queries" ON wellness_user_queries;
CREATE POLICY "Users can view own queries"
  ON wellness_user_queries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own queries" ON wellness_user_queries;
CREATE POLICY "Users can insert own queries"
  ON wellness_user_queries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Apenas admins podem gerenciar conhecimento
DROP POLICY IF EXISTS "Admins can manage knowledge" ON knowledge_wellness_items;
CREATE POLICY "Admins can manage knowledge"
  ON knowledge_wellness_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND (is_admin = true OR is_support = true)
    )
  );

-- ============================================
-- DADOS INICIAIS (EXEMPLOS)
-- ============================================

-- Exemplo de item técnico
INSERT INTO knowledge_wellness_items (title, slug, category, subcategory, tags, priority, content)
VALUES (
  'Como preparar Shake Herbalife',
  'como-preparar-shake-herbalife',
  'tecnico',
  'bebidas_funcionais',
  ARRAY['shake', 'preparo', 'herbalife', 'bebida'],
  9,
  'Para preparar o Shake Herbalife:
1. Adicione 2 colheres (26g) do pó em 250ml de leite desnatado ou água
2. Misture bem até dissolver completamente
3. Pode adicionar frutas ou gelo para variar o sabor
4. Consuma imediatamente após o preparo

Dica: Use leite para mais cremosidade e proteína extra.'
) ON CONFLICT (slug) DO NOTHING;

-- Exemplo de item mentor
INSERT INTO knowledge_wellness_items (title, slug, category, subcategory, tags, priority, content)
VALUES (
  'Como definir metas de PV',
  'como-definir-metas-pv',
  'mentor',
  'metas',
  ARRAY['pv', 'metas', 'vendas', 'planejamento'],
  8,
  'Para definir suas metas de PV:
1. Analise seu histórico dos últimos 3 meses
2. Defina uma meta realista (aumento de 10-20% sobre a média)
3. Divida em metas semanais e diárias
4. Acompanhe diariamente no dashboard
5. Ajuste conforme necessário

Lembre-se: metas devem ser desafiadoras mas alcançáveis.'
) ON CONFLICT (slug) DO NOTHING;

-- Exemplo de item suporte
INSERT INTO knowledge_wellness_items (title, slug, category, subcategory, tags, priority, content)
VALUES (
  'Como criar um quiz no sistema',
  'como-criar-quiz-sistema',
  'suporte',
  'ferramentas',
  ARRAY['quiz', 'criar', 'ferramenta', 'captacao'],
  7,
  'Para criar um quiz:
1. Acesse "Ferramentas" no menu lateral
2. Clique em "Criar Nova Ferramenta"
3. Selecione o tipo "Quiz"
4. Preencha título, descrição e perguntas
5. Configure os resultados possíveis
6. Salve e publique

O quiz ficará disponível para compartilhar e captar leads.'
) ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE knowledge_wellness_items IS 'Base de conhecimento do NOEL - Área Wellness';
COMMENT ON TABLE knowledge_wellness_embeddings IS 'Embeddings vetoriais para busca semântica';
COMMENT ON TABLE wellness_user_queries IS 'Logs de queries dos usuários para aprendizado';
COMMENT ON TABLE wellness_learning_suggestions IS 'Sugestões de aprendizado contínuo do NOEL';

