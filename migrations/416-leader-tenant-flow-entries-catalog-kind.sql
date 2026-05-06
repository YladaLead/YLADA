-- Pro Líderes / catálogo: distingue atalhos genéricos de entradas marcadas como diagnóstico YLADA (3 níveis).
-- PRÉ-REQUISITO: 304 (leader_tenant_flow_entries).

ALTER TABLE leader_tenant_flow_entries
  ADD COLUMN IF NOT EXISTS catalog_kind TEXT NOT NULL DEFAULT 'external_link'
    CHECK (catalog_kind IN ('external_link', 'ylada_diagnosis'));

COMMENT ON COLUMN leader_tenant_flow_entries.catalog_kind IS
  'external_link = atalho (nome + href). ylada_diagnosis = ferramenta YLADA com resultado em três níveis (leve / moderado / urgente); o href deve ser caminho /l/…';
