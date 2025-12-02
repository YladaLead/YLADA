-- =====================================================
-- YLADA - Tabela para Anotações dos Pilares
-- =====================================================

-- Tabela para armazenar anotações dos usuários sobre os Pilares
CREATE TABLE IF NOT EXISTS pilar_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pilar_id VARCHAR(10) NOT NULL, -- '1', '2', '3', '4', '5'
  conteudo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pilar_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pilar_notes_user ON pilar_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_pilar_notes_pilar ON pilar_notes(pilar_id);

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_pilar_notes_updated_at ON pilar_notes;
CREATE TRIGGER update_pilar_notes_updated_at
  BEFORE UPDATE ON pilar_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE pilar_notes ENABLE ROW LEVEL SECURITY;

-- Política: usuários só podem ver suas próprias anotações
DROP POLICY IF EXISTS "Users can view their own pilar notes" ON pilar_notes;
CREATE POLICY "Users can view their own pilar notes"
  ON pilar_notes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: usuários só podem inserir suas próprias anotações
DROP POLICY IF EXISTS "Users can insert their own pilar notes" ON pilar_notes;
CREATE POLICY "Users can insert their own pilar notes"
  ON pilar_notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: usuários só podem atualizar suas próprias anotações
DROP POLICY IF EXISTS "Users can update their own pilar notes" ON pilar_notes;
CREATE POLICY "Users can update their own pilar notes"
  ON pilar_notes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: usuários só podem deletar suas próprias anotações
DROP POLICY IF EXISTS "Users can delete their own pilar notes" ON pilar_notes;
CREATE POLICY "Users can delete their own pilar notes"
  ON pilar_notes
  FOR DELETE
  USING (auth.uid() = user_id);

