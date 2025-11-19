-- =====================================================
-- MIGRAÇÃO: Criar tabela de histórico emocional e comportamental
-- =====================================================
-- Esta tabela armazena registros emocionais e comportamentais das clientes

CREATE TABLE IF NOT EXISTS emotional_behavioral_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Data do registro
  record_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Tipo de registro
  record_type VARCHAR(50) NOT NULL, -- 'emocional', 'comportamental', 'ambos'
  
  -- Registro Emocional
  emotional_state VARCHAR(100), -- 'ansioso', 'estressado', 'motivado', 'desanimado', 'equilibrado', 'outro'
  emotional_notes TEXT,
  stress_level INTEGER, -- Nível de estresse (1-10)
  mood_score INTEGER, -- Score de humor (1-10)
  sleep_quality VARCHAR(50), -- 'otimo', 'bom', 'regular', 'ruim', 'pessimo'
  energy_level VARCHAR(50), -- 'alta', 'media', 'baixa'
  
  -- Registro Comportamental
  adherence_score INTEGER, -- Score de adesão ao programa (1-10)
  meal_following_percentage DECIMAL(5,2), -- Percentual de refeições seguidas
  exercise_frequency VARCHAR(50), -- Frequência de exercícios
  water_intake_liters DECIMAL(4,2), -- Ingestão de água (litros)
  behavioral_notes TEXT,
  
  -- Padrões identificados
  patterns_identified TEXT[], -- Padrões identificados (ex: ['come por ansiedade', 'pula refeições'])
  triggers TEXT[], -- Gatilhos identificados (ex: ['trabalho', 'fim de semana'])
  
  -- Observações gerais
  notes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_client_id ON emotional_behavioral_history(client_id);
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_user_id ON emotional_behavioral_history(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_record_date ON emotional_behavioral_history(record_date);
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_type ON emotional_behavioral_history(record_type);

-- RLS
ALTER TABLE emotional_behavioral_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (remover se existirem e recriar)
DROP POLICY IF EXISTS "Users can view own emotional behavioral history" ON emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can insert own emotional behavioral history" ON emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can update own emotional behavioral history" ON emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can delete own emotional behavioral history" ON emotional_behavioral_history;

CREATE POLICY "Users can view own emotional behavioral history" ON emotional_behavioral_history 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emotional behavioral history" ON emotional_behavioral_history 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own emotional behavioral history" ON emotional_behavioral_history 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own emotional behavioral history" ON emotional_behavioral_history 
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_emotional_behavioral_updated_at BEFORE UPDATE ON emotional_behavioral_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verificar se a tabela foi criada
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'emotional_behavioral_history'
ORDER BY ordinal_position;

