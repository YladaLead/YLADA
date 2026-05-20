-- Assinatura Mercado Pago recorrente — Pro Estética Capilar (painel + consultoria).

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
    'pro_lideres_noel_member',
    'pro_estetica_capilar'
  ));

COMMENT ON CONSTRAINT subscriptions_area_check ON public.subscriptions IS
  'Áreas válidas; pro_estetica_capilar = mensalidade MP do painel Pro Estética Capilar (estende ylada_estetica_consult_clients.access_valid_until).';
