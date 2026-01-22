-- =====================================================
-- WORKSHOP / AULA PRÁTICA (NUTRI) - SESSÕES + SETTINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS whatsapp_workshop_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area VARCHAR(50) NOT NULL DEFAULT 'nutri',
  flyer_url TEXT,
  flyer_caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(area)
);

CREATE TABLE IF NOT EXISTS whatsapp_workshop_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area VARCHAR(50) NOT NULL DEFAULT 'nutri',
  title VARCHAR(255) NOT NULL DEFAULT 'Aula Prática ao Vivo (Agenda Instável)',
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  zoom_link TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_workshop_sessions_area ON whatsapp_workshop_sessions(area);
CREATE INDEX IF NOT EXISTS idx_whatsapp_workshop_sessions_active ON whatsapp_workshop_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_whatsapp_workshop_sessions_starts_at ON whatsapp_workshop_sessions(starts_at);

-- updated_at trigger function já existe no repo (update_whatsapp_updated_at).
-- Vamos criar triggers com esse mesmo helper.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_whatsapp_workshop_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_whatsapp_workshop_settings_updated_at
      BEFORE UPDATE ON whatsapp_workshop_settings
      FOR EACH ROW EXECUTE FUNCTION update_whatsapp_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_whatsapp_workshop_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_whatsapp_workshop_sessions_updated_at
      BEFORE UPDATE ON whatsapp_workshop_sessions
      FOR EACH ROW EXECUTE FUNCTION update_whatsapp_updated_at();
  END IF;
END $$;

