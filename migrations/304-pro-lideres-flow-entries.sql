-- Entradas de fluxo por tenant: vendas vs recrutamento (URLs + título; custom do líder).
-- Defaults são mesclados na app; linhas aqui = extras ou overrides futuros.
--
-- PRÉ-REQUISITOS (ordem no Supabase SQL Editor):
--   1) 301-pro-lideres-leader-tenants.sql   → leader_tenants
--   2) 302-pro-lideres-tenant-members.sql   → leader_tenant_members (obrigatório: a policy SELECT abaixo referencia esta tabela)
--   3) 303-pro-lideres-tenant-invites.sql   → convites (recomendado antes de produção)
--   4) este ficheiro
--
-- Erro "relation leader_tenant_members does not exist" = aplicar 302 antes da 304.

CREATE TABLE IF NOT EXISTS leader_tenant_flow_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('sales', 'recruitment')),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT leader_tenant_flow_entries_label_nonempty CHECK (length(trim(label)) > 0),
  CONSTRAINT leader_tenant_flow_entries_href_nonempty CHECK (length(trim(href)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_leader_tenant_flow_entries_tenant ON leader_tenant_flow_entries (leader_tenant_id);
CREATE INDEX IF NOT EXISTS idx_leader_tenant_flow_entries_category ON leader_tenant_flow_entries (leader_tenant_id, category);

CREATE OR REPLACE FUNCTION leader_tenant_flow_entries_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_leader_tenant_flow_entries_updated_at ON leader_tenant_flow_entries;
CREATE TRIGGER tr_leader_tenant_flow_entries_updated_at
  BEFORE UPDATE ON leader_tenant_flow_entries
  FOR EACH ROW
  EXECUTE FUNCTION leader_tenant_flow_entries_set_updated_at();

ALTER TABLE leader_tenant_flow_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leader_tenant_flow_entries_select ON leader_tenant_flow_entries;
DROP POLICY IF EXISTS leader_tenant_flow_entries_insert_owner ON leader_tenant_flow_entries;
DROP POLICY IF EXISTS leader_tenant_flow_entries_update_owner ON leader_tenant_flow_entries;
DROP POLICY IF EXISTS leader_tenant_flow_entries_delete_owner ON leader_tenant_flow_entries;

CREATE POLICY leader_tenant_flow_entries_select ON leader_tenant_flow_entries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_flow_entries.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leader_tenant_members m
      WHERE m.leader_tenant_id = leader_tenant_flow_entries.leader_tenant_id
        AND m.user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_flow_entries_insert_owner ON leader_tenant_flow_entries
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_flow_entries_update_owner ON leader_tenant_flow_entries
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_flow_entries.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_flow_entries_delete_owner ON leader_tenant_flow_entries
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_flow_entries.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

COMMENT ON TABLE leader_tenant_flow_entries IS
  'Pro Líderes: fluxos por nome (vendas vs recrutamento); href aponta para ferramentas Wellness/YLADA ou URLs externas.';
