-- Pro Líderes: flags de lembrete automático antes de team_access_expires_at (cron diário).

ALTER TABLE leader_tenant_members
  ADD COLUMN IF NOT EXISTS team_access_expiry_reminder_sent_7d BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS team_access_expiry_reminder_sent_3d BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS team_access_expiry_reminder_sent_1d BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN leader_tenant_members.team_access_expiry_reminder_sent_7d IS
  'Cron: e-mail/WhatsApp de aviso ~7 dias antes de team_access_expires_at.';
COMMENT ON COLUMN leader_tenant_members.team_access_expiry_reminder_sent_3d IS
  'Cron: e-mail/WhatsApp de aviso ~3 dias antes de team_access_expires_at.';
COMMENT ON COLUMN leader_tenant_members.team_access_expiry_reminder_sent_1d IS
  'Cron: e-mail/WhatsApp de aviso no último dia de team_access_expires_at.';
