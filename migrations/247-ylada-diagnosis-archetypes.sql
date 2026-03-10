-- =====================================================
-- Archetypes de diagnóstico gerados por IA (5 tipos).
-- Conteúdo criado uma vez; sistema escolhe qual entregar
-- com base nas respostas (regras).
-- @see docs/LINKS-INTELIGENTES-ARQUETIPOS-IA.md
-- =====================================================

CREATE TABLE IF NOT EXISTS ylada_diagnosis_archetypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archetype_code TEXT NOT NULL,
  segment_code TEXT NOT NULL DEFAULT 'geral',
  content_json JSONB NOT NULL,
  UNIQUE(archetype_code, segment_code)
);

CREATE INDEX IF NOT EXISTS idx_ylada_diagnosis_archetypes_lookup
  ON ylada_diagnosis_archetypes(archetype_code, segment_code);

COMMENT ON TABLE ylada_diagnosis_archetypes IS '5 tipos de diagnóstico: leve, moderado, urgente, bloqueio_pratico, bloqueio_emocional. Conteúdo gerado por IA uma vez.';
