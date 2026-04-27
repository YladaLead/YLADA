-- Flags para lembretes automáticos (cron) — repostos quando access_valid_until muda no PATCH admin.

ALTER TABLE ylada_estetica_consult_clients
  ADD COLUMN IF NOT EXISTS access_expiry_reminder_sent_15d BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS access_expiry_reminder_sent_7d BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS access_expiry_reminder_sent_1d BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN ylada_estetica_consult_clients.access_expiry_reminder_sent_15d IS
  'Cron: já enviou e-mail quando faltavam ~15 dias para access_valid_until.';
COMMENT ON COLUMN ylada_estetica_consult_clients.access_expiry_reminder_sent_7d IS
  'Cron: já enviou e-mail na janela ~7 dias.';
COMMENT ON COLUMN ylada_estetica_consult_clients.access_expiry_reminder_sent_1d IS
  'Cron: já enviou e-mail no último dia ou véspera (0–1 dias).';
