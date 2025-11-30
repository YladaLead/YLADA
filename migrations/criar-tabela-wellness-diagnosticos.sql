-- =====================================================
-- YLADA WELLNESS SYSTEM - Tabela de Diagnósticos
-- =====================================================
-- Armazena resultados dos diagnósticos dos fluxos de clientes
-- e recrutamento do Wellness System

CREATE TABLE IF NOT EXISTS wellness_diagnosticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fluxo_id VARCHAR(100) NOT NULL, -- ID do fluxo (ex: 'energia-matinal', 'metabolismo-lento')
  fluxo_tipo VARCHAR(50) NOT NULL DEFAULT 'cliente', -- 'cliente' ou 'recrutamento'
  fluxo_nome VARCHAR(255) NOT NULL, -- Nome do fluxo para referência
  
  -- Respostas do diagnóstico
  respostas JSONB NOT NULL, -- { perguntaId: resposta, ... }
  
  -- Resultado do diagnóstico
  perfil_identificado VARCHAR(255), -- Perfil identificado pelo diagnóstico
  kit_recomendado VARCHAR(50), -- 'energia', 'acelera', 'ambos'
  score INTEGER, -- Score de 0-100 baseado nas respostas
  
  -- Dados do lead (opcional - se coletado)
  nome_lead VARCHAR(255),
  email_lead VARCHAR(255),
  telefone_lead VARCHAR(20),
  whatsapp_lead VARCHAR(20),
  
  -- Metadados
  ip_address INET,
  user_agent TEXT,
  source VARCHAR(50) DEFAULT 'wellness-system', -- Origem do diagnóstico
  conversao BOOLEAN DEFAULT false, -- Se houve conversão (clicou no WhatsApp)
  conversao_at TIMESTAMP WITH TIME ZONE, -- Quando houve a conversão
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_wellness_diagnosticos_user_id ON wellness_diagnosticos(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_diagnosticos_fluxo_id ON wellness_diagnosticos(fluxo_id);
CREATE INDEX IF NOT EXISTS idx_wellness_diagnosticos_fluxo_tipo ON wellness_diagnosticos(fluxo_tipo);
CREATE INDEX IF NOT EXISTS idx_wellness_diagnosticos_created_at ON wellness_diagnosticos(created_at);
CREATE INDEX IF NOT EXISTS idx_wellness_diagnosticos_conversao ON wellness_diagnosticos(conversao) WHERE conversao = true;
CREATE INDEX IF NOT EXISTS idx_wellness_diagnosticos_kit_recomendado ON wellness_diagnosticos(kit_recomendado);

-- Índice GIN para busca em JSONB
CREATE INDEX IF NOT EXISTS idx_wellness_diagnosticos_respostas ON wellness_diagnosticos USING GIN (respostas);

-- Comentários para documentação
COMMENT ON TABLE wellness_diagnosticos IS 'Armazena resultados dos diagnósticos do Wellness System';
COMMENT ON COLUMN wellness_diagnosticos.fluxo_id IS 'ID do fluxo usado (ex: energia-matinal, metabolismo-lento)';
COMMENT ON COLUMN wellness_diagnosticos.fluxo_tipo IS 'Tipo do fluxo: cliente (vendas) ou recrutamento';
COMMENT ON COLUMN wellness_diagnosticos.respostas IS 'JSON com todas as respostas do diagnóstico';
COMMENT ON COLUMN wellness_diagnosticos.score IS 'Score de 0-100 calculado baseado nas respostas';
COMMENT ON COLUMN wellness_diagnosticos.conversao IS 'Indica se o lead clicou no botão WhatsApp (conversão)';

