-- Um link "principal" por (material global, clínica): URL estável para copiar no admin.
-- Links adicionais continuam válidos; o principal é o mais antigo por par (retrocompatível).

ALTER TABLE ylada_estetica_consultancy_share_links
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN ylada_estetica_consultancy_share_links.is_primary IS
  'Quando true: link canónico desta clínica para este material (copiar no painel). Novos links extra ficam com false.';

UPDATE ylada_estetica_consultancy_share_links
SET is_primary = FALSE
WHERE estetica_consult_client_id IS NOT NULL;

WITH first_links AS (
  SELECT DISTINCT ON (material_id, estetica_consult_client_id) id
  FROM ylada_estetica_consultancy_share_links
  WHERE estetica_consult_client_id IS NOT NULL
  ORDER BY material_id, estetica_consult_client_id, created_at ASC NULLS LAST
)
UPDATE ylada_estetica_consultancy_share_links s
SET is_primary = TRUE
FROM first_links f
WHERE s.id = f.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ylada_estetica_share_one_primary_per_clinic_material
  ON ylada_estetica_consultancy_share_links (material_id, estetica_consult_client_id)
  WHERE is_primary = TRUE AND estetica_consult_client_id IS NOT NULL;
