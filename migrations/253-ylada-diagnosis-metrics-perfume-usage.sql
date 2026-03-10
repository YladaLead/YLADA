-- =====================================================
-- perfume_usage: uso principal do perfume (PERFUME_PROFILE).
-- Valores: dia_a_dia, trabalho, encontros, eventos.
-- Permite ao vendedor qualificar leads por ocasião de uso.
-- =====================================================

ALTER TABLE ylada_diagnosis_metrics
  ADD COLUMN IF NOT EXISTS perfume_usage TEXT;

COMMENT ON COLUMN ylada_diagnosis_metrics.perfume_usage IS 'Uso principal do perfume (PERFUME_PROFILE): dia_a_dia, trabalho, encontros, eventos.';
