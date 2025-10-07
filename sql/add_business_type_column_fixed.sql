-- Script CORRIGIDO para adicionar campo business_type na tabela professionals
-- Execute este script no Supabase SQL Editor

-- Adicionar coluna business_type (se não existir)
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS business_type VARCHAR(50) DEFAULT 'fitness';

-- Comentário para documentação
COMMENT ON COLUMN public.professionals.business_type IS 'Tipo de negócio: fitness, nutrition, wellness, business, beauty, etc.';

-- Criar índice para melhor performance (se não existir)
CREATE INDEX IF NOT EXISTS idx_professionals_business_type ON public.professionals(business_type);

-- Atualizar registros existentes com business_type padrão
UPDATE public.professionals 
SET business_type = 'fitness'
WHERE business_type IS NULL OR business_type = '';

-- Adicionar constraint para valores válidos (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_business_type'
    ) THEN
        ALTER TABLE public.professionals
        ADD CONSTRAINT check_business_type 
        CHECK (business_type IN ('fitness', 'nutrition', 'wellness', 'business', 'beauty', 'health', 'lifestyle'));
    END IF;
END $$;

-- Verificar se tudo foi criado corretamente
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'professionals' 
AND column_name = 'business_type';
