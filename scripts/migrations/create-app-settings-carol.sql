-- =====================================================
-- Tabela app_settings para controle da Carol pelo admin
-- (sem depender de .env ou Vercel)
-- Execute no Supabase SQL Editor.
-- =====================================================

CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT NOW()
);

-- Inserir valor padrão: Carol LIGADA (disabled = false)
INSERT INTO app_settings (key, value, updated_at)
VALUES ('carol_automation_disabled', 'false'::jsonb, NOW())
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE app_settings IS 'Configurações globais (ex.: Carol ligada/desligada pelo admin)';
