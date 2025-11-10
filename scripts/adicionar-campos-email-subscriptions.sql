-- Adicionar campos para rastrear envio de e-mails de boas-vindas
-- Isso evita enviar múltiplos e-mails para o mesmo pagamento

DO $$ 
BEGIN
  -- Adicionar campo welcome_email_sent
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'welcome_email_sent'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN welcome_email_sent BOOLEAN DEFAULT FALSE;
    COMMENT ON COLUMN subscriptions.welcome_email_sent IS 'true = e-mail de boas-vindas já foi enviado';
  END IF;

  -- Adicionar campo welcome_email_sent_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'welcome_email_sent_at'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN welcome_email_sent_at TIMESTAMP WITH TIME ZONE;
    COMMENT ON COLUMN subscriptions.welcome_email_sent_at IS 'Data/hora em que o e-mail de boas-vindas foi enviado';
  END IF;
END $$;

-- Criar índice para buscar assinaturas que precisam de e-mail
CREATE INDEX IF NOT EXISTS idx_subscriptions_welcome_email 
ON subscriptions(welcome_email_sent, status, created_at)
WHERE welcome_email_sent = false AND status = 'active';

