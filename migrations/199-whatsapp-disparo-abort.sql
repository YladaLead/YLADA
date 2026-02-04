-- Tabela para sinalizar "parar disparo" em massa (remarketing, welcome, reminders).
-- Quando o admin clica "Parar disparo", gravamos requested_at; o loop do disparo verifica a cada iteração.
CREATE TABLE IF NOT EXISTS whatsapp_disparo_abort (
  tipo text PRIMARY KEY,
  requested_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE whatsapp_disparo_abort IS 'Abort request para disparos em massa: remarketing, welcome, reminders';
