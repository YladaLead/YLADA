-- Pro Estética Corporal: scripts pessoais do profissional (por tenant).
-- PRÉ-REQUISITOS: 301 (leader_tenants), 302 (leader_tenant_members).

CREATE TABLE IF NOT EXISTS leader_tenant_estetica_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'geral'
    CHECK (category IN ('captar', 'retencao', 'acompanhar', 'geral')),
  CONSTRAINT leader_tenant_estetica_scripts_title_nonempty CHECK (length(trim(title)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_leader_tenant_estetica_scripts_tenant
  ON leader_tenant_estetica_scripts (leader_tenant_id, sort_order);

CREATE OR REPLACE FUNCTION leader_tenant_estetica_scripts_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_leader_tenant_estetica_scripts_updated_at ON leader_tenant_estetica_scripts;
CREATE TRIGGER tr_leader_tenant_estetica_scripts_updated_at
  BEFORE UPDATE ON leader_tenant_estetica_scripts
  FOR EACH ROW
  EXECUTE FUNCTION leader_tenant_estetica_scripts_set_updated_at();

ALTER TABLE leader_tenant_estetica_scripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leader_tenant_estetica_scripts_select ON leader_tenant_estetica_scripts;
DROP POLICY IF EXISTS leader_tenant_estetica_scripts_insert_owner ON leader_tenant_estetica_scripts;
DROP POLICY IF EXISTS leader_tenant_estetica_scripts_update_owner ON leader_tenant_estetica_scripts;
DROP POLICY IF EXISTS leader_tenant_estetica_scripts_delete_owner ON leader_tenant_estetica_scripts;

CREATE POLICY leader_tenant_estetica_scripts_select ON leader_tenant_estetica_scripts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_estetica_scripts.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leader_tenant_members m
      WHERE m.leader_tenant_id = leader_tenant_estetica_scripts.leader_tenant_id
        AND m.user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_estetica_scripts_insert_owner ON leader_tenant_estetica_scripts
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_estetica_scripts_update_owner ON leader_tenant_estetica_scripts
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_estetica_scripts.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_estetica_scripts_delete_owner ON leader_tenant_estetica_scripts
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_estetica_scripts.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

COMMENT ON TABLE leader_tenant_estetica_scripts IS
  'Pro Estética Corporal: roteiros de texto guardados pelo dono do tenant (profissional).';
