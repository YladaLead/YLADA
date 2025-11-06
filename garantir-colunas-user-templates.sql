-- =====================================================
-- GARANTIR TODAS AS COLUNAS NECESSÁRIAS EM user_templates
-- Para corrigir erro 500 ao criar ferramentas Wellness
-- =====================================================

-- 1. Adicionar coluna short_code se não existir
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS short_code VARCHAR(20) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_user_templates_short_code ON user_templates(short_code);

-- 2. Garantir que todas as outras colunas existam
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS emoji VARCHAR(10);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS custom_colors JSONB DEFAULT '{"principal": "#10B981", "secundaria": "#059669"}'::jsonb;

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS cta_type VARCHAR(20) DEFAULT 'whatsapp';

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(30);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS external_url VARCHAR(500);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS cta_button_text VARCHAR(100) DEFAULT 'Conversar com Especialista';

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS template_slug VARCHAR(100);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS profession VARCHAR(50);

-- 3. Garantir que content pode ser NULL (caso não tenha template_id)
-- Remover NOT NULL se existir
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_templates' 
    AND column_name = 'content' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE user_templates ALTER COLUMN content DROP NOT NULL;
  END IF;
END $$;

-- 4. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_user_templates_template_slug ON user_templates(template_slug);
CREATE INDEX IF NOT EXISTS idx_user_templates_profession ON user_templates(profession);
CREATE INDEX IF NOT EXISTS idx_user_templates_status_profession ON user_templates(status, profession);

-- 5. Verificar estrutura final
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_templates'
ORDER BY ordinal_position;

