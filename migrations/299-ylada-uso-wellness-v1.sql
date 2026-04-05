-- Pesquisa de uso wellness / Herbalife (pública /uso-wellness-v1).
-- Respostas em JSONB; bloco Noel opcional.

CREATE TABLE IF NOT EXISTS ylada_uso_wellness_v1_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  optional_noel BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_uso_wellness_v1_created ON ylada_uso_wellness_v1_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uso_wellness_v1_noel ON ylada_uso_wellness_v1_responses(optional_noel);

ALTER TABLE ylada_uso_wellness_v1_responses ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ylada_uso_wellness_v1_responses IS
  'Pesquisa enxuta de uso YLADA + opcional Noel; insert via service role (API).';
