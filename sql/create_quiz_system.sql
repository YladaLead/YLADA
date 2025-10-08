-- Script para criar sistema de Quiz Builder
-- Execute este script no Supabase SQL Editor

-- 1. Criar tabela de quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  colors JSONB DEFAULT '{
    "primary": "#10B981",
    "secondary": "#8B5CF6", 
    "background": "#F0FDF4",
    "text": "#1F2937"
  }'::jsonb,
  settings JSONB DEFAULT '{
    "showCorrectAnswers": true,
    "randomizeQuestions": false,
    "timeLimit": null,
    "attempts": null,
    "customButtonText": "Falar com Especialista"
  }'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de perguntas do quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple', 'essay')),
  "order" INTEGER NOT NULL,
  options JSONB, -- Array de opções para múltipla escolha
  correct_answer JSONB, -- Resposta correta (número para múltipla escolha, texto para dissertativa)
  points INTEGER DEFAULT 1,
  button_text TEXT DEFAULT 'Próxima Questão', -- Texto personalizado do botão
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de respostas dos usuários
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_email TEXT, -- Email do usuário que respondeu
  user_name TEXT, -- Nome do usuário
  responses JSONB NOT NULL, -- Respostas do usuário
  score INTEGER DEFAULT 0, -- Pontuação total
  total_points INTEGER DEFAULT 0, -- Pontos possíveis
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent INTEGER, -- Tempo em segundos
  ip_address INET -- Para controle de tentativas
);

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_quizzes_professional_id ON quizzes(professional_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_active ON quizzes(is_active);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON quiz_questions(quiz_id, "order");
CREATE INDEX IF NOT EXISTS idx_quiz_responses_quiz_id ON quiz_responses(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_email ON quiz_responses(user_email);

-- 5. Habilitar RLS (Row Level Security)
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas RLS para quizzes
CREATE POLICY "Profissionais podem gerenciar seus próprios quizzes" ON quizzes
  FOR ALL USING (professional_id = auth.uid());

CREATE POLICY "Quizzes ativos são públicos para leitura" ON quizzes
  FOR SELECT USING (is_active = true);

-- 7. Criar políticas RLS para quiz_questions
CREATE POLICY "Profissionais podem gerenciar perguntas de seus quizzes" ON quiz_questions
  FOR ALL USING (
    quiz_id IN (
      SELECT id FROM quizzes WHERE professional_id = auth.uid()
    )
  );

CREATE POLICY "Perguntas de quizzes ativos são públicas para leitura" ON quiz_questions
  FOR SELECT USING (
    quiz_id IN (
      SELECT id FROM quizzes WHERE is_active = true
    )
  );

-- 8. Criar políticas RLS para quiz_responses
CREATE POLICY "Profissionais podem ver respostas de seus quizzes" ON quiz_responses
  FOR SELECT USING (
    quiz_id IN (
      SELECT id FROM quizzes WHERE professional_id = auth.uid()
    )
  );

CREATE POLICY "Qualquer um pode inserir respostas" ON quiz_responses
  FOR INSERT WITH CHECK (true);

-- 9. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Criar trigger para atualizar updated_at
CREATE TRIGGER update_quizzes_updated_at 
  BEFORE UPDATE ON quizzes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Criar função para calcular pontuação automaticamente
CREATE OR REPLACE FUNCTION calculate_quiz_score(
  p_quiz_id UUID,
  p_responses JSONB
) RETURNS INTEGER AS $$
DECLARE
  total_score INTEGER := 0;
  question_record RECORD;
  user_answer JSONB;
  correct_answer JSONB;
BEGIN
  -- Iterar sobre todas as perguntas do quiz
  FOR question_record IN 
    SELECT * FROM quiz_questions 
    WHERE quiz_id = p_quiz_id 
    ORDER BY "order"
  LOOP
    -- Obter resposta do usuário para esta pergunta
    user_answer := p_responses->question_record."order"::text;
    
    -- Obter resposta correta
    correct_answer := question_record.correct_answer;
    
    -- Verificar se a resposta está correta
    IF question_record.question_type = 'multiple' OR question_record.question_type = 'true_false' THEN
      -- Para múltipla escolha e V/F, comparar números
      IF user_answer = correct_answer THEN
        total_score := total_score + COALESCE(question_record.points, 1);
      END IF;
    ELSE
      -- Para dissertativa, sempre dar pontos (ou implementar lógica mais complexa)
      IF user_answer IS NOT NULL AND user_answer != '' THEN
        total_score := total_score + COALESCE(question_record.points, 1);
      END IF;
    END IF;
  END LOOP;
  
  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- 12. Comentários para documentação
COMMENT ON TABLE quizzes IS 'Tabela principal de quizzes criados pelos profissionais';
COMMENT ON TABLE quiz_questions IS 'Perguntas de cada quiz com opções e respostas corretas';
COMMENT ON TABLE quiz_responses IS 'Respostas dos usuários aos quizzes com pontuação';

COMMENT ON COLUMN quizzes.colors IS 'Configurações de cores do quiz em formato JSON';
COMMENT ON COLUMN quizzes.settings IS 'Configurações gerais do quiz (tempo limite, tentativas, etc.)';
COMMENT ON COLUMN quiz_questions.options IS 'Array de opções para perguntas de múltipla escolha e V/F';
COMMENT ON COLUMN quiz_questions.correct_answer IS 'Resposta correta (número para múltipla escolha, texto para dissertativa)';
COMMENT ON COLUMN quiz_responses.responses IS 'Respostas do usuário organizadas por ordem da pergunta';
COMMENT ON COLUMN quiz_responses.score IS 'Pontuação total obtida pelo usuário';
COMMENT ON COLUMN quiz_responses.total_points IS 'Pontos possíveis no quiz';

-- 13. Verificar se as tabelas foram criadas
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('quizzes', 'quiz_questions', 'quiz_responses')
ORDER BY table_name, ordinal_position;
