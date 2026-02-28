-- =====================================================
-- cta_variant: qual texto do CTA foi exibido (A/B futuro).
-- Medir qual CTA converte mais: "Analise seu caso" vs "Destrave esse bloqueio" etc.
-- =====================================================

ALTER TABLE ylada_diagnosis_metrics
  ADD COLUMN IF NOT EXISTS cta_variant TEXT;

COMMENT ON COLUMN ylada_diagnosis_metrics.cta_variant IS 'Texto do CTA exibido (para testes A/B de conversão).';
