-- =====================================================
-- Motor de links YLADA: templates universais e instâncias.
-- @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md (Etapa 1.2)
-- @see docs/MATRIZ-CENTRAL-CRONOGRAMA.md
-- =====================================================

-- Templates universais (5–6 no MVP; estrutura fixa; IA adapta variáveis)
CREATE TABLE IF NOT EXISTS ylada_link_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quiz', 'calculator', 'triagem', 'diagnostico')),
  schema_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  allowed_vars_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  version INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ylada_link_templates_active ON ylada_link_templates(active) WHERE active = true;
COMMENT ON TABLE ylada_link_templates IS 'Templates universais de links (quiz, calculadora, etc.). IA só preenche variáveis permitidas em allowed_vars_json.';

-- Instâncias de link por usuário (slug único global)
CREATE TABLE IF NOT EXISTS ylada_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES ylada_link_templates(id) ON DELETE RESTRICT,
  segment TEXT,
  category TEXT,
  sub_category TEXT,
  slug TEXT NOT NULL,
  title TEXT,
  config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  cta_whatsapp TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(slug)
);

CREATE INDEX IF NOT EXISTS idx_ylada_links_user ON ylada_links(user_id);
CREATE INDEX IF NOT EXISTS idx_ylada_links_template ON ylada_links(template_id);
CREATE INDEX IF NOT EXISTS idx_ylada_links_slug ON ylada_links(slug);
CREATE INDEX IF NOT EXISTS idx_ylada_links_created ON ylada_links(created_at DESC);
COMMENT ON TABLE ylada_links IS 'Instâncias de link geradas a partir de um template; config_json = textos e copy por segment/categoria.';

-- Telemetria: view, start, complete, cta_click
CREATE TABLE IF NOT EXISTS ylada_link_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES ylada_links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'start', 'complete', 'cta_click')),
  utm_json JSONB DEFAULT '{}'::jsonb,
  device TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ylada_link_events_link ON ylada_link_events(link_id);
CREATE INDEX IF NOT EXISTS idx_ylada_link_events_created ON ylada_link_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ylada_link_events_type ON ylada_link_events(event_type);
COMMENT ON TABLE ylada_link_events IS 'Eventos por link (visualização, início, conclusão, clique no WhatsApp).';

-- Trigger updated_at em templates
CREATE OR REPLACE FUNCTION update_ylada_link_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ylada_link_templates_updated_at ON ylada_link_templates;
CREATE TRIGGER update_ylada_link_templates_updated_at
  BEFORE UPDATE ON ylada_link_templates
  FOR EACH ROW EXECUTE FUNCTION update_ylada_link_templates_updated_at();

-- Trigger updated_at em links
CREATE OR REPLACE FUNCTION update_ylada_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ylada_links_updated_at ON ylada_links;
CREATE TRIGGER update_ylada_links_updated_at
  BEFORE UPDATE ON ylada_links
  FOR EACH ROW EXECUTE FUNCTION update_ylada_links_updated_at();

-- RLS: ylada_links — usuário só acessa os próprios
ALTER TABLE ylada_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ylada_links_select ON ylada_links;
CREATE POLICY ylada_links_select ON ylada_links FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS ylada_links_insert ON ylada_links;
CREATE POLICY ylada_links_insert ON ylada_links FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS ylada_links_update ON ylada_links;
CREATE POLICY ylada_links_update ON ylada_links FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ylada_link_templates: leitura pública (para gerar instâncias); escrita só admin (via service role)
ALTER TABLE ylada_link_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ylada_link_templates_select_all ON ylada_link_templates;
CREATE POLICY ylada_link_templates_select_all ON ylada_link_templates FOR SELECT TO authenticated USING (active = true);

-- ylada_link_events: inserção via API (service role) quando visitante acessa link público; leitura pelo dono do link
ALTER TABLE ylada_link_events ENABLE ROW LEVEL SECURITY;
-- Leitura: só dono do link (via join com ylada_links)
DROP POLICY IF EXISTS ylada_link_events_select ON ylada_link_events;
CREATE POLICY ylada_link_events_select ON ylada_link_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM ylada_links l WHERE l.id = link_id AND l.user_id = auth.uid()));
-- INSERT: feito pela API server-side com supabaseAdmin (service role), não por policy
