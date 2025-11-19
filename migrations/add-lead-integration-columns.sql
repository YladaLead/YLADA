-- =====================================================
-- MIGRAÇÃO: Adicionar colunas de integração com Leads
-- =====================================================
-- Este script adiciona as colunas necessárias para integração
-- com o módulo de Captação na tabela clients

-- Verificar se as colunas já existem antes de adicionar
DO $$
BEGIN
    -- Adicionar coluna converted_from_lead se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'converted_from_lead'
    ) THEN
        ALTER TABLE clients ADD COLUMN converted_from_lead BOOLEAN DEFAULT false;
    END IF;

    -- Adicionar coluna lead_source se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'lead_source'
    ) THEN
        ALTER TABLE clients ADD COLUMN lead_source VARCHAR(100);
    END IF;

    -- Adicionar coluna lead_template_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'lead_template_id'
    ) THEN
        ALTER TABLE clients ADD COLUMN lead_template_id UUID REFERENCES user_templates(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Adicionar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_clients_lead_source ON clients(lead_source);
CREATE INDEX IF NOT EXISTS idx_clients_converted_from_lead ON clients(converted_from_lead);
CREATE INDEX IF NOT EXISTS idx_clients_lead_template_id ON clients(lead_template_id);

-- Comentários nas colunas
COMMENT ON COLUMN clients.converted_from_lead IS 'Flag indicando se o cliente foi convertido de um lead';
COMMENT ON COLUMN clients.lead_source IS 'Origem do lead (ex: quiz-emagrecimento, calculadora-imc)';
COMMENT ON COLUMN clients.lead_template_id IS 'Template que gerou o lead original';

-- Verificar se as colunas foram adicionadas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'clients' 
AND column_name IN ('converted_from_lead', 'lead_source', 'lead_template_id')
ORDER BY column_name;

