-- =====================================================
-- WELLNESS SYSTEM - TABELAS PRINCIPAIS
-- Migração 001: Criação da estrutura base
-- =====================================================

-- 1. TABELA: wellness_scripts
-- Armazena todos os scripts do NOEL organizados por categoria
CREATE TABLE IF NOT EXISTS wellness_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria VARCHAR(50) NOT NULL, -- 'tipo_pessoa', 'objetivo', 'etapa', 'acompanhamento', 'reativacao', 'recrutamento', 'interno'
  subcategoria VARCHAR(100), -- 'pessoas_proximas', 'energia', 'abertura', '7_dias', etc.
  nome VARCHAR(255) NOT NULL, -- 'Abertura leve', 'Curiosidade energia', etc.
  versao VARCHAR(20) NOT NULL, -- 'curta', 'media', 'longa', 'gatilho', 'se_some', 'se_negativa', 'upgrade'
  conteudo TEXT NOT NULL,
  tags TEXT[], -- ['energia', 'kit', 'turbo', 'hype']
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas que podem não existir (para compatibilidade com tabelas existentes)
DO $$ 
BEGIN
  -- Adicionar subcategoria se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'subcategoria'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN subcategoria VARCHAR(100);
  END IF;
  
  -- Adicionar tags se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN tags TEXT[];
  END IF;
  
  -- Adicionar ordem se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'ordem'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN ordem INTEGER DEFAULT 0;
  END IF;
  
  -- Adicionar ativo se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'ativo'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN ativo BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Índices para wellness_scripts
CREATE INDEX IF NOT EXISTS idx_wellness_scripts_categoria ON wellness_scripts(categoria);

-- Criar índices apenas se as colunas existirem
DO $$ 
BEGIN
  -- Índice de subcategoria
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'subcategoria'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_wellness_scripts_subcategoria ON wellness_scripts(subcategoria);
  END IF;
  
  -- Índice de tags (GIN)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'tags'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_wellness_scripts_tags ON wellness_scripts USING GIN(tags);
  END IF;
  
  -- Índice de ativo
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'ativo'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_wellness_scripts_ativo ON wellness_scripts(ativo);
  END IF;
END $$;

-- 2. TABELA: wellness_objecoes
-- Armazena todas as objeções e suas respostas
CREATE TABLE IF NOT EXISTS wellness_objecoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria VARCHAR(50) NOT NULL, -- 'clientes', 'clientes_recorrentes', 'recrutamento', 'distribuidores', 'avancadas'
  codigo VARCHAR(20) NOT NULL, -- 'A.1', 'B.2', 'C.3', etc.
  objeção TEXT NOT NULL, -- "Está caro"
  versao_curta TEXT,
  versao_media TEXT,
  versao_longa TEXT,
  gatilho_retomada TEXT,
  resposta_se_some TEXT,
  resposta_se_negativa TEXT,
  upgrade TEXT,
  tags TEXT[], -- ['preco', 'compromisso', 'tempo', etc.]
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar constraint UNIQUE se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'wellness_objecoes_categoria_codigo_key'
  ) THEN
    ALTER TABLE wellness_objecoes ADD CONSTRAINT wellness_objecoes_categoria_codigo_key UNIQUE(categoria, codigo);
  END IF;
END $$;

-- Adicionar colunas que podem não existir em wellness_objecoes
DO $$ 
BEGIN
  -- Adicionar tags se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN tags TEXT[];
  END IF;
  
  -- Adicionar ordem se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'ordem'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN ordem INTEGER DEFAULT 0;
  END IF;
  
  -- Adicionar ativo se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'ativo'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN ativo BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Índices para wellness_objecoes
CREATE INDEX IF NOT EXISTS idx_wellness_objecoes_categoria ON wellness_objecoes(categoria);
CREATE INDEX IF NOT EXISTS idx_wellness_objecoes_codigo ON wellness_objecoes(codigo);

-- Criar índices apenas se as colunas existirem
DO $$ 
BEGIN
  -- Índice de tags (GIN)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'tags'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_wellness_objecoes_tags ON wellness_objecoes USING GIN(tags);
  END IF;
  
  -- Índice de ativo
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'ativo'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_wellness_objecoes_ativo ON wellness_objecoes(ativo);
  END IF;
END $$;

-- 3. TABELA: wellness_noel_config
-- Configurações do comportamento do NOEL
CREATE TABLE IF NOT EXISTS wellness_noel_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor JSONB NOT NULL,
  descricao TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wellness_noel_config
CREATE INDEX IF NOT EXISTS idx_wellness_noel_config_chave ON wellness_noel_config(chave);

