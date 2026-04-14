-- Pro Líderes: notas do líder por fluxo (necessidade, quando usar, objetivo).
-- Idempotente.

ALTER TABLE leader_tenant_flow_entries
  ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN leader_tenant_flow_entries.notes IS
  'Texto livre do líder: necessidade, contexto ou quando usar este fluxo (mostrado no catálogo).';
