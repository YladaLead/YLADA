-- =====================================================
-- ADICIONAR phone_country_code NA TABELA leads
-- =====================================================
-- Adiciona campo para armazenar o código do país do telefone
-- Padrão: 'BR' (Brasil)
-- =====================================================

-- Adicionar coluna phone_country_code se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'leads'
    AND column_name = 'phone_country_code'
  ) THEN
    ALTER TABLE leads 
    ADD COLUMN phone_country_code VARCHAR(5) DEFAULT 'BR';
    
    -- Atualizar registros existentes para BR (padrão)
    UPDATE leads 
    SET phone_country_code = 'BR' 
    WHERE phone_country_code IS NULL;
    
    RAISE NOTICE '✅ Coluna phone_country_code adicionada com sucesso na tabela leads';
  ELSE
    RAISE NOTICE 'ℹ️ Coluna phone_country_code já existe na tabela leads';
  END IF;
END $$;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_phone_country_code ON leads(phone_country_code);

-- Verificar resultado
SELECT 
  'Verificação da coluna phone_country_code' as info,
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'leads'
  AND column_name = 'phone_country_code';










