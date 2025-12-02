-- =====================================================
-- YLADA - Jornada de 30 Dias - Tabelas
-- =====================================================

-- Tabela para armazenar os dias da jornada
CREATE TABLE IF NOT EXISTS journey_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL UNIQUE,
  week_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  objective TEXT NOT NULL,
  guidance TEXT NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'pilar', 'exercicio', 'ferramenta'
  action_id UUID, -- ID do pilar, exercício ou ferramenta
  action_title VARCHAR(255), -- Título da ação prática
  checklist_items JSONB DEFAULT '[]'::jsonb, -- Array de strings
  motivational_phrase TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_journey_days_week ON journey_days(week_number);
CREATE INDEX IF NOT EXISTS idx_journey_days_day ON journey_days(day_number);
CREATE INDEX IF NOT EXISTS idx_journey_days_order ON journey_days(order_index);

-- Tabela para progresso do usuário na jornada
CREATE TABLE IF NOT EXISTS journey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  checklist_completed JSONB DEFAULT '[]'::jsonb, -- Array de booleans correspondendo aos itens
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_journey_progress_user ON journey_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_progress_day ON journey_progress(day_number);
CREATE INDEX IF NOT EXISTS idx_journey_progress_week ON journey_progress(week_number);
CREATE INDEX IF NOT EXISTS idx_journey_progress_completed ON journey_progress(user_id, completed);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_journey_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_journey_days_updated_at ON journey_days;
CREATE TRIGGER update_journey_days_updated_at
  BEFORE UPDATE ON journey_days
  FOR EACH ROW
  EXECUTE FUNCTION update_journey_updated_at();

DROP TRIGGER IF EXISTS update_journey_progress_updated_at ON journey_progress;
CREATE TRIGGER update_journey_progress_updated_at
  BEFORE UPDATE ON journey_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_journey_updated_at();

-- Comentários
COMMENT ON TABLE journey_days IS 'Dias da Jornada YLADA de 30 dias';
COMMENT ON TABLE journey_progress IS 'Progresso dos usuários na Jornada YLADA';

