-- =====================================================
-- MIGRAÇÃO: Adicionar colunas de reavaliação
-- =====================================================
-- Este script adiciona as colunas necessárias para o sistema
-- de reavaliações na tabela assessments

DO $$
BEGIN
    -- Adicionar coluna is_reevaluation se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'assessments' AND column_name = 'is_reevaluation'
    ) THEN
        ALTER TABLE assessments ADD COLUMN is_reevaluation BOOLEAN DEFAULT false;
    END IF;

    -- Adicionar coluna parent_assessment_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'assessments' AND column_name = 'parent_assessment_id'
    ) THEN
        ALTER TABLE assessments ADD COLUMN parent_assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL;
    END IF;

    -- Adicionar coluna assessment_number se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'assessments' AND column_name = 'assessment_number'
    ) THEN
        ALTER TABLE assessments ADD COLUMN assessment_number INTEGER;
    END IF;

    -- Adicionar coluna comparison_data se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'assessments' AND column_name = 'comparison_data'
    ) THEN
        ALTER TABLE assessments ADD COLUMN comparison_data JSONB;
    END IF;
END $$;

-- Adicionar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_assessments_parent_id ON assessments(parent_assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessments_is_reevaluation ON assessments(is_reevaluation);

-- Comentários nas colunas
COMMENT ON COLUMN assessments.is_reevaluation IS 'Flag indicando se é uma reavaliação';
COMMENT ON COLUMN assessments.parent_assessment_id IS 'ID da avaliação original (se reavaliação)';
COMMENT ON COLUMN assessments.assessment_number IS 'Número sequencial da avaliação (1, 2, 3...)';
COMMENT ON COLUMN assessments.comparison_data IS 'Dados comparativos com avaliação anterior';

-- Verificar se as colunas foram adicionadas
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'assessments' 
AND column_name IN ('is_reevaluation', 'parent_assessment_id', 'assessment_number', 'comparison_data')
ORDER BY column_name;

