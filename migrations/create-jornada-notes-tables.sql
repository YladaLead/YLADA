-- =====================================================
-- YLADA - Jornada de 30 Dias - Tabelas de Notas e Logs
-- =====================================================

-- Tabela para logs de checklist (quando cada item é marcado)
CREATE TABLE IF NOT EXISTS journey_checklist_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  item_index INTEGER NOT NULL, -- Índice do item no array checklist_items
  marcado BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number, item_index)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_journey_checklist_log_user ON journey_checklist_log(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_checklist_log_day ON journey_checklist_log(day_number);
CREATE INDEX IF NOT EXISTS idx_journey_checklist_log_user_day ON journey_checklist_log(user_id, day_number);

-- Tabela para notas dos itens do checklist
-- Também conhecida como daily_checklist_notes (nome alternativo)
CREATE TABLE IF NOT EXISTS journey_checklist_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  item_index INTEGER NOT NULL, -- Índice do item no array checklist_items (equivale a checklist_item_id)
  nota TEXT, -- Campo de anotações (equivale a text_notes)
  completed_at TIMESTAMP WITH TIME ZONE, -- Timestamp quando o item foi marcado como completo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number, item_index)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_journey_checklist_notes_user ON journey_checklist_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_checklist_notes_day ON journey_checklist_notes(day_number);
CREATE INDEX IF NOT EXISTS idx_journey_checklist_notes_user_day ON journey_checklist_notes(user_id, day_number);

-- Tabela para anotações diárias (reflexão do dia)
CREATE TABLE IF NOT EXISTS journey_daily_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  conteudo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_journey_daily_notes_user ON journey_daily_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_daily_notes_day ON journey_daily_notes(day_number);
CREATE INDEX IF NOT EXISTS idx_journey_daily_notes_user_day ON journey_daily_notes(user_id, day_number);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_journey_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_journey_checklist_notes_updated_at ON journey_checklist_notes;
CREATE TRIGGER update_journey_checklist_notes_updated_at
  BEFORE UPDATE ON journey_checklist_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_journey_notes_updated_at();

DROP TRIGGER IF EXISTS update_journey_daily_notes_updated_at ON journey_daily_notes;
CREATE TRIGGER update_journey_daily_notes_updated_at
  BEFORE UPDATE ON journey_daily_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_journey_notes_updated_at();

-- Comentários
COMMENT ON TABLE journey_checklist_log IS 'Logs de marcação dos itens do checklist da jornada';
COMMENT ON TABLE journey_checklist_notes IS 'Notas opcionais dos itens do checklist da jornada';
COMMENT ON TABLE journey_daily_notes IS 'Anotações de reflexão diária da jornada';

