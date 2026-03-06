-- =====================================================
-- Cache de diagnósticos por link + combinação de respostas.
-- Evita chamadas repetidas à API de IA para mesma combinação.
-- @see docs/LINKS-INTELIGENTES-PROXIMOS-PASSOS.md
-- =====================================================

CREATE TABLE IF NOT EXISTS ylada_diagnosis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  link_id UUID NOT NULL REFERENCES ylada_links(id) ON DELETE CASCADE,
  answers_hash TEXT NOT NULL,
  diagnosis_json JSONB NOT NULL,
  UNIQUE(link_id, answers_hash)
);

CREATE INDEX IF NOT EXISTS idx_ylada_diagnosis_cache_lookup
  ON ylada_diagnosis_cache(link_id, answers_hash);

COMMENT ON TABLE ylada_diagnosis_cache IS 'Cache de diagnósticos gerados por IA: link_id + hash das respostas → diagnóstico reutilizável.';
