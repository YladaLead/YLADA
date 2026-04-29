-- ============================================
-- MIGRATION 349: RLS — app_settings, WhatsApp workshop/automação, workshop_inscricoes, vendedor_comissoes
-- ============================================
-- Corrige rls_disabled_in_public (Security Advisor).
-- Acesso à app é via supabaseAdmin (service_role), que ignora RLS.
-- Sem políticas para anon/authenticated = nenhum acesso via chave pública.
-- ============================================

ALTER TABLE IF EXISTS app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vendedor_comissoes ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS whatsapp_automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS whatsapp_automation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS whatsapp_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS whatsapp_notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS whatsapp_scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS whatsapp_workshop_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS whatsapp_workshop_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS workshop_inscricoes ENABLE ROW LEVEL SECURITY;
