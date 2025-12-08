-- =====================================================
-- MIGRATION 010: Tabelas para Functions do NOEL
-- Cria tabelas necessárias para integração com OpenAI Assistants
-- =====================================================

BEGIN;

-- =====================================================
-- 1. users_profile - Perfil completo do consultor
-- =====================================================
CREATE TABLE IF NOT EXISTS noel_users_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações básicas
  nivel TEXT, -- 'iniciante', 'ativo', 'produtivo', 'multiplicador', 'lider'
  tempo_disponivel TEXT, -- '15-30 min', '30-60 min', '1-2h', '2-3h', '3-5h', '5h+'
  estilo TEXT, -- estilo de trabalho do consultor
  objetivo TEXT, -- objetivo principal
  
  -- Plano e progresso
  plano_ativo_id UUID, -- referência ao plano de 90 dias ativo
  intensidade TEXT, -- intensidade do plano
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint único por usuário
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_noel_users_profile_user_id ON noel_users_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_noel_users_profile_plano_ativo ON noel_users_profile(plano_ativo_id);

COMMENT ON TABLE noel_users_profile IS 'Perfil completo do consultor para personalização do NOEL';
COMMENT ON COLUMN noel_users_profile.nivel IS 'Nível do consultor: iniciante, ativo, produtivo, multiplicador, lider';
COMMENT ON COLUMN noel_users_profile.tempo_disponivel IS 'Tempo disponível diário: 15-30 min, 30-60 min, 1-2h, 2-3h, 3-5h, 5h+';

-- =====================================================
-- 2. interactions - Histórico de interações NOEL
-- =====================================================
CREATE TABLE IF NOT EXISTS noel_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Mensagens
  user_message TEXT NOT NULL,
  noel_response TEXT NOT NULL,
  
  -- Contexto
  module TEXT, -- 'mentor', 'suporte', 'tecnico'
  source TEXT, -- 'knowledge_base', 'ia_generated', 'hybrid'
  similarity_score NUMERIC,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_noel_interactions_user_id ON noel_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_noel_interactions_created_at ON noel_interactions(created_at DESC);

COMMENT ON TABLE noel_interactions IS 'Histórico completo de interações entre consultor e NOEL';
COMMENT ON COLUMN noel_interactions.module IS 'Módulo detectado: mentor, suporte, tecnico';
COMMENT ON COLUMN noel_interactions.source IS 'Fonte da resposta: knowledge_base, ia_generated, hybrid';

-- =====================================================
-- 3. plan_progress - Progresso do plano de 90 dias
-- =====================================================
CREATE TABLE IF NOT EXISTS noel_plan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Plano
  plan_id UUID, -- referência ao plano de 90 dias
  current_day INTEGER NOT NULL DEFAULT 1, -- dia atual (1-90)
  
  -- Progresso
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint único por usuário e plano
  UNIQUE(user_id, plan_id)
);

CREATE INDEX IF NOT EXISTS idx_noel_plan_progress_user_id ON noel_plan_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_noel_plan_progress_plan_id ON noel_plan_progress(plan_id);
CREATE INDEX IF NOT EXISTS idx_noel_plan_progress_current_day ON noel_plan_progress(current_day);

COMMENT ON TABLE noel_plan_progress IS 'Progresso diário do consultor no plano de 90 dias';
COMMENT ON COLUMN noel_plan_progress.current_day IS 'Dia atual do plano (1 a 90)';

-- =====================================================
-- 4. leads - Clientes e interessados
-- =====================================================
CREATE TABLE IF NOT EXISTS noel_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dados do lead
  lead_name TEXT NOT NULL,
  lead_phone TEXT,
  lead_email TEXT,
  lead_source TEXT, -- 'indicacao', 'instagram', 'whatsapp', 'outro'
  
  -- Status
  status TEXT DEFAULT 'novo', -- 'novo', 'contato', 'interessado', 'cliente', 'inativo'
  
  -- Acompanhamento
  first_contact_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_noel_leads_user_id ON noel_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_noel_leads_status ON noel_leads(status);
CREATE INDEX IF NOT EXISTS idx_noel_leads_created_at ON noel_leads(created_at DESC);

COMMENT ON TABLE noel_leads IS 'Clientes e interessados registrados pelo NOEL';
COMMENT ON COLUMN noel_leads.lead_source IS 'Origem do lead: indicacao, instagram, whatsapp, outro';
COMMENT ON COLUMN noel_leads.status IS 'Status do lead: novo, contato, interessado, cliente, inativo';

-- =====================================================
-- 5. clients - Dados completos dos clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS noel_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES noel_leads(id) ON DELETE SET NULL,
  
  -- Dados do cliente
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  
  -- Acompanhamento
  kits_vendidos INTEGER DEFAULT 0,
  upgrade_detox BOOLEAN DEFAULT false,
  rotina_mensal BOOLEAN DEFAULT false,
  
  -- Follow-up
  last_follow_up_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'ativo', -- 'ativo', 'inativo', 'pausado'
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_noel_clients_user_id ON noel_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_noel_clients_lead_id ON noel_clients(lead_id);
CREATE INDEX IF NOT EXISTS idx_noel_clients_status ON noel_clients(status);
CREATE INDEX IF NOT EXISTS idx_noel_clients_next_follow_up ON noel_clients(next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;

COMMENT ON TABLE noel_clients IS 'Dados completos dos clientes para acompanhamento pelo NOEL';
COMMENT ON COLUMN noel_clients.kits_vendidos IS 'Quantidade de kits vendidos para o cliente';
COMMENT ON COLUMN noel_clients.upgrade_detox IS 'Se o cliente fez upgrade para Detox';
COMMENT ON COLUMN noel_clients.rotina_mensal IS 'Se o cliente tem rotina mensal estabelecida';

-- =====================================================
-- 6. Triggers para updated_at
-- =====================================================

-- Trigger para noel_users_profile
CREATE OR REPLACE FUNCTION update_noel_users_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_noel_users_profile_updated_at
  BEFORE UPDATE ON noel_users_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_noel_users_profile_updated_at();

-- Trigger para noel_plan_progress
CREATE OR REPLACE FUNCTION update_noel_plan_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_noel_plan_progress_updated_at
  BEFORE UPDATE ON noel_plan_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_noel_plan_progress_updated_at();

-- Trigger para noel_leads
CREATE OR REPLACE FUNCTION update_noel_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_noel_leads_updated_at
  BEFORE UPDATE ON noel_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_noel_leads_updated_at();

-- Trigger para noel_clients
CREATE OR REPLACE FUNCTION update_noel_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_noel_clients_updated_at
  BEFORE UPDATE ON noel_clients
  FOR EACH ROW
  EXECUTE FUNCTION update_noel_clients_updated_at();

COMMIT;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================
COMMENT ON SCHEMA public IS 'Tabelas criadas para integração do NOEL com OpenAI Assistants via Functions';
