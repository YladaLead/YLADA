-- =====================================================
-- ADICIONAR COLUNA conversions_count NA TABELA user_templates
-- =====================================================
-- Esta coluna armazena o número real de conversões
-- (quando usuário clica no botão CTA após preencher formulário)

-- Adicionar coluna se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_templates' 
    AND column_name = 'conversions_count'
  ) THEN
    ALTER TABLE user_templates 
    ADD COLUMN conversions_count INTEGER DEFAULT 0;
    
    -- Criar índice para performance
    CREATE INDEX IF NOT EXISTS idx_user_templates_conversions_count 
    ON user_templates(conversions_count);
    
    RAISE NOTICE 'Coluna conversions_count adicionada com sucesso!';
  ELSE
    RAISE NOTICE 'Coluna conversions_count já existe.';
  END IF;
END $$;

-- Verificar se foi criada
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns
WHERE table_name = 'user_templates' 
  AND column_name = 'conversions_count';

