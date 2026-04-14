-- Pro Líderes: assinatura mensal (Mercado Pago) + área em subscriptions + cota padrão 50 convites pendentes.

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
    'pro_lideres_team'
  ));

COMMENT ON CONSTRAINT subscriptions_area_check ON public.subscriptions IS
  'Áreas válidas incluem pro_lideres_team (equipe Pro Líderes, recorrente MP).';

ALTER TABLE leader_tenants
  ALTER COLUMN team_invite_pending_quota SET DEFAULT 50;

UPDATE leader_tenants
SET team_invite_pending_quota = 50
WHERE team_invite_pending_quota = 30;
