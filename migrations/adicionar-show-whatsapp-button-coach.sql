-- =====================================================
-- YLADA - Adicionar campo show_whatsapp_button
-- =====================================================
-- Campo para controlar se o botão WhatsApp pequeno
-- deve ser exibido ao lado do botão CTA principal
-- Aplicado em todas as áreas: Coach, Nutri e Wellness

-- Adicionar campo na tabela coach_user_templates (Coach)
ALTER TABLE coach_user_templates 
ADD COLUMN IF NOT EXISTS show_whatsapp_button BOOLEAN DEFAULT true;

-- Comentário para documentação (Coach)
COMMENT ON COLUMN coach_user_templates.show_whatsapp_button IS 'Controla se o botão WhatsApp pequeno deve ser exibido ao lado do botão CTA principal (padrão: true)';

-- Criar índice se necessário (opcional, mas pode ajudar em queries futuras) - Coach
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_show_whatsapp_button 
ON coach_user_templates(show_whatsapp_button) 
WHERE show_whatsapp_button = false;

-- Adicionar campo na tabela user_templates (Nutri e Wellness)
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS show_whatsapp_button BOOLEAN DEFAULT true;

-- Comentário para documentação (Nutri e Wellness)
COMMENT ON COLUMN user_templates.show_whatsapp_button IS 'Controla se o botão WhatsApp pequeno deve ser exibido ao lado do botão CTA principal (padrão: true)';

-- Criar índice se necessário (opcional, mas pode ajudar em queries futuras) - Nutri/Wellness
CREATE INDEX IF NOT EXISTS idx_user_templates_show_whatsapp_button 
ON user_templates(show_whatsapp_button) 
WHERE show_whatsapp_button = false;

