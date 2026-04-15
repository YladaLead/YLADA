-- Pro Estética Corporal: espaço da dona (evolução Pro YLADA) — liga user_id ao leader_tenant corporal.
-- Mantém leader_tenant_id para scripts, Noel, flows, etc. Acesso ao produto passa a poder ser modelado por esta linha.
-- PRÉ-REQUISITOS: 301 (leader_tenants), 305 (vertical_code).

CREATE TABLE IF NOT EXISTS public.pro_estetica_corporal_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  leader_tenant_id uuid NOT NULL REFERENCES public.leader_tenants (id) ON DELETE CASCADE,
  CONSTRAINT pro_estetica_corporal_settings_user_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_pro_estetica_corporal_settings_leader_tenant
  ON public.pro_estetica_corporal_settings (leader_tenant_id);

COMMENT ON TABLE public.pro_estetica_corporal_settings IS
  'Pro Estética Corporal: uma linha por dona (user_id) apontando ao leader_tenants da vertical estetica-corporal.';

CREATE OR REPLACE FUNCTION public.pro_estetica_corporal_settings_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_pro_estetica_corporal_settings_updated_at ON public.pro_estetica_corporal_settings;
CREATE TRIGGER tr_pro_estetica_corporal_settings_updated_at
  BEFORE UPDATE ON public.pro_estetica_corporal_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.pro_estetica_corporal_settings_set_updated_at();

ALTER TABLE public.pro_estetica_corporal_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pro_estetica_corporal_settings_select_own ON public.pro_estetica_corporal_settings;
CREATE POLICY pro_estetica_corporal_settings_select_own ON public.pro_estetica_corporal_settings
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS pro_estetica_corporal_settings_insert_own ON public.pro_estetica_corporal_settings;
CREATE POLICY pro_estetica_corporal_settings_insert_own ON public.pro_estetica_corporal_settings
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS pro_estetica_corporal_settings_update_own ON public.pro_estetica_corporal_settings;
CREATE POLICY pro_estetica_corporal_settings_update_own ON public.pro_estetica_corporal_settings
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Donas que já têm tenant corporal em leader_tenants
INSERT INTO public.pro_estetica_corporal_settings (user_id, leader_tenant_id, created_at, updated_at)
SELECT lt.owner_user_id, lt.id, lt.created_at, lt.updated_at
FROM public.leader_tenants lt
WHERE trim(coalesce(lt.vertical_code, '')) = 'estetica-corporal'
ON CONFLICT (user_id) DO NOTHING;
