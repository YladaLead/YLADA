-- Pro Líderes: links de onboarding do líder (criados no admin)
-- para captar respostas e aplicar configuração inicial por e-mail.

CREATE TABLE IF NOT EXISTS pro_lideres_leader_onboarding_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  leader_name TEXT NOT NULL,
  invited_email TEXT NOT NULL,
  segment_code TEXT NOT NULL DEFAULT 'h-lider',
  status TEXT NOT NULL DEFAULT 'pending',
  questionnaire_answers JSONB,
  response_completed_at TIMESTAMPTZ,
  applied_to_tenant_at TIMESTAMPTZ,
  linked_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  linked_leader_tenant_id UUID REFERENCES leader_tenants (id) ON DELETE SET NULL,
  created_by_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT pro_lideres_leader_onboarding_links_status_check
    CHECK (status IN ('pending', 'completed', 'cancelled', 'expired')),
  CONSTRAINT pro_lideres_leader_onboarding_links_email_nonempty
    CHECK (length(trim(invited_email)) > 3),
  CONSTRAINT pro_lideres_leader_onboarding_links_leader_name_nonempty
    CHECK (length(trim(leader_name)) > 1)
);

CREATE INDEX IF NOT EXISTS idx_pl_leader_onboarding_email
  ON pro_lideres_leader_onboarding_links (lower(invited_email), created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pl_leader_onboarding_status
  ON pro_lideres_leader_onboarding_links (status, expires_at);

CREATE INDEX IF NOT EXISTS idx_pl_leader_onboarding_segment
  ON pro_lideres_leader_onboarding_links (segment_code, created_at DESC);

CREATE OR REPLACE FUNCTION pro_lideres_leader_onboarding_links_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_pl_leader_onboarding_links_updated_at ON pro_lideres_leader_onboarding_links;
CREATE TRIGGER tr_pl_leader_onboarding_links_updated_at
  BEFORE UPDATE ON pro_lideres_leader_onboarding_links
  FOR EACH ROW
  EXECUTE FUNCTION pro_lideres_leader_onboarding_links_set_updated_at();

ALTER TABLE pro_lideres_leader_onboarding_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pro_lideres_leader_onboarding_select_own_email ON pro_lideres_leader_onboarding_links;
CREATE POLICY pro_lideres_leader_onboarding_select_own_email
  ON pro_lideres_leader_onboarding_links
  FOR SELECT
  USING (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

DROP POLICY IF EXISTS pro_lideres_leader_onboarding_update_own_email ON pro_lideres_leader_onboarding_links;
CREATE POLICY pro_lideres_leader_onboarding_update_own_email
  ON pro_lideres_leader_onboarding_links
  FOR UPDATE
  USING (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  WITH CHECK (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

COMMENT ON TABLE pro_lideres_leader_onboarding_links IS
  'Links de onboarding do líder criados no admin para coleta de questionário e aplicação automática no tenant Pro Líderes.';
