-- Script para adicionar campo business_type na tabela professionals
-- Execute este script no Supabase SQL Editor

-- Adicionar coluna business_type
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS business_type VARCHAR(50) DEFAULT 'fitness';

-- Comentário para documentação
COMMENT ON COLUMN public.professionals.business_type IS 'Tipo de negócio: fitness, nutrition, wellness, business, beauty, etc.';

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_professionals_business_type ON public.professionals(business_type);

-- Atualizar registros existentes com business_type padrão
UPDATE public.professionals 
SET business_type = 'fitness'
WHERE business_type IS NULL OR business_type = '';

-- Adicionar constraint para valores válidos
ALTER TABLE public.professionals
ADD CONSTRAINT check_business_type 
CHECK (business_type IN ('fitness', 'nutrition', 'wellness', 'business', 'beauty', 'health', 'lifestyle'));

-- Exemplo de tipos de negócio suportados:
-- fitness: Academia, Personal Trainer, CrossFit
-- nutrition: Nutricionista, Coach Nutricional
-- wellness: Spa, Terapias, Bem-estar
-- business: Coaching, Consultoria, MLM
-- beauty: Estética, Cosmética, Beleza
-- health: Medicina, Fisioterapia, Saúde
-- lifestyle: Life Coach, Desenvolvimento Pessoal
