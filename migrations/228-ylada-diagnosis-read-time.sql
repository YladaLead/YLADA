-- =====================================================
-- Tempo de leitura do diagnóstico (permanência na página do resultado).
-- diagnosis_shown_at = quando o resultado foi exibido (evento result_view).
-- diagnosis_read_time_ms = tempo entre exibir e clicar no CTA (ou null se não clicou).
-- Útil para tráfego pago: medir engajamento real com o conteúdo.
-- =====================================================

ALTER TABLE ylada_diagnosis_metrics
  ADD COLUMN IF NOT EXISTS diagnosis_shown_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS diagnosis_read_time_ms INTEGER;

COMMENT ON COLUMN ylada_diagnosis_metrics.diagnosis_shown_at IS 'Momento em que o resultado do diagnóstico foi exibido (evento result_view).';
COMMENT ON COLUMN ylada_diagnosis_metrics.diagnosis_read_time_ms IS 'Tempo em ms entre exibir o resultado e clicar no CTA (permanência na página).';
