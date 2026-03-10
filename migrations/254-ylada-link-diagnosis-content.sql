-- =====================================================
-- Conteúdo de diagnóstico memorizado por link.
-- Quando o profissional edita o link (perguntas, tema), a IA gera
-- diagnósticos específicos e armazenamos aqui para não chamar IA de novo.
-- Prioridade na entrega: 1) link_content 2) archetypes 3) templates.
-- @see docs/DIAGNOSTICO-BIBLIOTECA-IA-MEMORIZACAO.md
-- =====================================================

CREATE TABLE IF NOT EXISTS ylada_link_diagnosis_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES ylada_links(id) ON DELETE CASCADE,
  architecture TEXT NOT NULL,
  archetype_code TEXT NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(link_id, architecture, archetype_code)
);

CREATE INDEX IF NOT EXISTS idx_ylada_link_diagnosis_content_link
  ON ylada_link_diagnosis_content(link_id);
CREATE INDEX IF NOT EXISTS idx_ylada_link_diagnosis_content_lookup
  ON ylada_link_diagnosis_content(link_id, architecture, archetype_code);

COMMENT ON TABLE ylada_link_diagnosis_content IS 'Diagnósticos gerados por IA e memorizados por link. Usado quando o profissional editou o link.';

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_ylada_link_diagnosis_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ylada_link_diagnosis_content_updated_at ON ylada_link_diagnosis_content;
CREATE TRIGGER update_ylada_link_diagnosis_content_updated_at
  BEFORE UPDATE ON ylada_link_diagnosis_content
  FOR EACH ROW EXECUTE FUNCTION update_ylada_link_diagnosis_content_updated_at();

-- RLS: usuário só acessa conteúdo dos próprios links
ALTER TABLE ylada_link_diagnosis_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ylada_link_diagnosis_content_select ON ylada_link_diagnosis_content;
CREATE POLICY ylada_link_diagnosis_content_select ON ylada_link_diagnosis_content
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM ylada_links l WHERE l.id = link_id AND l.user_id = auth.uid()));

DROP POLICY IF EXISTS ylada_link_diagnosis_content_insert ON ylada_link_diagnosis_content;
CREATE POLICY ylada_link_diagnosis_content_insert ON ylada_link_diagnosis_content
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM ylada_links l WHERE l.id = link_id AND l.user_id = auth.uid()));

DROP POLICY IF EXISTS ylada_link_diagnosis_content_update ON ylada_link_diagnosis_content;
CREATE POLICY ylada_link_diagnosis_content_update ON ylada_link_diagnosis_content
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM ylada_links l WHERE l.id = link_id AND l.user_id = auth.uid()));

DROP POLICY IF EXISTS ylada_link_diagnosis_content_delete ON ylada_link_diagnosis_content;
CREATE POLICY ylada_link_diagnosis_content_delete ON ylada_link_diagnosis_content
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM ylada_links l WHERE l.id = link_id AND l.user_id = auth.uid()));
