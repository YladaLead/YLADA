-- Piloto: Noel unificado na matriz por tenant (Fase 2).
-- RLS já habilitado em leader_tenants (migration 301).

ALTER TABLE public.leader_tenants
  ADD COLUMN IF NOT EXISTS noel_unified_pilot_enabled boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.leader_tenants.noel_unified_pilot_enabled IS
  'Quando true, equipe e líder usam POST /api/ylada/noel com contexto Pro Líderes (piloto unificação).';

-- Presidente piloto: Deise Faula — Noel equipe ligado + motor unificado.
UPDATE public.leader_tenants lt
SET
  noel_unified_pilot_enabled = true,
  noel_member_offer_enabled = true,
  noel_member_offer_scope = 'all_members'
FROM auth.users u
WHERE lt.owner_user_id = u.id
  AND lower(trim(u.email)) = lower('deisefaula@gmail.com');
