-- =====================================================
-- perfume_usage em ylada_diagnosis_metrics (PERFUME_PROFILE).
-- Permite ao vendedor filtrar/qualificar leads por ocasião de uso.
-- =====================================================

ALTER TABLE ylada_diagnosis_metrics
  ADD COLUMN IF NOT EXISTS perfume_usage TEXT;

CREATE INDEX IF NOT EXISTS idx_ylada_diagnosis_metrics_perfume_usage
  ON ylada_diagnosis_metrics(perfume_usage)
  WHERE perfume_usage IS NOT NULL;

COMMENT ON COLUMN ylada_diagnosis_metrics.perfume_usage IS 'Uso principal do perfume (PERFUME_PROFILE): dia_a_dia, trabalho, encontros, eventos.';
