-- Pro Líderes: tabuladores por espaço (lista no convite da equipe; o líder gere no painel).

CREATE TABLE IF NOT EXISTS leader_tenant_tabulators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT leader_tenant_tabulators_label_nonempty CHECK (char_length(trim(label)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_leader_tenant_tabulators_tenant
  ON leader_tenant_tabulators (leader_tenant_id, sort_order, label);

CREATE UNIQUE INDEX IF NOT EXISTS leader_tenant_tabulators_tenant_lower_label_unique
  ON leader_tenant_tabulators (leader_tenant_id, lower(trim(label)));

COMMENT ON TABLE leader_tenant_tabulators IS
  'Nomes de tabulador definidos pelo líder; aparecem no convite para a equipe escolher.';

ALTER TABLE leader_tenant_tabulators ENABLE ROW LEVEL SECURITY;

-- Apenas service role (API Next) acede; sem policies para authenticated.
-- Evita expor leitura direta no browser sem passar pela API.

-- Opcional: alinhar espaços existentes aos nomes que a app usava antes da lista dinâmica.
INSERT INTO leader_tenant_tabulators (leader_tenant_id, label, sort_order)
SELECT lt.id, x.label, x.sort_order
FROM leader_tenants lt
CROSS JOIN (VALUES ('Lilian', 0), ('Alexandre', 1)) AS x(label, sort_order)
WHERE NOT EXISTS (
  SELECT 1
  FROM leader_tenant_tabulators t
  WHERE t.leader_tenant_id = lt.id
    AND lower(trim(t.label)) = lower(trim(x.label))
);
