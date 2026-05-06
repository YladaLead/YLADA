-- Recalcula catalog_kind a partir do href (atalho vs caminho /l/…).
-- PRÉ-REQUISITO: 416 (coluna catalog_kind).

UPDATE leader_tenant_flow_entries
SET catalog_kind = CASE
  WHEN length(trim(href)) > 3 AND lower(trim(href)) LIKE '/l/%' THEN 'ylada_diagnosis'
  ELSE 'external_link'
END;
