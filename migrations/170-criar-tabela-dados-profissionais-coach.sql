-- =====================================================
-- MIGRATION 170: CRIAR TABELA DE DADOS PROFISSIONAIS
-- Data: Dezembro 2025
-- Descrição: Cria tabela para armazenar dados profissionais e rotina dos clientes
-- =====================================================

CREATE TABLE IF NOT EXISTS coach_client_professional (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados profissionais
  occupation VARCHAR(255),
  work_start_time TIME,
  work_end_time TIME,
  
  -- Rotina
  wake_time TIME,
  sleep_time TIME,
  
  -- Casa e família
  who_cooks VARCHAR(255),
  household_members TEXT,
  takes_lunchbox BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir um registro por cliente
  UNIQUE(client_id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_coach_client_professional_client_id ON coach_client_professional(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_client_professional_user_id ON coach_client_professional(user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_coach_client_professional_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger se já existir antes de criar
DROP TRIGGER IF EXISTS trigger_update_coach_client_professional_updated_at ON coach_client_professional;

CREATE TRIGGER trigger_update_coach_client_professional_updated_at
BEFORE UPDATE ON coach_client_professional
FOR EACH ROW
EXECUTE FUNCTION update_coach_client_professional_updated_at();

-- Comentários para documentação
COMMENT ON TABLE coach_client_professional IS 'Dados profissionais e rotina dos clientes';
COMMENT ON COLUMN coach_client_professional.occupation IS 'Profissão ou área de atuação';
COMMENT ON COLUMN coach_client_professional.work_start_time IS 'Horário de início do trabalho';
COMMENT ON COLUMN coach_client_professional.work_end_time IS 'Horário de término do trabalho';
COMMENT ON COLUMN coach_client_professional.wake_time IS 'Horário que acorda';
COMMENT ON COLUMN coach_client_professional.sleep_time IS 'Horário que dorme';
COMMENT ON COLUMN coach_client_professional.who_cooks IS 'Quem cozinha em casa';
COMMENT ON COLUMN coach_client_professional.household_members IS 'Quem vive na casa';
COMMENT ON COLUMN coach_client_professional.takes_lunchbox IS 'Se leva marmita para o trabalho';
