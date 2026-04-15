-- Pro Estética Corporal: links de onboarding (consultoria / implantação) por e-mail — mesmo padrão que Pro Líderes.
-- Respostas aplicadas ao leader_tenants (vertical estetica-corporal) quando a dona entra no painel.

CREATE TABLE IF NOT EXISTS public.pro_estetica_corporal_onboarding_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  professional_name text NOT NULL,
  invited_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  questionnaire_answers jsonb,
  response_completed_at timestamptz,
  applied_to_tenant_at timestamptz,
  linked_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  linked_leader_tenant_id uuid REFERENCES public.leader_tenants (id) ON DELETE SET NULL,
  created_by_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pec_onboarding_status_check
    CHECK (status IN ('pending', 'completed', 'cancelled', 'expired')),
  CONSTRAINT pec_onboarding_email_nonempty
    CHECK (length(trim(invited_email)) > 3),
  CONSTRAINT pec_onboarding_name_nonempty
    CHECK (length(trim(professional_name)) > 1)
);

CREATE INDEX IF NOT EXISTS idx_pec_onboarding_email
  ON public.pro_estetica_corporal_onboarding_links (lower(invited_email), created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pec_onboarding_status
  ON public.pro_estetica_corporal_onboarding_links (status, expires_at);

CREATE OR REPLACE FUNCTION public.pro_estetica_corporal_onboarding_links_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_pec_onboarding_links_updated_at ON public.pro_estetica_corporal_onboarding_links;
CREATE TRIGGER tr_pec_onboarding_links_updated_at
  BEFORE UPDATE ON public.pro_estetica_corporal_onboarding_links
  FOR EACH ROW
  EXECUTE FUNCTION public.pro_estetica_corporal_onboarding_links_set_updated_at();

ALTER TABLE public.pro_estetica_corporal_onboarding_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pec_onboarding_select_own_email ON public.pro_estetica_corporal_onboarding_links;
CREATE POLICY pec_onboarding_select_own_email
  ON public.pro_estetica_corporal_onboarding_links
  FOR SELECT TO authenticated
  USING (lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

DROP POLICY IF EXISTS pec_onboarding_update_own_email ON public.pro_estetica_corporal_onboarding_links;
CREATE POLICY pec_onboarding_update_own_email
  ON public.pro_estetica_corporal_onboarding_links
  FOR UPDATE TO authenticated
  USING (lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  WITH CHECK (lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

COMMENT ON TABLE public.pro_estetica_corporal_onboarding_links IS
  'Onboarding Pro Estética Corporal: questionário por link; dados aplicados ao tenant corporal da dona (e-mail).';
