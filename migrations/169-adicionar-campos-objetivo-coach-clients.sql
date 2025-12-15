-- =====================================================
-- MIGRATION 169: ADICIONAR CAMPOS DE OBJETIVO E META
-- Data: Dezembro 2025
-- Descrição: Adiciona campos estruturados para objetivo e meta na tabela coach_clients
-- =====================================================

-- Adicionar campos de objetivo e meta
ALTER TABLE coach_clients
ADD COLUMN IF NOT EXISTS current_weight DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS current_height DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS goal_weight DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS goal_deadline DATE,
ADD COLUMN IF NOT EXISTS goal_type VARCHAR(50);

-- Comentários para documentação
COMMENT ON COLUMN coach_clients.current_weight IS 'Peso atual do cliente em kg';
COMMENT ON COLUMN coach_clients.current_height IS 'Altura atual do cliente em metros';
COMMENT ON COLUMN coach_clients.goal_weight IS 'Meta de peso desejada em kg';
COMMENT ON COLUMN coach_clients.goal_deadline IS 'Prazo desejado para alcançar a meta';
COMMENT ON COLUMN coach_clients.goal_type IS 'Tipo de objetivo: emagrecimento, saude, estetica, energia, qualidade_vida';

-- Criar índice para busca por tipo de objetivo
CREATE INDEX IF NOT EXISTS idx_coach_clients_goal_type ON coach_clients(goal_type);

-- Verificar se os campos foram criados
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'coach_clients'
  AND column_name IN ('current_weight', 'current_height', 'goal_weight', 'goal_deadline', 'goal_type')
ORDER BY column_name;
