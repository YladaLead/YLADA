-- =====================================================
-- YLADA - Tabela para Ritual Final da Jornada
-- =====================================================

-- Tabela para armazenar dados do Ritual Final
CREATE TABLE IF NOT EXISTS journey_ritual_final (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  maior_aprendizado TEXT,
  mudanca_interna TEXT,
  novo_posicionamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ritual_final_user ON journey_ritual_final(user_id);

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_ritual_final_updated_at ON journey_ritual_final;
CREATE TRIGGER update_ritual_final_updated_at
  BEFORE UPDATE ON journey_ritual_final
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE journey_ritual_final ENABLE ROW LEVEL SECURITY;

-- Política: usuários só podem ver seus próprios dados
DROP POLICY IF EXISTS "Users can view their own ritual final" ON journey_ritual_final;
CREATE POLICY "Users can view their own ritual final"
  ON journey_ritual_final
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: usuários só podem inserir seus próprios dados
DROP POLICY IF EXISTS "Users can insert their own ritual final" ON journey_ritual_final;
CREATE POLICY "Users can insert their own ritual final"
  ON journey_ritual_final
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: usuários só podem atualizar seus próprios dados
DROP POLICY IF EXISTS "Users can update their own ritual final" ON journey_ritual_final;
CREATE POLICY "Users can update their own ritual final"
  ON journey_ritual_final
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

