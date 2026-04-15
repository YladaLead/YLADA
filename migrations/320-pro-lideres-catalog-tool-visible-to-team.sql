-- Pro Líderes / catálogo: o líder define quais ferramentas a equipe vê (biblioteca YLADA + fluxos em leader_tenant_flow_entries).
-- PRÉ-REQUISITO: 304 (leader_tenant_flow_entries), 207 ou equivalente (ylada_links).

ALTER TABLE leader_tenant_flow_entries
  ADD COLUMN IF NOT EXISTS visible_to_team BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN leader_tenant_flow_entries.visible_to_team IS
  'Se false, só o líder vê esta entrada no catálogo; membros não (API filtra).';

CREATE TABLE IF NOT EXISTS leader_tenant_catalog_ylada_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  ylada_link_id UUID NOT NULL REFERENCES ylada_links (id) ON DELETE CASCADE,
  visible_to_team BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT leader_tenant_catalog_ylada_visibility_unique UNIQUE (leader_tenant_id, ylada_link_id)
);

CREATE INDEX IF NOT EXISTS idx_leader_tenant_catalog_ylada_visibility_tenant
  ON leader_tenant_catalog_ylada_visibility (leader_tenant_id);

COMMENT ON TABLE leader_tenant_catalog_ylada_visibility IS
  'Override por tenant: visibilidade de ferramentas YLADA no catálogo para membros. Ausência de linha = visível para a equipe.';

CREATE OR REPLACE FUNCTION leader_tenant_catalog_ylada_visibility_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_leader_tenant_catalog_ylada_visibility_updated_at ON leader_tenant_catalog_ylada_visibility;
CREATE TRIGGER tr_leader_tenant_catalog_ylada_visibility_updated_at
  BEFORE UPDATE ON leader_tenant_catalog_ylada_visibility
  FOR EACH ROW
  EXECUTE FUNCTION leader_tenant_catalog_ylada_visibility_set_updated_at();

ALTER TABLE leader_tenant_catalog_ylada_visibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leader_tenant_catalog_ylada_visibility_select ON leader_tenant_catalog_ylada_visibility;
DROP POLICY IF EXISTS leader_tenant_catalog_ylada_visibility_write_owner ON leader_tenant_catalog_ylada_visibility;

CREATE POLICY leader_tenant_catalog_ylada_visibility_select ON leader_tenant_catalog_ylada_visibility
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_catalog_ylada_visibility.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leader_tenant_members m
      WHERE m.leader_tenant_id = leader_tenant_catalog_ylada_visibility.leader_tenant_id
        AND m.user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_catalog_ylada_visibility_write_owner ON leader_tenant_catalog_ylada_visibility
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_catalog_ylada_visibility.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_catalog_ylada_visibility.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

-- Membros só veem fluxos custom com visible_to_team = true.
DROP POLICY IF EXISTS leader_tenant_flow_entries_select ON leader_tenant_flow_entries;

CREATE POLICY leader_tenant_flow_entries_select ON leader_tenant_flow_entries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_flow_entries.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR (
      EXISTS (
        SELECT 1 FROM leader_tenant_members m
        WHERE m.leader_tenant_id = leader_tenant_flow_entries.leader_tenant_id
          AND m.user_id = auth.uid()
      )
      AND leader_tenant_flow_entries.visible_to_team IS TRUE
    )
  );
