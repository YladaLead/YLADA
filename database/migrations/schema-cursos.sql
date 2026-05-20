-- =====================================================
-- YLADA - SCHEMA PARA SISTEMA DE CURSOS
-- Suporta múltiplas áreas: nutri, coach, consultor, wellness
-- =====================================================

-- Tabela para cursos
CREATE TABLE IF NOT EXISTS cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL, -- 'nutri', 'coach', 'consultor', 'wellness'
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  imagem_url VARCHAR(500), -- URL da imagem/capa do curso
  nivel VARCHAR(50), -- 'iniciante', 'intermediario', 'avancado'
  categoria VARCHAR(100), -- 'nutricao', 'bem-estar', 'suplementos', etc.
  preco DECIMAL(10,2) DEFAULT 0,
  preco_com_desconto DECIMAL(10,2),
  duracao_horas INTEGER,
  total_aulas INTEGER DEFAULT 0,
  total_matriculados INTEGER DEFAULT 0,
  avaliacao_media DECIMAL(3,2), -- 0 a 5
  total_avaliacoes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  is_gratuito BOOLEAN DEFAULT false,
  modo_venda VARCHAR(20) DEFAULT 'ferramenta', -- 'ferramenta', 'produto', 'ambos'
  landing_page_url VARCHAR(500), -- URL da página de vendas externa
  checkout_url VARCHAR(500), -- URL do checkout/pagamento
  is_ferramenta BOOLEAN DEFAULT true, -- Disponível como ferramenta no YLADA
  is_produto BOOLEAN DEFAULT false, -- Disponível como produto vendável
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para módulos/aulas do curso
CREATE TABLE IF NOT EXISTS curso_conteudo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'video', 'pdf', 'texto', 'quiz', 'link'
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL,
  arquivo_url VARCHAR(500), -- URL do arquivo (vídeo, PDF, etc.)
  arquivo_tamanho INTEGER, -- Tamanho em bytes
  duracao_minutos INTEGER, -- Para vídeos
  download_permitido BOOLEAN DEFAULT true,
  is_preview BOOLEAN DEFAULT false, -- Conteúdo grátis para preview
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para matrículas dos usuários nos cursos
CREATE TABLE IF NOT EXISTS curso_matriculas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE,
  aluno_id UUID REFERENCES users(id) ON DELETE CASCADE,
  progresso_percentual INTEGER DEFAULT 0,
  ultima_aula_assistida UUID REFERENCES curso_conteudo(id),
  data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_fim TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  certificado_gerado BOOLEAN DEFAULT false,
  certificado_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'matriculado', -- 'matriculado', 'em-andamento', 'concluido', 'cancelado'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(curso_id, aluno_id)
);

-- Tabela para acompanhamento de progresso (quais aulas foram assistidas)
CREATE TABLE IF NOT EXISTS curso_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula_id UUID REFERENCES curso_matriculas(id) ON DELETE CASCADE,
  conteudo_id UUID REFERENCES curso_conteudo(id) ON DELETE CASCADE,
  assistido BOOLEAN DEFAULT false,
  percentual_assistido INTEGER DEFAULT 0, -- Para vídeos parciais
  tempo_assistido INTEGER DEFAULT 0, -- Em segundos
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_fim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(matricula_id, conteudo_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cursos_user_id ON cursos(user_id);
CREATE INDEX IF NOT EXISTS idx_cursos_area ON cursos(area);
CREATE INDEX IF NOT EXISTS idx_cursos_status ON cursos(status);
CREATE INDEX IF NOT EXISTS idx_curso_conteudo_curso_id ON curso_conteudo(curso_id);
CREATE INDEX IF NOT EXISTS idx_curso_matriculas_curso_id ON curso_matriculas(curso_id);
CREATE INDEX IF NOT EXISTS idx_curso_matriculas_aluno_id ON curso_matriculas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_curso_progresso_matricula_id ON curso_progresso(matricula_id);

-- RLS (Row Level Security)
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE curso_conteudo ENABLE ROW LEVEL SECURITY;
ALTER TABLE curso_matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE curso_progresso ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
DROP POLICY IF EXISTS "Users can view own courses" ON cursos;
DROP POLICY IF EXISTS "Users can manage own courses" ON cursos;
DROP POLICY IF EXISTS "Anyone can view published courses" ON cursos;

CREATE POLICY "Users can view own courses" ON cursos FOR SELECT 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can manage own courses" ON cursos FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published courses" ON cursos FOR SELECT 
  USING (status = 'published');

-- Políticas para curso_conteudo
DROP POLICY IF EXISTS "Course owners can manage content" ON curso_conteudo;
CREATE POLICY "Course owners can manage content" ON curso_conteudo FOR ALL 
  USING (
    curso_id IN (SELECT id FROM cursos WHERE user_id = auth.uid())
  );

-- Políticas para matrículas
DROP POLICY IF EXISTS "Users can view own enrollments" ON curso_matriculas;
DROP POLICY IF EXISTS "Users can enroll in courses" ON curso_matriculas;

CREATE POLICY "Users can view own enrollments" ON curso_matriculas FOR SELECT 
  USING (auth.uid() = aluno_id);
  
CREATE POLICY "Users can enroll in courses" ON curso_matriculas FOR INSERT 
  WITH CHECK (auth.uid() = aluno_id);

-- Políticas para progresso
DROP POLICY IF EXISTS "Users can view own progress" ON curso_progresso;
DROP POLICY IF EXISTS "Users can update own progress" ON curso_progresso;

CREATE POLICY "Users can view own progress" ON curso_progresso FOR SELECT 
  USING (
    matricula_id IN (SELECT id FROM curso_matriculas WHERE aluno_id = auth.uid())
  );

CREATE POLICY "Users can update own progress" ON curso_progresso FOR ALL 
  USING (
    matricula_id IN (SELECT id FROM curso_matriculas WHERE aluno_id = auth.uid())
  );

-- Verificar estrutura criada
SELECT 
    'TABELAS DE CURSOS CRIADAS:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('cursos', 'curso_conteudo', 'curso_matriculas', 'curso_progresso')
ORDER BY table_name;

