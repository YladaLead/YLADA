-- =====================================================
-- ADICIONAR COLUNA leader_data_collection
-- Script simples e direto para adicionar a coluna que está faltando
-- =====================================================

-- Adicionar coluna leader_data_collection se não existir
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS leader_data_collection JSONB;

-- Verificar se a coluna foi criada
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'leader_data_collection'
      AND table_schema = 'public'
    ) THEN '✅ Coluna leader_data_collection criada com sucesso!'
    ELSE '❌ Erro ao criar coluna leader_data_collection'
  END AS status;

