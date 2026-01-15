-- =====================================================
-- TABELAS PARA INTEGRAÇÃO Z-API WHATSAPP
-- =====================================================

-- 1. z_api_instances - Instâncias Z-API configuradas
CREATE TABLE IF NOT EXISTS z_api_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  name VARCHAR(255) NOT NULL, -- Nome da instância (ex: "Ylada Nutri", "Ylada Wellness")
  instance_id VARCHAR(255) NOT NULL UNIQUE, -- ID da instância na Z-API
  token VARCHAR(500) NOT NULL, -- Token de autenticação (criptografado)
  
  -- Configuração
  area VARCHAR(50), -- 'nutri', 'wellness', 'coach', etc.
  phone_number VARCHAR(20), -- Número de WhatsApp conectado
  status VARCHAR(20) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
  
  -- Webhook
  webhook_url TEXT, -- URL do webhook configurada
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_z_api_instances_area ON z_api_instances(area);
CREATE INDEX IF NOT EXISTS idx_z_api_instances_status ON z_api_instances(status);
CREATE INDEX IF NOT EXISTS idx_z_api_instances_instance_id ON z_api_instances(instance_id);

-- 2. whatsapp_conversations - Conversas WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  instance_id UUID NOT NULL REFERENCES z_api_instances(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL, -- Número do cliente (com DDD e código do país)
  name VARCHAR(255), -- Nome do cliente (quando disponível)
  
  -- Contexto
  area VARCHAR(50), -- 'nutri', 'wellness', etc. (identificado automaticamente)
  context JSONB, -- Contexto adicional (tags, categorias, etc.)
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'blocked'
  is_bot_active BOOLEAN DEFAULT true, -- Se bot está ativo para esta conversa
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_from VARCHAR(20) DEFAULT 'customer', -- 'customer', 'agent', 'bot'
  
  -- Métricas
  total_messages INTEGER DEFAULT 0,
  unread_count INTEGER DEFAULT 0,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_instance ON whatsapp_conversations(instance_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_phone ON whatsapp_conversations(phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_area ON whatsapp_conversations(area);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_status ON whatsapp_conversations(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_last_message ON whatsapp_conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_unread ON whatsapp_conversations(unread_count) WHERE unread_count > 0;

-- 3. whatsapp_messages - Mensagens individuais
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamento
  conversation_id UUID NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
  instance_id UUID NOT NULL REFERENCES z_api_instances(id) ON DELETE CASCADE,
  
  -- Identificação Z-API
  z_api_message_id VARCHAR(255), -- ID da mensagem na Z-API
  
  -- Remetente
  sender_type VARCHAR(20) NOT NULL, -- 'customer', 'agent', 'bot'
  sender_id UUID REFERENCES auth.users(id), -- Se for agente
  sender_name VARCHAR(255), -- Nome do remetente
  sender_phone VARCHAR(20), -- Telefone do remetente
  
  -- Conteúdo
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'audio', 'video', 'document', 'location'
  media_url TEXT, -- URL da mídia (se houver)
  
  -- Status
  status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
  status_updated_at TIMESTAMP WITH TIME ZONE,
  
  -- Bot/Automação
  is_bot_response BOOLEAN DEFAULT false,
  bot_type VARCHAR(50), -- 'noel', 'nutri', 'wellness', etc.
  bot_response_source VARCHAR(50), -- 'auto', 'faq', 'script', etc.
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_conversation ON whatsapp_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_instance ON whatsapp_messages(instance_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created ON whatsapp_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_sender ON whatsapp_messages(sender_type, sender_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_z_api_id ON whatsapp_messages(z_api_message_id);

-- 4. whatsapp_notifications - Notificações para administradores
CREATE TABLE IF NOT EXISTS whatsapp_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamento
  conversation_id UUID REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES whatsapp_messages(id) ON DELETE CASCADE,
  
  -- Destinatário
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'new_message', 'unread_count', 'conversation_assigned'
  
  -- Status
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Conteúdo
  title VARCHAR(255),
  message TEXT,
  metadata JSONB, -- Dados adicionais
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_whatsapp_notifications_user ON whatsapp_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_notifications_sent ON whatsapp_notifications(sent, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_notifications_read ON whatsapp_notifications(read) WHERE read = false;

-- =====================================================
-- FUNÇÕES AUXILIARES
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_whatsapp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_z_api_instances_updated_at
    BEFORE UPDATE ON z_api_instances
    FOR EACH ROW EXECUTE FUNCTION update_whatsapp_updated_at();

CREATE TRIGGER update_whatsapp_conversations_updated_at
    BEFORE UPDATE ON whatsapp_conversations
    FOR EACH ROW EXECUTE FUNCTION update_whatsapp_updated_at();

-- Função para atualizar contadores de conversa
CREATE OR REPLACE FUNCTION update_conversation_counters()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar total_messages e last_message_at
    UPDATE whatsapp_conversations
    SET 
        total_messages = total_messages + 1,
        last_message_at = NEW.created_at,
        last_message_from = NEW.sender_type,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    
    -- Incrementar unread_count se for mensagem do cliente
    IF NEW.sender_type = 'customer' THEN
        UPDATE whatsapp_conversations
        SET unread_count = unread_count + 1
        WHERE id = NEW.conversation_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contadores
CREATE TRIGGER update_conversation_on_new_message
    AFTER INSERT ON whatsapp_messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_counters();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE z_api_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_notifications ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar conforme necessário)
-- Admin pode ver tudo
CREATE POLICY "Admin can manage z_api_instances" ON z_api_instances
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Usuários podem ver conversas e mensagens (ajustar conforme regras de negócio)
CREATE POLICY "Users can view conversations" ON whatsapp_conversations
    FOR SELECT USING (true); -- Ajustar conforme necessário

CREATE POLICY "Users can view messages" ON whatsapp_messages
    FOR SELECT USING (true); -- Ajustar conforme necessário

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE z_api_instances IS 'Instâncias Z-API configuradas no sistema';
COMMENT ON TABLE whatsapp_conversations IS 'Conversas WhatsApp com clientes';
COMMENT ON TABLE whatsapp_messages IS 'Mensagens individuais das conversas';
COMMENT ON TABLE whatsapp_notifications IS 'Notificações para administradores sobre novas mensagens';
