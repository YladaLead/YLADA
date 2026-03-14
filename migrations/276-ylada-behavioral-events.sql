-- =====================================================
-- Eventos comportamentais unificados para analytics e valuation.
-- Permite construir análises: conversão, retenção, funil, etc.
-- @see docs/ARQUITETURA-DADOS-COMPORTAMENTAIS-YLADA.md
-- =====================================================

CREATE TABLE IF NOT EXISTS ylada_behavioral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'user_created',
    'diagnosis_created',
    'diagnosis_answered',
    'noel_analysis_used',
    'diagnosis_shared',
    'lead_contact_clicked',
    'upgrade_to_pro'
  )),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  link_id UUID REFERENCES ylada_links(id) ON DELETE SET NULL,
  metrics_id UUID REFERENCES ylada_diagnosis_metrics(id) ON DELETE SET NULL,
  payload JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ylada_behav_events_type ON ylada_behavioral_events(event_type);
CREATE INDEX IF NOT EXISTS idx_ylada_behav_events_user ON ylada_behavioral_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ylada_behav_events_created ON ylada_behavioral_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ylada_behav_events_link ON ylada_behavioral_events(link_id);

COMMENT ON TABLE ylada_behavioral_events IS 'Eventos comportamentais para analytics e valuation: user_created, diagnosis_answered, lead_contact_clicked, etc.';

-- RLS: leitura apenas dos próprios eventos
ALTER TABLE ylada_behavioral_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY ylada_behav_events_select ON ylada_behavioral_events
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
