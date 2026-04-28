-- Tom de mensagens (preset) para o Noel — Pro Estética (e outros produtos sobre leader_tenants).

ALTER TABLE leader_tenants
  ADD COLUMN IF NOT EXISTS message_tone text;

ALTER TABLE leader_tenants
  ADD COLUMN IF NOT EXISTS message_tone_notes text;

ALTER TABLE leader_tenants
  DROP CONSTRAINT IF EXISTS leader_tenants_message_tone_chk;

ALTER TABLE leader_tenants
  ADD CONSTRAINT leader_tenants_message_tone_chk
  CHECK (
    message_tone IS NULL
    OR message_tone IN ('acolhedor', 'profissional', 'direto', 'sofisticado')
  );

COMMENT ON COLUMN leader_tenants.message_tone IS
  'Preset de tom das mensagens (WhatsApp/script) geradas pelo Noel — próprio contexto corporal/capilar.';

COMMENT ON COLUMN leader_tenants.message_tone_notes IS
  'Refinamento opcional do tom da marca ou do jeito de falar da clínica.';
