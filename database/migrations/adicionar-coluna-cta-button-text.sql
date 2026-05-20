-- Adicionar coluna cta_button_text na tabela user_templates
-- Esta coluna armazena o texto personalizado do botão de ação (CTA)

DO $$
BEGIN
  -- Verificar se a coluna já existe antes de adicionar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_templates'
    AND column_name = 'cta_button_text'
  ) THEN
    ALTER TABLE user_templates 
    ADD COLUMN cta_button_text VARCHAR(255) DEFAULT 'Conversar com Especialista';
    
    RAISE NOTICE 'Coluna "cta_button_text" adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna "cta_button_text" já existe';
  END IF;
END $$;

-- Verificar outras colunas que podem estar faltando
DO $$
BEGIN
  -- Verificar e adicionar outras colunas comuns se não existirem
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_templates'
    AND column_name = 'custom_whatsapp_message'
  ) THEN
    ALTER TABLE user_templates 
    ADD COLUMN custom_whatsapp_message TEXT;
    RAISE NOTICE 'Coluna "custom_whatsapp_message" adicionada';
  END IF;
END $$;

-- Verificar estrutura atual da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_templates'
ORDER BY ordinal_position;

