-- =====================================================
-- ESTRUTURA COMPLETA - ÁREA DE CURSOS (Filosofia ILADA)
-- =====================================================
-- Este script cria todas as tabelas necessárias para
-- a área de Cursos/Filosofia ILADA
-- =====================================================

-- Tabela principal de trilhas/cursos
CREATE TABLE IF NOT EXISTS coach_cursos_trilhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  banner_url TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  ordem INTEGER DEFAULT 0,
  estimated_hours DECIMAL(5,2),
  level VARCHAR(50), -- iniciante, intermediario, avancado
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Módulos dentro de uma trilha
CREATE TABLE IF NOT EXISTS coach_cursos_modulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id UUID REFERENCES coach_cursos_trilhas(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ordem INTEGER NOT NULL,
  estimated_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aulas dentro de um módulo
CREATE TABLE IF NOT EXISTS coach_cursos_aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id UUID REFERENCES coach_cursos_modulos(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL, -- video, texto, quiz, exercicio
  content_url TEXT, -- URL do vídeo, PDF, etc
  content_text TEXT, -- Conteúdo em texto (markdown)
  duration_minutes INTEGER,
  ordem INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false, -- Aula gratuita de preview
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Microcursos (cursos rápidos)
CREATE TABLE IF NOT EXISTS coach_cursos_microcursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biblioteca de recursos
CREATE TABLE IF NOT EXISTS coach_cursos_biblioteca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(50) NOT NULL, -- pdf, template, script, planilha, etc
  file_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- scripts, templates, pdfs, planilhas, etc
  thumbnail_url TEXT,
  download_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutoriais das ferramentas
CREATE TABLE IF NOT EXISTS coach_cursos_tutoriais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  tool_name VARCHAR(100), -- Nome da ferramenta (ex: "Quiz", "Links Personalizados")
  tool_slug VARCHAR(100), -- Slug da ferramenta para link direto
  video_url TEXT,
  duration_minutes INTEGER,
  level VARCHAR(50), -- basico, intermediario, avancado
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progresso do usuário
CREATE TABLE IF NOT EXISTS coach_cursos_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL, -- trilha, microcurso, tutorial
  item_id UUID NOT NULL,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_position INTEGER DEFAULT 0, -- Para vídeos: segundo onde parou
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Favoritos
CREATE TABLE IF NOT EXISTS coach_cursos_favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL, -- trilha, microcurso, tutorial, biblioteca
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Certificados
CREATE TABLE IF NOT EXISTS coach_cursos_certificados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trilha_id UUID REFERENCES coach_cursos_trilhas(id) ON DELETE CASCADE,
  certificate_url TEXT, -- URL do PDF do certificado
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, trilha_id)
);

