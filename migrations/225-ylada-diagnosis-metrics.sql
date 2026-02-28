-- =====================================================
-- Métricas do diagnóstico (motor de decisão YLADA).
-- Objetivo: medir quais bloqueios/arquiteturas/níveis mais convertem (clique WhatsApp).
-- @see docs/LINKS-INTELIGENTES-DIAGNOSIS-ENGINE-SPEC.md
-- =====================================================

CREATE TABLE IF NOT EXISTS ylada_diagnosis_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  link_id UUID NOT NULL REFERENCES ylada_links(id) ON DELETE CASCADE,
  flow_id TEXT,
  architecture TEXT NOT NULL,
  level TEXT,
  main_blocker TEXT NOT NULL,
  fallback_used BOOLEAN NOT NULL DEFAULT false,
  clicked_whatsapp BOOLEAN NOT NULL DEFAULT false,
  clicked_at TIMESTAMPTZ,
  time_to_click_ms INTEGER,
  theme TEXT,
  objective TEXT
);

CREATE INDEX IF NOT EXISTS idx_ylada_diagnosis_metrics_link ON ylada_diagnosis_metrics(link_id);
CREATE INDEX IF NOT EXISTS idx_ylada_diagnosis_metrics_created ON ylada_diagnosis_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ylada_diagnosis_metrics_architecture ON ylada_diagnosis_metrics(architecture);
CREATE INDEX IF NOT EXISTS idx_ylada_diagnosis_metrics_main_blocker ON ylada_diagnosis_metrics(main_blocker);
CREATE INDEX IF NOT EXISTS idx_ylada_diagnosis_metrics_clicked ON ylada_diagnosis_metrics(clicked_whatsapp) WHERE clicked_whatsapp = true;

COMMENT ON TABLE ylada_diagnosis_metrics IS 'Métricas por diagnóstico: arquitetura, bloqueio, nível; conversão (clique WhatsApp) e tempo até clique.';
