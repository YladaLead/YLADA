-- =====================================================
-- YLADA - Tabelas para Exercícios do Método
-- =====================================================

-- Tabela para armazenar notas de campos dos exercícios
CREATE TABLE IF NOT EXISTS exercicio_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercicio_id VARCHAR(100) NOT NULL,
  campo_id VARCHAR(100) NOT NULL,
  conteudo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, exercicio_id, campo_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_exercicio_notes_user ON exercicio_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_exercicio_notes_exercicio ON exercicio_notes(exercicio_id);

-- Tabela para progresso e checklist dos exercícios
CREATE TABLE IF NOT EXISTS exercicio_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercicio_id VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  checklist_completed JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, exercicio_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_exercicio_progress_user ON exercicio_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_exercicio_progress_exercicio ON exercicio_progress(exercicio_id);

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_exercicio_notes_updated_at ON exercicio_notes;
CREATE TRIGGER update_exercicio_notes_updated_at
  BEFORE UPDATE ON exercicio_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exercicio_progress_updated_at ON exercicio_progress;
CREATE TRIGGER update_exercicio_progress_updated_at
  BEFORE UPDATE ON exercicio_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE exercicio_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercicio_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para exercicio_notes
DROP POLICY IF EXISTS "Users can view their own exercicio notes" ON exercicio_notes;
CREATE POLICY "Users can view their own exercicio notes"
  ON exercicio_notes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own exercicio notes" ON exercicio_notes;
CREATE POLICY "Users can insert their own exercicio notes"
  ON exercicio_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own exercicio notes" ON exercicio_notes;
CREATE POLICY "Users can update their own exercicio notes"
  ON exercicio_notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para exercicio_progress
DROP POLICY IF EXISTS "Users can view their own exercicio progress" ON exercicio_progress;
CREATE POLICY "Users can view their own exercicio progress"
  ON exercicio_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own exercicio progress" ON exercicio_progress;
CREATE POLICY "Users can insert their own exercicio progress"
  ON exercicio_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own exercicio progress" ON exercicio_progress;
CREATE POLICY "Users can update their own exercicio progress"
  ON exercicio_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

