-- ============================================
-- TABELAS: Biblioteca Wellness System
-- Estrutura para armazenar fluxos, scripts, materiais e apresentações
-- ============================================

-- Tabela de Fluxos
CREATE TABLE IF NOT EXISTS wellness_fluxos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL, -- Ex: 'fluxo-2-5-10', 'fluxo-convite-leve'
  titulo TEXT NOT NULL,
  descricao TEXT,
  objetivo TEXT,
  quando_usar TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN (
    'acao-diaria',
    'vendas',
    'acompanhamento',
    'apresentacao',
    'recrutamento',
    'treino-novos',
    'objecoes'
  )),
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Passos dos Fluxos
CREATE TABLE IF NOT EXISTS wellness_fluxos_passos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fluxo_id UUID NOT NULL REFERENCES wellness_fluxos(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fluxo_id, numero)
);

-- Tabela de Scripts dos Fluxos
CREATE TABLE IF NOT EXISTS wellness_fluxos_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passo_id UUID REFERENCES wellness_fluxos_passos(id) ON DELETE CASCADE,
  fluxo_id UUID REFERENCES wellness_fluxos(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  variacao TEXT, -- Ex: 'padrao', 'casual', 'profissional'
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Dicas dos Fluxos
CREATE TABLE IF NOT EXISTS wellness_fluxos_dicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passo_id UUID REFERENCES wellness_fluxos_passos(id) ON DELETE CASCADE,
  fluxo_id UUID REFERENCES wellness_fluxos(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Scripts Oficiais (standalone)
CREATE TABLE IF NOT EXISTS wellness_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN (
    'convite',
    'follow-up',
    'apresentacao',
    'fechamento',
    'objecao',
    'onboarding',
    'outro'
  )),
  texto TEXT NOT NULL,
  variacoes JSONB, -- Array de variações do script
  tags TEXT[], -- Tags para busca
  uso_frequente INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Materiais (PDFs, vídeos, links)
CREATE TABLE IF NOT EXISTS wellness_materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN (
    'pdf',
    'video',
    'link',
    'imagem',
    'documento'
  )),
  categoria TEXT NOT NULL CHECK (categoria IN (
    'apresentacao',
    'cartilha',
    'produto',
    'treinamento',
    'script',
    'outro'
  )),
  url TEXT NOT NULL, -- URL do material
  arquivo_path TEXT, -- Caminho do arquivo (se armazenado localmente)
  tamanho_bytes BIGINT,
  tags TEXT[],
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Cartilhas
CREATE TABLE IF NOT EXISTS wellness_cartilhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN (
    'novo-distribuidor',
    'vendas-bebidas',
    'ativador-bem-estar',
    'conversao-retencao',
    'apresentacoes',
    'plano-presidente'
  )),
  conteudo TEXT, -- Conteúdo da cartilha (markdown ou HTML)
  material_id UUID REFERENCES wellness_materiais(id), -- PDF da cartilha
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Apresentações (HOM)
CREATE TABLE IF NOT EXISTS wellness_apresentacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN (
    'hom-curta',
    'hom-longa',
    'pitch',
    'explicacao-leve',
    'explicacao-completa'
  )),
  url TEXT NOT NULL, -- URL da apresentação
  material_id UUID REFERENCES wellness_materiais(id), -- PDF da apresentação
  duracao_minutos INTEGER,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Produtos & Bebidas
CREATE TABLE IF NOT EXISTS wellness_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN (
    'nrg',
    'acelera',
    'turbo-detox',
    'hype',
    'outro'
  )),
  guia_conteudo TEXT, -- Conteúdo do guia
  material_id UUID REFERENCES wellness_materiais(id), -- PDF do guia
  video_preparo_id UUID REFERENCES wellness_materiais(id), -- Vídeo de preparo
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Acesso a Materiais (histórico)
CREATE TABLE IF NOT EXISTS wellness_materiais_acesso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id UUID REFERENCES wellness_materiais(id) ON DELETE CASCADE,
  fluxo_id UUID REFERENCES wellness_fluxos(id) ON DELETE CASCADE,
  script_id UUID REFERENCES wellness_scripts(id) ON DELETE CASCADE,
  tipo_acesso TEXT NOT NULL CHECK (tipo_acesso IN (
    'visualizacao',
    'download',
    'copiar',
    'whatsapp',
    'noel'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_fluxos_categoria ON wellness_fluxos(categoria);
CREATE INDEX IF NOT EXISTS idx_fluxos_ativo ON wellness_fluxos(ativo);
CREATE INDEX IF NOT EXISTS idx_scripts_categoria ON wellness_scripts(categoria);
CREATE INDEX IF NOT EXISTS idx_scripts_tags ON wellness_scripts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_materiais_categoria ON wellness_materiais(categoria);
CREATE INDEX IF NOT EXISTS idx_materiais_tipo ON wellness_materiais(tipo);
CREATE INDEX IF NOT EXISTS idx_materiais_tags ON wellness_materiais USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_materiais_acesso_user ON wellness_materiais_acesso(user_id);
CREATE INDEX IF NOT EXISTS idx_materiais_acesso_created ON wellness_materiais_acesso(created_at DESC);

-- Comentários
COMMENT ON TABLE wellness_fluxos IS 'Fluxos oficiais do Wellness System';
COMMENT ON TABLE wellness_fluxos_passos IS 'Passos individuais de cada fluxo';
COMMENT ON TABLE wellness_fluxos_scripts IS 'Scripts associados aos passos dos fluxos';
COMMENT ON TABLE wellness_scripts IS 'Scripts oficiais standalone para uso geral';
COMMENT ON TABLE wellness_materiais IS 'Materiais diversos (PDFs, vídeos, links)';
COMMENT ON TABLE wellness_cartilhas IS 'Cartilhas de treinamento';
COMMENT ON TABLE wellness_apresentacoes IS 'Apresentações oficiais (HOM, pitch, etc)';
COMMENT ON TABLE wellness_produtos IS 'Produtos e bebidas funcionais com guias';
COMMENT ON TABLE wellness_materiais_acesso IS 'Histórico de acesso aos materiais pelos usuários';
