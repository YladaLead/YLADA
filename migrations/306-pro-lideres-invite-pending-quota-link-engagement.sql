-- Pro Líderes: limite de convites pendentes por tenant + função para saber se o membro já teve visualização em link com token pl_m.

ALTER TABLE leader_tenants
  ADD COLUMN IF NOT EXISTS team_invite_pending_quota INTEGER NOT NULL DEFAULT 30;

COMMENT ON COLUMN leader_tenants.team_invite_pending_quota IS
  'Máximo de convites em estado pending e ainda não expirados que o líder pode ter ao mesmo tempo.';

CREATE OR REPLACE FUNCTION public.pro_lideres_user_ids_with_pl_link_views(p_ids uuid[])
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT (e.utm_json->>'pl_member_user_id')::uuid
  FROM ylada_link_events e
  WHERE e.event_type IN ('view', 'result_view')
    AND e.utm_json ? 'pl_member_user_id'
    AND (e.utm_json->>'pl_member_user_id')::uuid = ANY (p_ids);
$$;

COMMENT ON FUNCTION public.pro_lideres_user_ids_with_pl_link_views(uuid[]) IS
  'Pro Líderes: IDs de membros que já receberam pelo menos uma view/result_view em link público com atribuição pl_m.';
