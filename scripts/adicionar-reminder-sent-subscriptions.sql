-- Adicionar campo reminder_sent na tabela subscriptions
-- Para controlar se já foi enviado aviso de renovação

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'reminder_sent'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN reminder_sent BOOLEAN DEFAULT NULL;
    COMMENT ON COLUMN subscriptions.reminder_sent IS 'true = aviso enviado, false = precisa enviar, NULL = não aplicável (assinatura automática)';
  END IF;
END $$;

-- Criar índice para buscar assinaturas que precisam de aviso
CREATE INDEX IF NOT EXISTS idx_subscriptions_reminder_sent 
ON subscriptions(reminder_sent, current_period_end, status, plan_type)
WHERE reminder_sent = false AND status = 'active' AND plan_type = 'monthly';

