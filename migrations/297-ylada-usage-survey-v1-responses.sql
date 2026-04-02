-- Pesquisa de feedback v1 (página pública /pt/pesquisa-uso-ylada/v1).
-- Insert apenas via service role (API). Leitura: painel admin ou SQL no Supabase.

CREATE TABLE IF NOT EXISTS ylada_usage_survey_v1_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  experience_rating SMALLINT NOT NULL CHECK (experience_rating BETWEEN 1 AND 5),
  recommend BOOLEAN NOT NULL,
  liked TEXT,
  improve TEXT,
  future_feature TEXT,
  helped_situation TEXT,
  additional TEXT
);

CREATE INDEX IF NOT EXISTS idx_ylada_usage_survey_v1_created ON ylada_usage_survey_v1_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ylada_usage_survey_v1_rating ON ylada_usage_survey_v1_responses(experience_rating);
CREATE INDEX IF NOT EXISTS idx_ylada_usage_survey_v1_recommend ON ylada_usage_survey_v1_responses(recommend);

ALTER TABLE ylada_usage_survey_v1_responses ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ylada_usage_survey_v1_responses IS
  'Respostas anônimas da pesquisa de feedback v1 (satisfação, NPS sim/não, textos abertos); sem user_id.';
