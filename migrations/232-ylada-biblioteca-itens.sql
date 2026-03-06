-- =====================================================
-- Biblioteca YLADA: itens reutilizáveis (quizzes, calculadoras, links).
-- Permite referenciar conteúdo existente (ylada_link_templates, wellness, nutri)
-- e exibir na biblioteca com filtros por segmento e tema.
-- @see src/config/ylada-biblioteca.ts
-- @see src/config/ylada-pilares-temas.ts
-- =====================================================

CREATE TABLE IF NOT EXISTS ylada_biblioteca_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('quiz', 'calculadora', 'link')),
  segment_codes TEXT[] NOT NULL DEFAULT '{}',
  tema TEXT NOT NULL,
  pilar TEXT CHECK (pilar IN ('energia', 'metabolismo', 'digestao', 'mente', 'habitos')),
  titulo TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN (
    'ylada_template',
    'wellness_fluxo',
    'wellness_template',
    'nutri_quiz',
    'custom'
  )),
  source_id TEXT,
  flow_id TEXT,
  architecture TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ylada_biblioteca_itens_active ON ylada_biblioteca_itens(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_ylada_biblioteca_itens_tipo ON ylada_biblioteca_itens(tipo);
CREATE INDEX IF NOT EXISTS idx_ylada_biblioteca_itens_tema ON ylada_biblioteca_itens(tema);
CREATE INDEX IF NOT EXISTS idx_ylada_biblioteca_itens_pilar ON ylada_biblioteca_itens(pilar);
CREATE INDEX IF NOT EXISTS idx_ylada_biblioteca_itens_sort ON ylada_biblioteca_itens(sort_order, created_at);
CREATE INDEX IF NOT EXISTS idx_ylada_biblioteca_itens_segment ON ylada_biblioteca_itens USING GIN(segment_codes);

COMMENT ON TABLE ylada_biblioteca_itens IS 'Itens da biblioteca YLADA: quizzes, calculadoras e links. Referenciam conteúdo existente (templates, wellness, nutri) ou são custom.';
COMMENT ON COLUMN ylada_biblioteca_itens.segment_codes IS 'Segmentos para os quais o item é relevante (nutrition, fitness, etc.). Um item pode aparecer em vários.';
COMMENT ON COLUMN ylada_biblioteca_itens.tema IS 'Tema do Top 12 (energia, intestino, metabolismo, etc.).';
COMMENT ON COLUMN ylada_biblioteca_itens.source_type IS 'Origem do conteúdo: ylada_template, wellness_fluxo, nutri_quiz, custom.';
COMMENT ON COLUMN ylada_biblioteca_itens.source_id IS 'ID do recurso de origem (UUID de ylada_link_templates, wellness_fluxos, etc.).';
COMMENT ON COLUMN ylada_biblioteca_itens.flow_id IS 'ID do fluxo do catálogo (diagnostico_risco, calculadora_projecao, etc.).';
COMMENT ON COLUMN ylada_biblioteca_itens.architecture IS 'Arquitetura do motor (RISK_DIAGNOSIS, BLOCKER_DIAGNOSIS, etc.).';

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_ylada_biblioteca_itens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ylada_biblioteca_itens_updated_at ON ylada_biblioteca_itens;
CREATE TRIGGER update_ylada_biblioteca_itens_updated_at
  BEFORE UPDATE ON ylada_biblioteca_itens
  FOR EACH ROW EXECUTE FUNCTION update_ylada_biblioteca_itens_updated_at();

-- RLS: leitura para authenticated; escrita só via service role (admin)
ALTER TABLE ylada_biblioteca_itens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ylada_biblioteca_itens_select ON ylada_biblioteca_itens;
CREATE POLICY ylada_biblioteca_itens_select ON ylada_biblioteca_itens
  FOR SELECT TO authenticated
  USING (active = true);
