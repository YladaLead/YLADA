-- ============================================
-- MIGRAÇÃO: Cursos Wellness
-- Descrição: Criação das tabelas para sistema de cursos wellness
-- Data: 2024
-- ============================================

-- 1. Tabela: wellness_cursos
CREATE TABLE IF NOT EXISTS wellness_cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('tutorial', 'filosofia')),
  thumbnail_url TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wellness_cursos
CREATE INDEX IF NOT EXISTS idx_wellness_cursos_ordem ON wellness_cursos(ordem);
CREATE INDEX IF NOT EXISTS idx_wellness_cursos_ativo ON wellness_cursos(ativo);
CREATE INDEX IF NOT EXISTS idx_wellness_cursos_slug ON wellness_cursos(slug);
CREATE INDEX IF NOT EXISTS idx_wellness_cursos_categoria ON wellness_cursos(categoria);

-- 2. Tabela: wellness_curso_modulos
CREATE TABLE IF NOT EXISTS wellness_curso_modulos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id UUID NOT NULL REFERENCES wellness_cursos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wellness_curso_modulos
CREATE INDEX IF NOT EXISTS idx_wellness_curso_modulos_curso ON wellness_curso_modulos(curso_id);
CREATE INDEX IF NOT EXISTS idx_wellness_curso_modulos_ordem ON wellness_curso_modulos(curso_id, ordem);

-- 3. Tabela: wellness_curso_materiais
CREATE TABLE IF NOT EXISTS wellness_curso_materiais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modulo_id UUID NOT NULL REFERENCES wellness_curso_modulos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('pdf', 'video')),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  duracao INTEGER, -- Duração em segundos (para vídeos)
  ordem INTEGER NOT NULL DEFAULT 0,
  gratuito BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wellness_curso_materiais
CREATE INDEX IF NOT EXISTS idx_wellness_curso_materiais_modulo ON wellness_curso_materiais(modulo_id);
CREATE INDEX IF NOT EXISTS idx_wellness_curso_materiais_ordem ON wellness_curso_materiais(modulo_id, ordem);
CREATE INDEX IF NOT EXISTS idx_wellness_curso_materiais_tipo ON wellness_curso_materiais(tipo);

-- 4. Tabela: wellness_curso_progresso
CREATE TABLE IF NOT EXISTS wellness_curso_progresso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES wellness_cursos(id) ON DELETE CASCADE,
  modulo_id UUID REFERENCES wellness_curso_modulos(id) ON DELETE CASCADE,
  material_id UUID REFERENCES wellness_curso_materiais(id) ON DELETE CASCADE,
  concluido BOOLEAN DEFAULT false,
  tempo_assistido INTEGER DEFAULT 0, -- Tempo em segundos
  ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, material_id)
);

-- Índices para wellness_curso_progresso
CREATE INDEX IF NOT EXISTS idx_wellness_curso_progresso_user ON wellness_curso_progresso(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_curso_progresso_curso ON wellness_curso_progresso(curso_id);
CREATE INDEX IF NOT EXISTS idx_wellness_curso_progresso_material ON wellness_curso_progresso(material_id);
CREATE INDEX IF NOT EXISTS idx_wellness_curso_progresso_user_curso ON wellness_curso_progresso(user_id, curso_id);
CREATE INDEX IF NOT EXISTS idx_wellness_curso_progresso_modulo ON wellness_curso_progresso(modulo_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE wellness_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_curso_modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_curso_materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_curso_progresso ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS: wellness_cursos
-- ============================================

-- SELECT: Todos usuários autenticados podem ver cursos ativos
CREATE POLICY "Usuários autenticados podem ver cursos ativos"
  ON wellness_cursos FOR SELECT
  USING (auth.role() = 'authenticated' AND ativo = true);

-- SELECT: Admins podem ver todos os cursos (incluindo inativos)
CREATE POLICY "Admins podem ver todos os cursos"
  ON wellness_cursos FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- INSERT/UPDATE/DELETE: Apenas admins
CREATE POLICY "Apenas admins podem criar cursos"
  ON wellness_cursos FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem atualizar cursos"
  ON wellness_cursos FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem deletar cursos"
  ON wellness_cursos FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- POLÍTICAS RLS: wellness_curso_modulos
-- ============================================

-- SELECT: Todos usuários autenticados podem ver módulos de cursos ativos
CREATE POLICY "Usuários autenticados podem ver módulos"
  ON wellness_curso_modulos FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM wellness_cursos
      WHERE wellness_cursos.id = wellness_curso_modulos.curso_id
      AND wellness_cursos.ativo = true
    )
  );

-- INSERT/UPDATE/DELETE: Apenas admins
CREATE POLICY "Apenas admins podem gerenciar módulos"
  ON wellness_curso_modulos FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- POLÍTICAS RLS: wellness_curso_materiais
-- ============================================

-- SELECT: Todos usuários autenticados podem ver materiais de cursos ativos
CREATE POLICY "Usuários autenticados podem ver materiais"
  ON wellness_curso_materiais FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM wellness_curso_modulos
      JOIN wellness_cursos ON wellness_cursos.id = wellness_curso_modulos.curso_id
      WHERE wellness_curso_modulos.id = wellness_curso_materiais.modulo_id
      AND wellness_cursos.ativo = true
    )
  );

-- INSERT/UPDATE/DELETE: Apenas admins
CREATE POLICY "Apenas admins podem gerenciar materiais"
  ON wellness_curso_materiais FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- POLÍTICAS RLS: wellness_curso_progresso
-- ============================================

-- SELECT: Usuário pode ver apenas seu próprio progresso
CREATE POLICY "Usuários podem ver seu próprio progresso"
  ON wellness_curso_progresso FOR SELECT
  USING (auth.uid() = user_id);

-- SELECT: Admins podem ver todo o progresso
CREATE POLICY "Admins podem ver todo o progresso"
  ON wellness_curso_progresso FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- INSERT/UPDATE: Usuário pode criar/atualizar apenas seu próprio progresso
CREATE POLICY "Usuários podem gerenciar seu próprio progresso"
  ON wellness_curso_progresso FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_wellness_cursos_updated_at
  BEFORE UPDATE ON wellness_cursos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_curso_modulos_updated_at
  BEFORE UPDATE ON wellness_curso_modulos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_curso_materiais_updated_at
  BEFORE UPDATE ON wellness_curso_materiais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_curso_progresso_updated_at
  BEFORE UPDATE ON wellness_curso_progresso
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================

COMMENT ON TABLE wellness_cursos IS 'Cursos disponíveis na área wellness';
COMMENT ON TABLE wellness_curso_modulos IS 'Módulos (tópicos) de cada curso';
COMMENT ON TABLE wellness_curso_materiais IS 'Materiais (PDFs e vídeos) de cada módulo';
COMMENT ON TABLE wellness_curso_progresso IS 'Progresso dos usuários nos cursos';

