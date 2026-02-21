-- =====================================================
-- Função para obter contagens de eventos por link (view, start, complete, cta_click).
-- Uso: SELECT * FROM get_ylada_link_stats(ARRAY['uuid1','uuid2']::uuid[]);
-- @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md
-- =====================================================

CREATE OR REPLACE FUNCTION get_ylada_link_stats(link_ids uuid[])
RETURNS TABLE (link_id uuid, event_type text, cnt bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.link_id, e.event_type, count(*)::bigint
  FROM ylada_link_events e
  WHERE e.link_id = ANY(link_ids)
  GROUP BY e.link_id, e.event_type;
$$;

COMMENT ON FUNCTION get_ylada_link_stats(uuid[]) IS 'Retorna contagens por link_id e event_type para uso na listagem de links YLADA.';
