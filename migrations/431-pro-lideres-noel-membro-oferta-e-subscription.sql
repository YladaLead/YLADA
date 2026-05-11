-- Pro Líderes: oferta opcional do Noel para membros (líder define escopo) + área de assinatura paga pelo membro.

ALTER TABLE public.leader_tenants
  ADD COLUMN IF NOT EXISTS noel_member_offer_enabled boolean NOT NULL DEFAULT false;

ALTER TABLE public.leader_tenants
  ADD COLUMN IF NOT EXISTS noel_member_offer_scope text NOT NULL DEFAULT 'all_members';

ALTER TABLE public.leader_tenants
  DROP CONSTRAINT IF EXISTS leader_tenants_noel_member_offer_scope_check;

ALTER TABLE public.leader_tenants
  ADD CONSTRAINT leader_tenants_noel_member_offer_scope_check
  CHECK (noel_member_offer_scope IN ('all_members', 'tabulators_only'));

COMMENT ON COLUMN public.leader_tenants.noel_member_offer_enabled IS
  'Se true, o líder permite que membros elegíveis vejam Noel campo (adesão paga à parte).';

COMMENT ON COLUMN public.leader_tenants.noel_member_offer_scope IS
  'all_members: toda a equipa ativa; tabulators_only: só quem tem pro_lideres_tabulator_name preenchido.';

ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_area_check;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_area_check
  CHECK (area IN (
    'wellness',
    'nutri',
    'coach',
    'nutra',
    'ylada',
    'med',
    'psi',
    'psicanalise',
    'odonto',
    'estetica',
    'fitness',
    'perfumaria',
    'seller',
    'joias',
    'pro_lideres_team',
    'pro_lideres_noel_member'
  ));

COMMENT ON CONSTRAINT subscriptions_area_check ON public.subscriptions IS
  'Áreas válidas; inclui pro_lideres_noel_member (Noel campo Pro Líderes — add-on por membro, MP).';
