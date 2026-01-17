-- =====================================================
-- TABELAS PARA SISTEMA DE AUTOMAÇÃO WHATSAPP
-- =====================================================

-- 1. Regras de Automação (quando e como responder automaticamente)
CREATE TABLE IF NOT EXISTS whatsapp_automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  name VARCHAR(255) NOT NULL, -- Nome da regra (ex: "Boas-vindas", "Resposta FAQ")
  area VARCHAR(50), -- 'nutri', 'wellness', 'all'
  instance_id UUID REFERENCES z_api_instances(id),
  
  -- Condições (quando a regra deve ser executada)
  trigger_type VARCHAR(50) NOT NULL, -- 'keyword', 'first_message', 'time_based', 'ai_based'
  trigger_conditions JSONB, -- Condições específicas (palavras-chave, horários, etc.)
  
  -- Ações (o que fazer quando a regra é acionada)
  action_type VARCHAR(50) NOT NULL, -- 'send_message', 'forward', 'tag', 'assign'
  action_data JSONB, -- Dados da ação (mensagem, destinatário, etc.)
  
  -- Configuração
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0, -- Prioridade (maior = executa primeiro)
  cooldown_seconds INTEGER DEFAULT 0, -- Tempo mínimo entre execuções (evitar spam)
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_automation_rules_area ON whatsapp_automation_rules(area);
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON whatsapp_automation_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_automation_rules_priority ON whatsapp_automation_rules(priority DESC);

-- 2. Regras de Notificação (quando e como notificar administradores)
CREATE TABLE IF NOT EXISTS whatsapp_notification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  name VARCHAR(255) NOT NULL, -- Nome da regra (ex: "Horário comercial", "Mensagens urgentes")
  area VARCHAR(50), -- 'nutri', 'wellness', 'all'
  
  -- Condições (quando notificar)
  conditions JSONB NOT NULL, -- Ex: { "hours": [9, 10, 11, 14, 15, 16, 17], "keywords": ["urgente", "emergência"] }
  
  -- Ações (como notificar)
  notification_method VARCHAR(50) DEFAULT 'whatsapp', -- 'whatsapp', 'email', 'push', 'all'
  notification_phone VARCHAR(20), -- Número para notificar (se método = whatsapp)
  notification_email VARCHAR(255), -- Email para notificar (se método = email)
  
  -- Configuração
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  min_importance INTEGER DEFAULT 0, -- Nível mínimo de importância para notificar (0-10)
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notification_rules_area ON whatsapp_notification_rules(area);
CREATE INDEX IF NOT EXISTS idx_notification_rules_active ON whatsapp_notification_rules(is_active);

-- 3. Logs de Automação (histórico de execuções)
CREATE TABLE IF NOT EXISTS whatsapp_automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referências
  rule_id UUID REFERENCES whatsapp_automation_rules(id),
  conversation_id UUID REFERENCES whatsapp_conversations(id),
  message_id UUID REFERENCES whatsapp_messages(id),
  
  -- Dados da execução
  trigger_type VARCHAR(50),
  action_type VARCHAR(50),
  action_result JSONB, -- Resultado da ação (sucesso, erro, etc.)
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'executed', 'failed', 'skipped'
  error_message TEXT,
  
  -- Metadados
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  execution_time_ms INTEGER -- Tempo de execução em milissegundos
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_automation_logs_rule ON whatsapp_automation_logs(rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_conversation ON whatsapp_automation_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_status ON whatsapp_automation_logs(status);
CREATE INDEX IF NOT EXISTS idx_automation_logs_executed_at ON whatsapp_automation_logs(executed_at DESC);

-- 4. Mensagens Automáticas (templates de mensagens)
CREATE TABLE IF NOT EXISTS whatsapp_automation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  name VARCHAR(255) NOT NULL, -- Nome do template (ex: "Boas-vindas Nutri", "FAQ Preço")
  area VARCHAR(50), -- 'nutri', 'wellness', 'all'
  
  -- Conteúdo
  message_text TEXT NOT NULL, -- Texto da mensagem (suporta variáveis {{nome}}, {{telefone}}, etc.)
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'document', 'template'
  media_url TEXT, -- URL de mídia (se message_type != text)
  
  -- Configuração
  variables JSONB, -- Variáveis disponíveis para substituição
  is_active BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_automation_messages_area ON whatsapp_automation_messages(area);
CREATE INDEX IF NOT EXISTS idx_automation_messages_active ON whatsapp_automation_messages(is_active);

-- Comentários nas tabelas
COMMENT ON TABLE whatsapp_automation_rules IS 'Regras de automação para envio automático de mensagens';
COMMENT ON TABLE whatsapp_notification_rules IS 'Regras para determinar quando e como notificar administradores';
COMMENT ON TABLE whatsapp_automation_logs IS 'Logs de execução das automações';
COMMENT ON TABLE whatsapp_automation_messages IS 'Templates de mensagens automáticas';
