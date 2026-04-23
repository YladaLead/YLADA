-- Diagnóstico corporal: confirmação por e-mail antes de exibir o formulário (link associado ao e-mail da clínica).

ALTER TABLE ylada_estetica_consultancy_share_links
  ADD COLUMN IF NOT EXISTS recipient_email TEXT,
  ADD COLUMN IF NOT EXISTS recipient_confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_confirm_token TEXT,
  ADD COLUMN IF NOT EXISTS email_confirm_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_confirmation_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN ylada_estetica_consultancy_share_links.recipient_email IS
  'E-mail da clínica para enviar o link de confirmação (diagnóstico corporal global).';
COMMENT ON COLUMN ylada_estetica_consultancy_share_links.recipient_confirmed_at IS
  'Após clicar no link do e-mail, o formulário público fica disponível.';
