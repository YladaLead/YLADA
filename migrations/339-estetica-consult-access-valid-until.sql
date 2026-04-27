-- Data até à qual a cliente pode usar o serviço (mensalidade/anuidade) — definida manualmente no admin.
-- Base para lembretes e bloqueio futuros no painel Pro Estética.

ALTER TABLE ylada_estetica_consult_clients
  ADD COLUMN IF NOT EXISTS access_valid_until DATE;

CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consult_clients_access_valid_until
  ON ylada_estetica_consult_clients (access_valid_until);

COMMENT ON COLUMN ylada_estetica_consult_clients.access_valid_until IS
  'Até esta data (inclusive, calendário) o acesso está válido; notificação automática e bloqueio são futuros.';
