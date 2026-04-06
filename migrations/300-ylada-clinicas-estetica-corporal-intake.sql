-- Intake comercial: clínicas de estética corporal (/pt/clinicas-estetica-corporal).
-- Insert via service role (API). Leitura: admin ou SQL no Supabase.

CREATE TABLE IF NOT EXISTS ylada_clinicas_estetica_corporal_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_clinicas_estet_corporal_intake_created
  ON ylada_clinicas_estetica_corporal_intake (created_at DESC);

ALTER TABLE ylada_clinicas_estetica_corporal_intake ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ylada_clinicas_estetica_corporal_intake IS
  'Formulário B2B estética corporal: diagnóstico comercial + contato; sem user_id.';
