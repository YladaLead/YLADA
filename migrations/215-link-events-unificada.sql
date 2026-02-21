-- =====================================================
-- Tabela unificada de eventos por link (view, whatsapp_click, lead_capture).
-- Uso: Nutri, Wellness, Coach, YLADA — uma única fonte para contagem.
-- @see docs/CONTAGEM-3-EVENTOS-LINK-DEFINITIVO.md
-- @see docs/PASSO-A-PASSO-CONTAGEM-LINKS.md
-- =====================================================

CREATE TABLE IF NOT EXISTS link_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'whatsapp_click', 'lead_capture')),
  link_source TEXT NOT NULL CHECK (link_source IN ('user_template', 'quiz', 'form', 'ylada_link', 'generated_link')),
  link_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area TEXT NOT NULL CHECK (area IN ('nutri', 'wellness', 'coach', 'ylada')),
  lead_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_link_events_user_link ON link_events(user_id, link_id, event_type);
CREATE INDEX IF NOT EXISTS idx_link_events_user_area_created ON link_events(user_id, area, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_link_events_link_source_id ON link_events(link_source, link_id);
CREATE INDEX IF NOT EXISTS idx_link_events_created ON link_events(created_at DESC);

COMMENT ON TABLE link_events IS 'Eventos unificados por link: view (acesso), whatsapp_click (clique no botão), lead_capture (cadastro nome/telefone). Uma fonte para Nutri, Wellness, Coach e YLADA.';
