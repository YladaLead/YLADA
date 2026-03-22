-- =====================================================
-- subscriptions: permitir area ylada + segmentos da matriz
-- =====================================================
-- Sem isso, POST /api/admin/subscriptions/free com area ylada falha com:
--   new row violates check constraint "subscriptions_area_check"
-- Rode no SQL Editor do Supabase (projeto de produção).

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
    'seller'
  ));

COMMENT ON CONSTRAINT subscriptions_area_check ON public.subscriptions IS
  'Áreas válidas incluem ylada (plano free/cortesia matriz /pt) e segmentos do perfil.';
