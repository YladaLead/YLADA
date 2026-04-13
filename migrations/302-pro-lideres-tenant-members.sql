-- Pro Líderes: membros do tenant (líder + equipe). O dono do tenant (leader_tenants.owner_user_id)
-- tem sempre uma linha role = leader (via trigger no INSERT de leader_tenants).

DO $$
BEGIN
  CREATE TYPE leader_tenant_member_role AS ENUM ('leader', 'member');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS leader_tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role leader_tenant_member_role NOT NULL DEFAULT 'member',
  CONSTRAINT leader_tenant_members_tenant_user_unique UNIQUE (leader_tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_leader_tenant_members_tenant ON leader_tenant_members (leader_tenant_id);
CREATE INDEX IF NOT EXISTS idx_leader_tenant_members_user ON leader_tenant_members (user_id);

ALTER TABLE leader_tenant_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leader_tenant_members_select_tenant ON leader_tenant_members;
DROP POLICY IF EXISTS leader_tenant_members_insert_by_owner ON leader_tenant_members;
DROP POLICY IF EXISTS leader_tenant_members_delete_by_owner ON leader_tenant_members;

-- Ver todas as linhas do mesmo tenant em que participo (líder ou membro).
CREATE POLICY leader_tenant_members_select_tenant ON leader_tenant_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_members.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leader_tenant_members m2
      WHERE m2.leader_tenant_id = leader_tenant_members.leader_tenant_id
        AND m2.user_id = auth.uid()
    )
  );

-- Só o dono do tenant adiciona membros (convites na próxima etapa).
CREATE POLICY leader_tenant_members_insert_by_owner ON leader_tenant_members
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    AND role = 'member'
  );

CREATE POLICY leader_tenant_members_delete_by_owner ON leader_tenant_members
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

-- Membros podem ler a linha do tenant (painel partilhado).
DROP POLICY IF EXISTS leader_tenants_select_member ON leader_tenants;
CREATE POLICY leader_tenants_select_member ON leader_tenants
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT leader_tenant_id FROM leader_tenant_members WHERE user_id = auth.uid()
    )
  );

-- Backfill: uma linha leader por tenant existente.
INSERT INTO leader_tenant_members (leader_tenant_id, user_id, role)
SELECT id, owner_user_id, 'leader'::leader_tenant_member_role
FROM leader_tenants
ON CONFLICT (leader_tenant_id, user_id) DO NOTHING;

-- Novos tenants: registar o dono como líder na tabela de membros (bypass RLS).
CREATE OR REPLACE FUNCTION leader_tenants_after_insert_add_owner_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO leader_tenant_members (leader_tenant_id, user_id, role)
  VALUES (NEW.id, NEW.owner_user_id, 'leader'::leader_tenant_member_role)
  ON CONFLICT (leader_tenant_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_leader_tenants_after_insert_member ON leader_tenants;
CREATE TRIGGER tr_leader_tenants_after_insert_member
  AFTER INSERT ON leader_tenants
  FOR EACH ROW
  EXECUTE FUNCTION leader_tenants_after_insert_add_owner_member();

COMMENT ON TABLE leader_tenant_members IS
  'Pro Líderes: quem pertence ao tenant; role leader = administrador do espaço, member = equipe.';
