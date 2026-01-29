-- Templates editáveis do fluxo WhatsApp/Carol (Nutri)
-- Permite editar textos em /admin/whatsapp/fluxo

ALTER TABLE whatsapp_workshop_settings
  ADD COLUMN IF NOT EXISTS flow_templates JSONB DEFAULT '{}';

COMMENT ON COLUMN whatsapp_workshop_settings.flow_templates IS 'Templates de mensagens do fluxo: welcome_form_greeting, welcome_form_body, link_after_participou, remarketing_nao_participou, etc.';
