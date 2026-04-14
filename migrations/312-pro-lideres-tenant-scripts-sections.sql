-- Pro Líderes: scripts por tenant — situações (ex.: ferramenta / fase) e entradas ordenadas (título, subtítulo, texto, como usar).
-- PRÉ-REQUISITOS: 301 (leader_tenants), 302 (leader_tenant_members), 207 (ylada_links).

CREATE TABLE IF NOT EXISTS leader_tenant_pl_script_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  /** Assunto da situação (ex.: ferramenta X, antes de enviar o link). */
  title TEXT NOT NULL,
  subtitle TEXT,
  /** Liga opcionalmente a uma ferramenta YLADA do dono do tenant. */
  ylada_link_id UUID REFERENCES ylada_links (id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT leader_tenant_pl_script_sections_title_nonempty CHECK (length(trim(title)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_leader_tenant_pl_script_sections_tenant
  ON leader_tenant_pl_script_sections (leader_tenant_id, sort_order);

CREATE TABLE IF NOT EXISTS leader_tenant_pl_script_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  section_id UUID NOT NULL REFERENCES leader_tenant_pl_script_sections (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  body TEXT NOT NULL DEFAULT '',
  how_to_use TEXT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT leader_tenant_pl_script_entries_title_nonempty CHECK (length(trim(title)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_leader_tenant_pl_script_entries_section
  ON leader_tenant_pl_script_entries (section_id, sort_order);

CREATE OR REPLACE FUNCTION leader_tenant_pl_script_sections_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_leader_tenant_pl_script_sections_updated_at ON leader_tenant_pl_script_sections;
CREATE TRIGGER tr_leader_tenant_pl_script_sections_updated_at
  BEFORE UPDATE ON leader_tenant_pl_script_sections
  FOR EACH ROW
  EXECUTE FUNCTION leader_tenant_pl_script_sections_set_updated_at();

CREATE OR REPLACE FUNCTION leader_tenant_pl_script_entries_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_leader_tenant_pl_script_entries_updated_at ON leader_tenant_pl_script_entries;
CREATE TRIGGER tr_leader_tenant_pl_script_entries_updated_at
  BEFORE UPDATE ON leader_tenant_pl_script_entries
  FOR EACH ROW
  EXECUTE FUNCTION leader_tenant_pl_script_entries_set_updated_at();

ALTER TABLE leader_tenant_pl_script_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE leader_tenant_pl_script_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leader_tenant_pl_script_sections_select ON leader_tenant_pl_script_sections;
DROP POLICY IF EXISTS leader_tenant_pl_script_sections_insert_owner ON leader_tenant_pl_script_sections;
DROP POLICY IF EXISTS leader_tenant_pl_script_sections_update_owner ON leader_tenant_pl_script_sections;
DROP POLICY IF EXISTS leader_tenant_pl_script_sections_delete_owner ON leader_tenant_pl_script_sections;

CREATE POLICY leader_tenant_pl_script_sections_select ON leader_tenant_pl_script_sections
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_pl_script_sections.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leader_tenant_members m
      WHERE m.leader_tenant_id = leader_tenant_pl_script_sections.leader_tenant_id
        AND m.user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_pl_script_sections_insert_owner ON leader_tenant_pl_script_sections
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_pl_script_sections_update_owner ON leader_tenant_pl_script_sections
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_pl_script_sections.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_pl_script_sections_delete_owner ON leader_tenant_pl_script_sections
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_pl_script_sections.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS leader_tenant_pl_script_entries_select ON leader_tenant_pl_script_entries;
DROP POLICY IF EXISTS leader_tenant_pl_script_entries_insert_owner ON leader_tenant_pl_script_entries;
DROP POLICY IF EXISTS leader_tenant_pl_script_entries_update_owner ON leader_tenant_pl_script_entries;
DROP POLICY IF EXISTS leader_tenant_pl_script_entries_delete_owner ON leader_tenant_pl_script_entries;

CREATE POLICY leader_tenant_pl_script_entries_select ON leader_tenant_pl_script_entries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenant_pl_script_sections s
      JOIN leader_tenants lt ON lt.id = s.leader_tenant_id
      WHERE s.id = leader_tenant_pl_script_entries.section_id
        AND lt.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leader_tenant_pl_script_sections s
      JOIN leader_tenant_members m ON m.leader_tenant_id = s.leader_tenant_id
      WHERE s.id = leader_tenant_pl_script_entries.section_id
        AND m.user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_pl_script_entries_insert_owner ON leader_tenant_pl_script_entries
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenant_pl_script_sections s
      JOIN leader_tenants lt ON lt.id = s.leader_tenant_id
      WHERE s.id = section_id
        AND lt.owner_user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_pl_script_entries_update_owner ON leader_tenant_pl_script_entries
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenant_pl_script_sections s
      JOIN leader_tenants lt ON lt.id = s.leader_tenant_id
      WHERE s.id = leader_tenant_pl_script_entries.section_id
        AND lt.owner_user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_pl_script_entries_delete_owner ON leader_tenant_pl_script_entries
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenant_pl_script_sections s
      JOIN leader_tenants lt ON lt.id = s.leader_tenant_id
      WHERE s.id = leader_tenant_pl_script_entries.section_id
        AND lt.owner_user_id = auth.uid()
    )
  );

COMMENT ON TABLE leader_tenant_pl_script_sections IS
  'Pro Líderes: situação/ferramenta — agrupa scripts partilhados com a equipe.';
COMMENT ON TABLE leader_tenant_pl_script_entries IS
  'Pro Líderes: uma peça de roteiro (título, subtítulo, texto, como usar) ordenada dentro da situação.';
