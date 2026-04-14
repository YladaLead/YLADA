-- Pro Líderes: por sequência (grupo), o líder decide se a equipe vê no painel (copiar/colar).
-- PRÉ-REQUISITO: 312 (leader_tenant_pl_script_sections).

ALTER TABLE leader_tenant_pl_script_sections
  ADD COLUMN IF NOT EXISTS visible_to_team BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN leader_tenant_pl_script_sections.visible_to_team IS
  'Se false, só o líder vê esta sequência; a equipe não a vê no painel.';

-- Membros só veem secções com visible_to_team = true; o dono continua a ver tudo.
DROP POLICY IF EXISTS leader_tenant_pl_script_sections_select ON leader_tenant_pl_script_sections;

CREATE POLICY leader_tenant_pl_script_sections_select ON leader_tenant_pl_script_sections
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_pl_script_sections.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR (
      EXISTS (
        SELECT 1 FROM leader_tenant_members m
        WHERE m.leader_tenant_id = leader_tenant_pl_script_sections.leader_tenant_id
          AND m.user_id = auth.uid()
      )
      AND leader_tenant_pl_script_sections.visible_to_team IS TRUE
    )
  );

DROP POLICY IF EXISTS leader_tenant_pl_script_entries_select ON leader_tenant_pl_script_entries;

CREATE POLICY leader_tenant_pl_script_entries_select ON leader_tenant_pl_script_entries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenant_pl_script_sections s
      JOIN leader_tenants lt ON lt.id = s.leader_tenant_id
      WHERE s.id = leader_tenant_pl_script_entries.section_id
        AND lt.owner_user_id = auth.uid()
    )
    OR (
      EXISTS (
        SELECT 1 FROM leader_tenant_pl_script_sections s
        JOIN leader_tenant_members m ON m.leader_tenant_id = s.leader_tenant_id
        WHERE s.id = leader_tenant_pl_script_entries.section_id
          AND m.user_id = auth.uid()
      )
      AND EXISTS (
        SELECT 1 FROM leader_tenant_pl_script_sections s
        WHERE s.id = leader_tenant_pl_script_entries.section_id
          AND s.visible_to_team IS TRUE
      )
    )
  );
