-- Controle de uso mensal do Noel para freemium (análises avançadas).
-- @see docs/SPEC-FREEMIUM-YLADA.md
CREATE TABLE IF NOT EXISTS ylada_noel_monthly_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_ref TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, month_ref)
);

CREATE INDEX IF NOT EXISTS idx_ylada_noel_monthly_usage_user_month
  ON ylada_noel_monthly_usage(user_id, month_ref);

COMMENT ON TABLE ylada_noel_monthly_usage IS 'Contagem de análises avançadas do Noel por usuário/mês (freemium).';

-- RLS: usuários podem ler apenas seu próprio uso (API usa service role e bypassa RLS)
ALTER TABLE ylada_noel_monthly_usage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ylada_noel_usage_select_own ON ylada_noel_monthly_usage;
CREATE POLICY ylada_noel_usage_select_own ON ylada_noel_monthly_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
