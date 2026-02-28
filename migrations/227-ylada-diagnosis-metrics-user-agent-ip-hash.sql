-- =====================================================
-- user_agent + ip_hash: apenas para filtragem futura (sem bloqueio/rate limit).
-- =====================================================

ALTER TABLE ylada_diagnosis_metrics
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS ip_hash TEXT;

COMMENT ON COLUMN ylada_diagnosis_metrics.user_agent IS 'User-Agent da requisição (filtragem futura, não bloqueio).';
COMMENT ON COLUMN ylada_diagnosis_metrics.ip_hash IS 'Hash do IP (não armazenar IP puro); filtragem futura.';
