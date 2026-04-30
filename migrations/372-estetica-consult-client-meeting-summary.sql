-- Resumo da reunião por ficha (consultoria estética): lembrete do que foi tratado na call.

ALTER TABLE ylada_estetica_consult_clients
  ADD COLUMN IF NOT EXISTS meeting_summary TEXT;

COMMENT ON COLUMN ylada_estetica_consult_clients.meeting_summary IS
  'Resumo da reunião pré-diagnóstico (admin): lembrete do combinado na call após o pré.';
