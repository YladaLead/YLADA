-- YLADA Pro Líderes: tenant por líder (owner = auth.users).
-- Execute no Supabase (SQL editor). RLS: só o dono lê/atualiza/insere a própria linha.

CREATE TABLE IF NOT EXISTS leader_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  display_name TEXT,
  team_name TEXT,
  whatsapp TEXT,
  contact_email TEXT,
  focus_notes TEXT,
  CONSTRAINT leader_tenants_owner_unique UNIQUE (owner_user_id),
  CONSTRAINT leader_tenants_slug_unique UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_leader_tenants_owner ON leader_tenants (owner_user_id);
CREATE INDEX IF NOT EXISTS idx_leader_tenants_slug ON leader_tenants (slug);

CREATE OR REPLACE FUNCTION leader_tenants_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_leader_tenants_updated_at ON leader_tenants;
CREATE TRIGGER tr_leader_tenants_updated_at
  BEFORE UPDATE ON leader_tenants
  FOR EACH ROW
  EXECUTE FUNCTION leader_tenants_set_updated_at();

ALTER TABLE leader_tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leader_tenants_select_own ON leader_tenants;
DROP POLICY IF EXISTS leader_tenants_insert_own ON leader_tenants;
DROP POLICY IF EXISTS leader_tenants_update_own ON leader_tenants;

CREATE POLICY leader_tenants_select_own ON leader_tenants
  FOR SELECT TO authenticated
  USING (owner_user_id = auth.uid());

CREATE POLICY leader_tenants_insert_own ON leader_tenants
  FOR INSERT TO authenticated
  WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY leader_tenants_update_own ON leader_tenants
  FOR UPDATE TO authenticated
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

COMMENT ON TABLE leader_tenants IS
  'Pro Líderes: um tenant por líder; onboarding e convites escopados a owner_user_id.';
