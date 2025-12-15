-- =====================================================
-- MIGRATION 172: CRIAR TABELA DE HÁBITOS ALIMENTARES
-- Data: Dezembro 2025
-- Descrição: Cria tabela para armazenar hábitos alimentares detalhados dos clientes
-- =====================================================

CREATE TABLE IF NOT EXISTS coach_client_food_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Ingestão de água
  water_intake_liters DECIMAL(4,2),
  
  -- Refeições habituais
  breakfast TEXT,
  morning_snack TEXT,
  lunch TEXT,
  afternoon_snack TEXT,
  dinner TEXT,
  supper TEXT,
  
  -- Beliscos
  snacks_between_meals BOOLEAN DEFAULT false,
  snacks_description TEXT,
  
  -- Bebidas
  alcohol_consumption VARCHAR(255),
  soda_consumption VARCHAR(255),
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir um registro por cliente
  UNIQUE(client_id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_coach_client_food_habits_client_id ON coach_client_food_habits(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_client_food_habits_user_id ON coach_client_food_habits(user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_coach_client_food_habits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger se já existir antes de criar
DROP TRIGGER IF EXISTS trigger_update_coach_client_food_habits_updated_at ON coach_client_food_habits;

CREATE TRIGGER trigger_update_coach_client_food_habits_updated_at
BEFORE UPDATE ON coach_client_food_habits
FOR EACH ROW
EXECUTE FUNCTION update_coach_client_food_habits_updated_at();

-- Comentários para documentação
COMMENT ON TABLE coach_client_food_habits IS 'Hábitos alimentares detalhados dos clientes';
COMMENT ON COLUMN coach_client_food_habits.water_intake_liters IS 'Quantidade de água ingerida por dia em litros';
COMMENT ON COLUMN coach_client_food_habits.breakfast IS 'Alimentação habitual no café da manhã';
COMMENT ON COLUMN coach_client_food_habits.morning_snack IS 'Lanche da manhã';
COMMENT ON COLUMN coach_client_food_habits.lunch IS 'Alimentação habitual no almoço';
COMMENT ON COLUMN coach_client_food_habits.afternoon_snack IS 'Lanche da tarde';
COMMENT ON COLUMN coach_client_food_habits.dinner IS 'Alimentação habitual no jantar';
COMMENT ON COLUMN coach_client_food_habits.supper IS 'Ceia';
COMMENT ON COLUMN coach_client_food_habits.snacks_between_meals IS 'Se belisca entre as refeições';
COMMENT ON COLUMN coach_client_food_habits.snacks_description IS 'Descrição do que belisca';
COMMENT ON COLUMN coach_client_food_habits.alcohol_consumption IS 'Consumo de bebida alcoólica';
COMMENT ON COLUMN coach_client_food_habits.soda_consumption IS 'Consumo de refrigerante';
