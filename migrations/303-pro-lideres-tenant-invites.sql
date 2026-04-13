-- Convites para entrar na equipe de um tenant Pro Líderes (e-mail + token; aceite via API com sessão).

DO $$
BEGIN
  CREATE TYPE leader_tenant_invite_status AS ENUM ('pending', 'used', 'expired', 'revoked');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS leader_tenant_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  invited_email TEXT NOT NULL,
  created_by_user_id UUID NOT NULL REFERENCES auth.users (id),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  used_by_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  status leader_tenant_invite_status NOT NULL DEFAULT 'pending',
  CONSTRAINT leader_tenant_invites_token_unique UNIQUE (token)
);

CREATE INDEX IF NOT EXISTS idx_leader_tenant_invites_tenant ON leader_tenant_invites (leader_tenant_id);
CREATE INDEX IF NOT EXISTS idx_leader_tenant_invites_token ON leader_tenant_invites (token);
CREATE INDEX IF NOT EXISTS idx_leader_tenant_invites_email_lower ON leader_tenant_invites (lower(invited_email));

ALTER TABLE leader_tenant_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leader_tenant_invites_select_owner ON leader_tenant_invites;
DROP POLICY IF EXISTS leader_tenant_invites_insert_owner ON leader_tenant_invites;
DROP POLICY IF EXISTS leader_tenant_invites_update_owner ON leader_tenant_invites;

CREATE POLICY leader_tenant_invites_select_owner ON leader_tenant_invites
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_invites.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

CREATE POLICY leader_tenant_invites_insert_owner ON leader_tenant_invites
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    AND created_by_user_id = auth.uid()
  );

CREATE POLICY leader_tenant_invites_update_owner ON leader_tenant_invites
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_invites.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
  );

COMMENT ON TABLE leader_tenant_invites IS
  'Convite Pro Líderes: link com token; o e-mail convidado deve coincidir com a sessão ao aceitar.';
