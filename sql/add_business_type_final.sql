-- Execute apenas estas linhas que faltam:

ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS business_type VARCHAR(50) DEFAULT 'fitness';

COMMENT ON COLUMN public.professionals.business_type IS 'Tipo de negócio: fitness, nutrition, wellness, business, beauty, etc.';

CREATE INDEX IF NOT EXISTS idx_professionals_business_type ON public.professionals(business_type);

UPDATE public.professionals 
SET business_type = 'fitness'
WHERE business_type IS NULL OR business_type = '';