-- Materiais complementares (anexos, downloads)
CREATE TABLE IF NOT EXISTS coach_cursos_materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aula_id UUID REFERENCES coach_cursos_aulas(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_coach_cursos_trilhas_user_id ON coach_cursos_trilhas(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_trilhas_status ON coach_cursos_trilhas(status);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_trilhas_slug ON coach_cursos_trilhas(slug);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_modulos_trilha_id ON coach_cursos_modulos(trilha_id);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_aulas_modulo_id ON coach_cursos_aulas(modulo_id);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_progresso_user_id ON coach_cursos_progresso(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_progresso_item ON coach_cursos_progresso(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_favoritos_user_id ON coach_cursos_favoritos(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_biblioteca_category ON coach_cursos_biblioteca(category);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_biblioteca_status ON coach_cursos_biblioteca(status);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_microcursos_status ON coach_cursos_microcursos(status);
CREATE INDEX IF NOT EXISTS idx_coach_cursos_tutoriais_status ON coach_cursos_tutoriais(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE coach_cursos_trilhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_cursos_modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_cursos_aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_cursos_microcursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_cursos_biblioteca ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_cursos_tutoriais ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_cursos_progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_cursos_favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_cursos_certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_cursos_materiais ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES - TRILHAS
-- =====================================================

DROP POLICY IF EXISTS "Users can view published coach trilhas" ON coach_cursos_trilhas;
CREATE POLICY "Users can view published coach trilhas"
  ON coach_cursos_trilhas FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

-- =====================================================
-- POLICIES - MÓDULOS E AULAS
-- =====================================================

DROP POLICY IF EXISTS "Users can view modules of published coach trilhas" ON coach_cursos_modulos;
CREATE POLICY "Users can view modules of published coach trilhas"
  ON coach_cursos_modulos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_cursos_trilhas
      WHERE coach_cursos_trilhas.id = coach_cursos_modulos.trilha_id
      AND (coach_cursos_trilhas.status = 'published' OR coach_cursos_trilhas.user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view aulas of published coach trilhas" ON coach_cursos_aulas;
CREATE POLICY "Users can view aulas of published coach trilhas"
  ON coach_cursos_aulas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_cursos_modulos
      JOIN coach_cursos_trilhas ON coach_cursos_trilhas.id = coach_cursos_modulos.trilha_id
      WHERE coach_cursos_modulos.id = coach_cursos_aulas.modulo_id
      AND (coach_cursos_trilhas.status = 'published' OR coach_cursos_trilhas.user_id = auth.uid())
    )
  );

-- =====================================================
-- POLICIES - MICROCURSOS
-- =====================================================

DROP POLICY IF EXISTS "Users can view published coach microcursos" ON coach_cursos_microcursos;
CREATE POLICY "Users can view published coach microcursos"
  ON coach_cursos_microcursos FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

-- =====================================================
-- POLICIES - BIBLIOTECA
-- =====================================================

DROP POLICY IF EXISTS "Users can view published coach biblioteca" ON coach_cursos_biblioteca;
CREATE POLICY "Users can view published coach biblioteca"
  ON coach_cursos_biblioteca FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

-- =====================================================
-- POLICIES - TUTORIAIS
-- =====================================================

DROP POLICY IF EXISTS "Users can view published coach tutoriais" ON coach_cursos_tutoriais;
CREATE POLICY "Users can view published coach tutoriais"
  ON coach_cursos_tutoriais FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

-- =====================================================
-- POLICIES - PROGRESSO
-- =====================================================

DROP POLICY IF EXISTS "Users can manage own coach progress" ON coach_cursos_progresso;
CREATE POLICY "Users can manage own coach progress"
  ON coach_cursos_progresso FOR ALL
  USING (user_id = auth.uid());

-- =====================================================
-- POLICIES - FAVORITOS
-- =====================================================

DROP POLICY IF EXISTS "Users can manage own coach favorites" ON coach_cursos_favoritos;
CREATE POLICY "Users can manage own coach favorites"
  ON coach_cursos_favoritos FOR ALL
  USING (user_id = auth.uid());

-- =====================================================
-- POLICIES - CERTIFICADOS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own coach certificates" ON coach_cursos_certificados;
CREATE POLICY "Users can view own coach certificates"
  ON coach_cursos_certificados FOR SELECT
  USING (user_id = auth.uid());

-- =====================================================
-- POLICIES - MATERIAIS
-- =====================================================

DROP POLICY IF EXISTS "Users can view materials of published coach aulas" ON coach_cursos_materiais;
CREATE POLICY "Users can view materials of published coach aulas"
  ON coach_cursos_materiais FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_cursos_aulas
      JOIN coach_cursos_modulos ON coach_cursos_modulos.id = coach_cursos_aulas.modulo_id
      JOIN coach_cursos_trilhas ON coach_cursos_trilhas.id = coach_cursos_modulos.trilha_id
      WHERE coach_cursos_aulas.id = coach_cursos_materiais.aula_id
      AND (coach_cursos_trilhas.status = 'published' OR coach_cursos_trilhas.user_id = auth.uid())
    )
  );

-- =====================================================
-- FUNCTIONS - Atualizar updated_at automaticamente
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_coach_cursos_trilhas_updated_at ON coach_cursos_trilhas;
CREATE TRIGGER update_coach_cursos_trilhas_updated_at
  BEFORE UPDATE ON coach_cursos_trilhas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_cursos_modulos_updated_at ON coach_cursos_modulos;
CREATE TRIGGER update_coach_cursos_modulos_updated_at
  BEFORE UPDATE ON coach_cursos_modulos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_cursos_aulas_updated_at ON coach_cursos_aulas;
CREATE TRIGGER update_coach_cursos_aulas_updated_at
  BEFORE UPDATE ON coach_cursos_aulas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_cursos_microcursos_updated_at ON coach_cursos_microcursos;
CREATE TRIGGER update_coach_cursos_microcursos_updated_at
  BEFORE UPDATE ON coach_cursos_microcursos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_cursos_biblioteca_updated_at ON coach_cursos_biblioteca;
CREATE TRIGGER update_coach_cursos_biblioteca_updated_at
  BEFORE UPDATE ON coach_cursos_biblioteca
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_cursos_tutoriais_updated_at ON coach_cursos_tutoriais;
CREATE TRIGGER update_coach_cursos_tutoriais_updated_at
  BEFORE UPDATE ON coach_cursos_tutoriais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_cursos_progresso_updated_at ON coach_cursos_progresso;
CREATE TRIGGER update_coach_cursos_progresso_updated_at
  BEFORE UPDATE ON coach_cursos_progresso
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE coach_cursos_trilhas IS 'Trilhas principais de cursos Coach (ex: Empreendedora Coach 2.0)';
COMMENT ON TABLE coach_cursos_modulos IS 'Módulos dentro de uma trilha Coach';
COMMENT ON TABLE coach_cursos_aulas IS 'Aulas individuais dentro de um módulo Coach';
COMMENT ON TABLE coach_cursos_microcursos IS 'Cursos rápidos Coach (6-10 minutos)';
COMMENT ON TABLE coach_cursos_biblioteca IS 'Biblioteca de recursos Coach (PDFs, templates, scripts)';
COMMENT ON TABLE coach_cursos_tutoriais IS 'Tutoriais das ferramentas Coach';
COMMENT ON TABLE coach_cursos_progresso IS 'Progresso do usuário em trilhas, microcursos e tutoriais Coach';
COMMENT ON TABLE coach_cursos_favoritos IS 'Itens favoritados pelo usuário Coach';
COMMENT ON TABLE coach_cursos_certificados IS 'Certificados emitidos ao completar trilhas Coach';
COMMENT ON TABLE coach_cursos_materiais IS 'Materiais complementares das aulas Coach';

