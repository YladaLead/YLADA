-- =====================================================
-- intro_variant: frase de abertura adaptativa exibida (tom por strategic_profile).
-- Permite A/B e análise de conversão por variante de intro.
-- =====================================================

ALTER TABLE ylada_diagnosis_metrics
  ADD COLUMN IF NOT EXISTS intro_variant TEXT;

COMMENT ON COLUMN ylada_diagnosis_metrics.intro_variant IS 'Frase de abertura adaptativa do diagnóstico (tom por perfil estratégico).';