-- 4. TABELA: wellness_consultant_interactions
-- Registra todas as interações do distribuidor com o NOEL
CREATE TABLE IF NOT EXISTS wellness_consultant_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_interacao VARCHAR(50) NOT NULL, -- 'pergunta', 'solicitacao_script', 'objeção', 'feedback'
  contexto JSONB, -- { pessoa_tipo, objetivo, etapa, etc. }
  mensagem_usuario TEXT,
  resposta_noel TEXT,
  script_usado_id UUID REFERENCES wellness_scripts(id),
  objeção_tratada_id UUID REFERENCES wellness_objecoes(id),
  satisfacao INTEGER CHECK (satisfacao >= 1 AND satisfacao <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wellness_consultant_interactions
CREATE INDEX IF NOT EXISTS idx_wellness_interactions_consultant ON wellness_consultant_interactions(consultant_id);
CREATE INDEX IF NOT EXISTS idx_wellness_interactions_tipo ON wellness_consultant_interactions(tipo_interacao);
CREATE INDEX IF NOT EXISTS idx_wellness_interactions_created ON wellness_consultant_interactions(created_at DESC);

-- 5. TABELA: wellness_client_profiles
-- Perfis de clientes para personalização
CREATE TABLE IF NOT EXISTS wellness_client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_nome VARCHAR(255),
  cliente_contato VARCHAR(255),
  tipo_pessoa VARCHAR(50), -- 'proximo', 'indicacao', 'instagram', 'mercado_frio'
  objetivo_principal VARCHAR(50), -- 'energia', 'metabolismo', 'retencao', 'foco', 'emagrecimento'
  status VARCHAR(50) DEFAULT 'lead', -- 'lead', 'cliente_kit', 'cliente_recorrente', 'inativo', 'reativado'
  ultima_interacao TIMESTAMP WITH TIME ZONE,
  proxima_acao TEXT,
  historico JSONB DEFAULT '[]'::jsonb, -- Array de interações
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wellness_client_profiles
CREATE INDEX IF NOT EXISTS idx_wellness_clients_consultant ON wellness_client_profiles(consultant_id);
CREATE INDEX IF NOT EXISTS idx_wellness_clients_status ON wellness_client_profiles(status);
CREATE INDEX IF NOT EXISTS idx_wellness_clients_tipo ON wellness_client_profiles(tipo_pessoa);
CREATE INDEX IF NOT EXISTS idx_wellness_clients_objetivo ON wellness_client_profiles(objetivo_principal);

-- 6. TABELA: wellness_recruitment_prospects
-- Prospects de recrutamento
CREATE TABLE IF NOT EXISTS wellness_recruitment_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prospect_nome VARCHAR(255),
  prospect_contato VARCHAR(255),
  origem VARCHAR(50), -- 'cliente', 'indicacao', 'instagram', 'hom'
  interesse VARCHAR(50), -- 'renda_extra', 'tempo_livre', 'bem_estar', 'proposito'
  etapa VARCHAR(50) DEFAULT 'semente', -- 'semente', 'abertura', 'pre_diagnostico', 'hom', 'pos_hom', 'fechamento'
  status VARCHAR(50) DEFAULT 'ativo', -- 'ativo', 'pausado', 'convertido', 'desistiu'
  observacoes TEXT,
  historico JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wellness_recruitment_prospects
CREATE INDEX IF NOT EXISTS idx_wellness_prospects_consultant ON wellness_recruitment_prospects(consultant_id);
CREATE INDEX IF NOT EXISTS idx_wellness_prospects_status ON wellness_recruitment_prospects(status);
CREATE INDEX IF NOT EXISTS idx_wellness_prospects_etapa ON wellness_recruitment_prospects(etapa);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_wellness_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wellness_scripts_updated_at
  BEFORE UPDATE ON wellness_scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

CREATE TRIGGER update_wellness_objecoes_updated_at
  BEFORE UPDATE ON wellness_objecoes
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

CREATE TRIGGER update_wellness_noel_config_updated_at
  BEFORE UPDATE ON wellness_noel_config
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

CREATE TRIGGER update_wellness_clients_updated_at
  BEFORE UPDATE ON wellness_client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

CREATE TRIGGER update_wellness_prospects_updated_at
  BEFORE UPDATE ON wellness_recruitment_prospects
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

-- RLS (Row Level Security)
ALTER TABLE wellness_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_objecoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_noel_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_consultant_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_recruitment_prospects ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Wellness users podem ver seus próprios dados
-- Scripts e objeções são públicos para todos os wellness users
CREATE POLICY "Wellness users can view scripts"
  ON wellness_scripts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.perfil = 'wellness'
    )
  );

CREATE POLICY "Wellness users can view objections"
  ON wellness_objecoes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.perfil = 'wellness'
    )
  );

CREATE POLICY "Wellness users can view config"
  ON wellness_noel_config FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.perfil = 'wellness'
    )
  );

CREATE POLICY "Wellness users can manage own interactions"
  ON wellness_consultant_interactions
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Wellness users can manage own clients"
  ON wellness_client_profiles
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Wellness users can manage own prospects"
  ON wellness_recruitment_prospects
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Comentários
COMMENT ON TABLE wellness_scripts IS 'Biblioteca completa de scripts do NOEL organizados por categoria';
COMMENT ON TABLE wellness_objecoes IS 'Todas as objeções e respostas Premium Light Copy';
COMMENT ON TABLE wellness_noel_config IS 'Configurações do comportamento do NOEL';
COMMENT ON TABLE wellness_consultant_interactions IS 'Registro de todas as interações do distribuidor com o NOEL';
COMMENT ON TABLE wellness_client_profiles IS 'Perfis de clientes para personalização e acompanhamento';
COMMENT ON TABLE wellness_recruitment_prospects IS 'Prospects de recrutamento e sua jornada';

