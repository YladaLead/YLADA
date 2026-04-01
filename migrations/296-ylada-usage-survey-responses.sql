-- Pesquisa anônima de uso do YLADA (página pública /pt/pesquisa-uso-ylada).
-- Insert apenas via service role (API). Leitura: painel admin ou SQL no Supabase.

CREATE TABLE IF NOT EXISTS ylada_usage_survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  profile TEXT NOT NULL CHECK (profile IN ('1', '2', '3', '4')),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ylada_usage_survey_created ON ylada_usage_survey_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ylada_usage_survey_profile ON ylada_usage_survey_responses(profile);

ALTER TABLE ylada_usage_survey_responses ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ylada_usage_survey_responses IS
  'Respostas anônimas da pesquisa de uso; sem user_id. Perfil 1–4 = funil criar→compartilhar→conversar.';
