-- =====================================================
-- YLADA - Formação Empresarial - Tabelas
-- =====================================================
-- Estrutura completa para módulo de cursos, trilhas e formação

-- 1. Tabela de Trilhas (Courses/Trails)
CREATE TABLE IF NOT EXISTS courses_trails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  estimated_hours INTEGER DEFAULT 0,
  level VARCHAR(50) DEFAULT 'iniciante' CHECK (level IN ('iniciante', 'intermediario', 'avancado')),
  is_recommended BOOLEAN DEFAULT false,
  badge VARCHAR(50) CHECK (badge IN ('Novo', 'Essencial', 'Recomendado')),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Módulos (dentro de trilhas)
CREATE TABLE IF NOT EXISTS trails_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID NOT NULL REFERENCES courses_trails(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Aulas (Lessons)
CREATE TABLE IF NOT EXISTS trails_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID NOT NULL REFERENCES courses_trails(id) ON DELETE CASCADE,
  module_id UUID REFERENCES trails_modules(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT,
  video_duration_minutes INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Microcursos
CREATE TABLE IF NOT EXISTS microcourses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  checklist_items JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Biblioteca
CREATE TABLE IF NOT EXISTS library_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL CHECK (category IN (
    'Scripts de Atendimento',
    'Checklists',
    'Templates',
    'PDFs educativos',
    'Materiais de apoio'
  )),
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('pdf', 'template', 'script', 'planilha', 'mensagem', 'outro')),
  file_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Tutoriais
CREATE TABLE IF NOT EXISTS tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tool_name VARCHAR(255) NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  level VARCHAR(50) DEFAULT 'basico' CHECK (level IN ('basico', 'intermediario', 'avancado')),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Progresso do Usuário nas Trilhas
CREATE TABLE IF NOT EXISTS progress_user_trails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trail_id UUID NOT NULL REFERENCES courses_trails(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES trails_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  watched_percentage INTEGER DEFAULT 0 CHECK (watched_percentage >= 0 AND watched_percentage <= 100),
  last_position_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 8. Tabela de Favoritos da Biblioteca
CREATE TABLE IF NOT EXISTS library_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  library_file_id UUID NOT NULL REFERENCES library_files(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, library_file_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_trails_modules_trail_id ON trails_modules(trail_id);
CREATE INDEX IF NOT EXISTS idx_trails_lessons_trail_id ON trails_lessons(trail_id);
CREATE INDEX IF NOT EXISTS idx_trails_lessons_module_id ON trails_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_trails_user_id ON progress_user_trails(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_trails_trail_id ON progress_user_trails(trail_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_trails_lesson_id ON progress_user_trails(lesson_id);
CREATE INDEX IF NOT EXISTS idx_library_favorites_user_id ON library_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_library_favorites_file_id ON library_favorites(library_file_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_courses_trails_updated_at BEFORE UPDATE ON courses_trails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trails_modules_updated_at BEFORE UPDATE ON trails_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trails_lessons_updated_at BEFORE UPDATE ON trails_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_microcourses_updated_at BEFORE UPDATE ON microcourses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_files_updated_at BEFORE UPDATE ON library_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON tutorials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_user_trails_updated_at BEFORE UPDATE ON progress_user_trails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

