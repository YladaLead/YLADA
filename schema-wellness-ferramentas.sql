-- =====================================================
-- YLADA - SCHEMA PARA FERRAMENTAS WELLNESS
-- Extensão da estrutura existente para suportar Wellness
-- =====================================================

-- =====================================================
-- 1. ADICIONAR CAMPO user_slug EM user_profiles
-- =====================================================
-- Slug único do usuário para URLs personalizadas
-- Ex: carlos-oliveira
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS user_slug VARCHAR(100) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_slug ON user_profiles(user_slug);

-- =====================================================
-- 2. ESTENDER user_templates COM CAMPOS WELLNESS
-- =====================================================

-- Emoji personalizado
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS emoji VARCHAR(10);

-- Cores personalizadas (JSONB: {principal: "#10B981", secundaria: "#059669"})
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS custom_colors JSONB DEFAULT '{"principal": "#10B981", "secundaria": "#059669"}'::jsonb;

-- Slug do usuário (para construir URL: /wellness/[user-slug]/[tool-slug])
-- Este campo já existe implicitamente via user_id, mas vamos adicionar para facilitar queries
-- O slug da ferramenta já existe no campo "slug"

-- Tipo de CTA (whatsapp ou url_externa)
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS cta_type VARCHAR(20) DEFAULT 'whatsapp';

-- Número WhatsApp completo (com código do país)
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(30);

-- URL externa (se cta_type = 'url_externa')
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS external_url VARCHAR(500);

-- Texto do botão CTA
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS cta_button_text VARCHAR(100) DEFAULT 'Conversar com Especialista';

-- Template base usado (slug do template original)
-- Ex: 'calc-imc', 'quiz-ganhos', etc.
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS template_slug VARCHAR(100);

-- Profissão/Área do usuário (wellness, nutri, coach)
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS profession VARCHAR(50);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_templates_template_slug ON user_templates(template_slug);
CREATE INDEX IF NOT EXISTS idx_user_templates_profession ON user_templates(profession);
CREATE INDEX IF NOT EXISTS idx_user_templates_status_profession ON user_templates(status, profession);

-- =====================================================
-- 3. ADICIONAR COLUNA user_slug EM users (alternativa)
-- =====================================================
-- Se preferir ter o slug diretamente na tabela users:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS user_slug VARCHAR(100) UNIQUE;
-- CREATE INDEX IF NOT EXISTS idx_users_user_slug ON users(user_slug);

-- =====================================================
-- 4. VIEW PARA FERRAMENTAS WELLNESS
-- =====================================================
-- View auxiliar para facilitar queries de ferramentas Wellness
CREATE OR REPLACE VIEW wellness_tools AS
SELECT 
  ut.id,
  ut.user_id,
  ut.template_id,
  ut.slug as tool_slug,
  ut.title,
  ut.description,
  ut.emoji,
  ut.custom_colors,
  ut.cta_type,
  ut.whatsapp_number,
  ut.external_url,
  ut.cta_button_text,
  ut.template_slug,
  ut.status,
  ut.views,
  ut.leads_count,
  ut.created_at,
  ut.updated_at,
  up.user_slug,
  u.name as user_name,
  u.email as user_email,
  -- Construir URL completa
  CONCAT('/pt/wellness/', COALESCE(up.user_slug, 'usuario'), '/', ut.slug) as full_url
FROM user_templates ut
JOIN user_profiles up ON ut.user_id = up.user_id
JOIN users u ON ut.user_id = u.id
WHERE ut.profession = 'wellness';

-- =====================================================
-- 5. FUNÇÃO PARA GERAR SLUG ÚNICO
-- =====================================================
CREATE OR REPLACE FUNCTION generate_unique_slug(
  base_slug TEXT,
  table_name TEXT,
  column_name TEXT
) RETURNS TEXT AS $$
DECLARE
  new_slug TEXT;
  counter INTEGER := 1;
BEGIN
  new_slug := base_slug;
  
  -- Verificar se já existe
  WHILE EXISTS (
    SELECT 1 FROM user_templates 
    WHERE slug = new_slug
  ) LOOP
    new_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. TRIGGER PARA ATUALIZAR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em user_templates
DROP TRIGGER IF EXISTS update_user_templates_updated_at ON user_templates;
CREATE TRIGGER update_user_templates_updated_at
  BEFORE UPDATE ON user_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================
COMMENT ON COLUMN user_profiles.user_slug IS 'Slug único do usuário para URLs (ex: carlos-oliveira)';
COMMENT ON COLUMN user_templates.emoji IS 'Emoji personalizado da ferramenta';
COMMENT ON COLUMN user_templates.custom_colors IS 'Cores personalizadas: {principal: "#hex", secundaria: "#hex"}';
COMMENT ON COLUMN user_templates.cta_type IS 'Tipo de CTA: whatsapp ou url_externa';
COMMENT ON COLUMN user_templates.whatsapp_number IS 'Número WhatsApp completo com código do país';
COMMENT ON COLUMN user_templates.template_slug IS 'Slug do template base usado';
COMMENT ON COLUMN user_templates.profession IS 'Profissão/Área: wellness, nutri, coach';

