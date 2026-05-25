-- Desativa presets Pro Líderes "Metabolismo lento / Inchaço" (substituído por avaliacao-perfil-metabolico).
-- status = archived → fora do catálogo (só active) e /l/[slug] deixa de abrir para visitantes.

UPDATE public.ylada_links
SET status = 'archived',
    updated_at = NOW()
WHERE status = 'active'
  AND (
    (config_json->'meta'->>'pro_lideres_fluxo_id') = 'metabolismo-lento'
    OR slug ~ '-v-metabolismo-lento$'
  );
