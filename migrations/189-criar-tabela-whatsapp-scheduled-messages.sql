-- =====================================================
-- TABELA: whatsapp_scheduled_messages
-- Sistema de agendamento de mensagens WhatsApp
-- =====================================================

CREATE TABLE IF NOT EXISTS whatsapp_scheduled_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamento
  conversation_id UUID REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
  phone VARCHAR(20), -- Telefone (para casos sem conversa ainda)
  
  -- Tipo e agendamento
  message_type VARCHAR(50) NOT NULL, -- 'welcome', 'pre_class_24h', 'pre_class_12h', 'pre_class_2h', 'pre_class_30min', 'reminder_12h'
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'cancelled', 'failed'
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Dados da mensagem
  message_data JSONB, -- { message: string, session_id?: string, etc }
  
  -- Metadados
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_reason TEXT, -- 'user_responded', 'manual', etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_status ON whatsapp_scheduled_messages(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_conversation ON whatsapp_scheduled_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_phone ON whatsapp_scheduled_messages(phone);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_type ON whatsapp_scheduled_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_pending ON whatsapp_scheduled_messages(status, scheduled_for) WHERE status = 'pending';

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_whatsapp_scheduled_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_whatsapp_scheduled_messages_updated_at
    BEFORE UPDATE ON whatsapp_scheduled_messages
    FOR EACH ROW EXECUTE FUNCTION update_whatsapp_scheduled_messages_updated_at();

-- Comentários
COMMENT ON TABLE whatsapp_scheduled_messages IS 'Mensagens WhatsApp agendadas para envio futuro';
COMMENT ON COLUMN whatsapp_scheduled_messages.message_type IS 'Tipo: welcome, pre_class_24h, pre_class_12h, pre_class_2h, pre_class_30min, reminder_12h';
COMMENT ON COLUMN whatsapp_scheduled_messages.status IS 'Status: pending (aguardando), sent (enviada), cancelled (cancelada), failed (falhou)';
COMMENT ON COLUMN whatsapp_scheduled_messages.message_data IS 'Dados da mensagem em JSON: { message: string, session_id?: string, lead_name?: string }';
