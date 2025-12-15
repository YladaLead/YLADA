-- =====================================================
-- MIGRATION 171: CRIAR TABELA DE SAÚDE E DIGESTÃO
-- Data: Dezembro 2025
-- Descrição: Cria tabela para armazenar dados de saúde, medicamentos e digestão dos clientes
-- =====================================================

CREATE TABLE IF NOT EXISTS coach_client_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Problemas de saúde
  health_problems TEXT[],
  
  -- Medicamentos (JSONB para flexibilidade: [{name, dose}])
  medications JSONB DEFAULT '[]'::jsonb,
  
  -- Restrições alimentares
  dietary_restrictions TEXT[],
  
  -- Suplementos
  supplements_current TEXT[],
  supplements_recommended TEXT[],
  
  -- Intestino e digestão
  bowel_function VARCHAR(50), -- 'diario', 'dias_alternados', 'constipacao', 'diarreia'
  digestive_complaints TEXT[], -- ['estufamento', 'gases', 'refluxo', 'dor_abdominal']
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir um registro por cliente
  UNIQUE(client_id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_coach_client_health_client_id ON coach_client_health(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_client_health_user_id ON coach_client_health(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_client_health_bowel_function ON coach_client_health(bowel_function);

-- Índice GIN para arrays (busca eficiente)
CREATE INDEX IF NOT EXISTS idx_coach_client_health_health_problems ON coach_client_health USING GIN(health_problems);
CREATE INDEX IF NOT EXISTS idx_coach_client_health_dietary_restrictions ON coach_client_health USING GIN(dietary_restrictions);
CREATE INDEX IF NOT EXISTS idx_coach_client_health_digestive_complaints ON coach_client_health USING GIN(digestive_complaints);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_coach_client_health_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger se já existir antes de criar
DROP TRIGGER IF EXISTS trigger_update_coach_client_health_updated_at ON coach_client_health;

CREATE TRIGGER trigger_update_coach_client_health_updated_at
BEFORE UPDATE ON coach_client_health
FOR EACH ROW
EXECUTE FUNCTION update_coach_client_health_updated_at();

-- Comentários para documentação
COMMENT ON TABLE coach_client_health IS 'Dados de saúde, medicamentos e digestão dos clientes';
COMMENT ON COLUMN coach_client_health.health_problems IS 'Lista de problemas de saúde relatados';
COMMENT ON COLUMN coach_client_health.medications IS 'Array JSON com medicamentos: [{name, dose}]';
COMMENT ON COLUMN coach_client_health.dietary_restrictions IS 'Lista de restrições alimentares (intolerâncias, alergias, preferências)';
COMMENT ON COLUMN coach_client_health.supplements_current IS 'Suplementos que o cliente já usa';
COMMENT ON COLUMN coach_client_health.supplements_recommended IS 'Suplementos indicados pela coach';
COMMENT ON COLUMN coach_client_health.bowel_function IS 'Funcionamento intestinal: diario, dias_alternados, constipacao, diarreia';
COMMENT ON COLUMN coach_client_health.digestive_complaints IS 'Lista de queixas digestivas';
