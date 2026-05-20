-- =====================================================
-- YLADA - SCHEMA PARA QUIZZES PERSONALIZADOS
-- Extensão do schema existente
-- =====================================================

-- Tabela para quizzes personalizados
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  emoji VARCHAR(10) DEFAULT '🎯',
  cores JSONB NOT NULL DEFAULT '{}', -- {primaria, secundaria, texto, fundo}
  configuracoes JSONB NOT NULL DEFAULT '{}', -- {tempoLimite, mostrarProgresso, permitirVoltar}
  entrega JSONB NOT NULL DEFAULT '{}', -- {tipoEntrega, urlRedirecionamento, coletarDados, camposColeta, customizacao, blocosConteudo, acaoAposCaptura}
  slug VARCHAR(255) UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, draft
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para perguntas dos quizzes
CREATE TABLE IF NOT EXISTS quiz_perguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'multipla', 'dissertativa', 'escala', 'simnao'
  titulo TEXT NOT NULL,
  opcoes JSONB, -- Array de strings para múltipla escolha
  obrigatoria BOOLEAN DEFAULT true,
  ordem INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para respostas dos quizzes
CREATE TABLE IF NOT EXISTS quiz_respostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  pergunta_id UUID REFERENCES quiz_perguntas(id) ON DELETE CASCADE,
  nome VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(20),
  resposta JSONB NOT NULL, -- {resposta_texto, resposta_escala, resposta_opcoes}
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON quizzes(slug);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON quizzes(status);
CREATE INDEX IF NOT EXISTS idx_quiz_perguntas_quiz_id ON quiz_perguntas(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_perguntas_ordem ON quiz_perguntas(ordem);
CREATE INDEX IF NOT EXISTS idx_quiz_respostas_quiz_id ON quiz_respostas(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_respostas_pergunta_id ON quiz_respostas(pergunta_id);
CREATE INDEX IF NOT EXISTS idx_quiz_respostas_created_at ON quiz_respostas(created_at);

-- RLS (Row Level Security)
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_respostas ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
DROP POLICY IF EXISTS "Users can view own quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can insert own quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can update own quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can delete own quizzes" ON quizzes;
DROP POLICY IF EXISTS "Anyone can view active quizzes" ON quizzes;

CREATE POLICY "Users can view own quizzes" ON quizzes FOR SELECT 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own quizzes" ON quizzes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own quizzes" ON quizzes FOR UPDATE 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own quizzes" ON quizzes FOR DELETE 
  USING (auth.uid() = user_id);

-- Qualquer um pode ver quizzes ativos (para publicação)
CREATE POLICY "Anyone can view active quizzes" ON quizzes FOR SELECT 
  USING (status = 'active');

DROP POLICY IF EXISTS "Users can manage own quiz_perguntas" ON quiz_perguntas;

CREATE POLICY "Users can manage own quiz_perguntas" ON quiz_perguntas FOR ALL 
  USING (
    quiz_id IN (SELECT id FROM quizzes WHERE user_id = auth.uid())
  );

-- Qualquer um pode ver e inserir respostas (leads)
DROP POLICY IF EXISTS "Anyone can insert quiz_respostas" ON quiz_respostas;
DROP POLICY IF EXISTS "Users can view own quiz responses" ON quiz_respostas;

CREATE POLICY "Anyone can insert quiz_respostas" ON quiz_respostas FOR INSERT 
  WITH CHECK (true);
  
CREATE POLICY "Users can view own quiz responses" ON quiz_respostas FOR SELECT 
  USING (
    quiz_id IN (SELECT id FROM quizzes WHERE user_id = auth.uid())
  );

-- =====================================================
-- VERIFICAR ESTRUTURA CRIADA
-- =====================================================
SELECT 
    'TABELAS DE QUIZ CRIADAS:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quizzes', 'quiz_perguntas', 'quiz_respostas')
ORDER BY table_name;

