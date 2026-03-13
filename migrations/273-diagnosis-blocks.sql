-- Biblioteca inteligente: blocos combináveis para fábrica de diagnósticos.
-- O Noel combina blocos (theme + problem + audience + promise) para gerar diagnósticos automaticamente.
-- Ver: docs/BIBLIOTECA-INTELIGENTE-DIAGNOSTICOS-BLOCOS.md

CREATE TABLE IF NOT EXISTS diagnosis_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_type TEXT NOT NULL CHECK (block_type IN ('theme', 'problem', 'audience', 'promise')),
  content TEXT NOT NULL,
  segment_code TEXT,
  tags TEXT[] DEFAULT '{}',
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_blocks_type ON diagnosis_blocks(block_type);
CREATE INDEX IF NOT EXISTS idx_diagnosis_blocks_segment ON diagnosis_blocks(segment_code);
CREATE INDEX IF NOT EXISTS idx_diagnosis_blocks_tags ON diagnosis_blocks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_diagnosis_blocks_usage ON diagnosis_blocks(usage_count DESC);

COMMENT ON TABLE diagnosis_blocks IS 'Blocos reutilizáveis para combinação automática de diagnósticos (fábrica de diagnósticos).';
