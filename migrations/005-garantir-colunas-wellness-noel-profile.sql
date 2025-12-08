-- =====================================================
-- WELLNESS SYSTEM - GARANTIR TODAS AS COLUNAS
-- Migração 005: Garantir que todas as colunas do perfil existam
-- =====================================================

DO $$ 
BEGIN
  -- Abertura Recrutar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'abertura_recrutar'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN abertura_recrutar TEXT CHECK (abertura_recrutar IN (
      'sim',
      'nao',
      'aprender'
    ));
    COMMENT ON COLUMN wellness_noel_profile.abertura_recrutar IS 'Abertura para recrutar novos distribuidores';
  END IF;
  
  -- Público Preferido
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'publico_preferido'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN publico_preferido TEXT[] DEFAULT '{}';
    COMMENT ON COLUMN wellness_noel_profile.publico_preferido IS 'Array de públicos preferidos';
  END IF;
  
  -- Tom
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'tom'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN tom TEXT CHECK (tom IN (
      'neutro',
      'extrovertido',
      'tecnico',
      'simples'
    ));
    COMMENT ON COLUMN wellness_noel_profile.tom IS 'Tom de comunicação preferido';
  END IF;
  
  -- Ritmo
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'ritmo'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN ritmo TEXT CHECK (ritmo IN (
      'lento',
      'medio',
      'rapido'
    ));
    COMMENT ON COLUMN wellness_noel_profile.ritmo IS 'Ritmo de trabalho preferido';
  END IF;
  
  -- Lembretes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'lembretes'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN lembretes BOOLEAN DEFAULT true;
    COMMENT ON COLUMN wellness_noel_profile.lembretes IS 'Se deseja receber lembretes do sistema';
  END IF;
  
  -- Idade
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'idade'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN idade INTEGER;
    COMMENT ON COLUMN wellness_noel_profile.idade IS 'Idade do consultor (opcional)';
  END IF;
  
  -- Cidade
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'cidade'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN cidade VARCHAR(255);
    COMMENT ON COLUMN wellness_noel_profile.cidade IS 'Cidade do consultor';
  END IF;
  
  -- Experiência Herbalife
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'experiencia_herbalife'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN experiencia_herbalife TEXT CHECK (experiencia_herbalife IN (
      'nenhuma',
      'ja_vendi',
      'supervisor',
      'get_plus'
    ));
    COMMENT ON COLUMN wellness_noel_profile.experiencia_herbalife IS 'Nível de experiência com Herbalife';
  END IF;
  
  -- Canal Principal
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'canal_principal'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN canal_principal TEXT CHECK (canal_principal IN (
      'whatsapp',
      'instagram',
      'trafego_pago',
      'presencial'
    ));
    COMMENT ON COLUMN wellness_noel_profile.canal_principal IS 'Canal principal de trabalho';
  END IF;
  
  -- Prepara Bebidas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'prepara_bebidas'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN prepara_bebidas TEXT CHECK (prepara_bebidas IN (
      'sim',
      'nao',
      'aprender',
      'nunca'
    ));
    COMMENT ON COLUMN wellness_noel_profile.prepara_bebidas IS 'Se prepara bebidas funcionais';
  END IF;
  
  -- Trabalha Com
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'trabalha_com'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN trabalha_com TEXT CHECK (trabalha_com IN (
      'funcional',
      'fechado',
      'ambos'
    ));
    COMMENT ON COLUMN wellness_noel_profile.trabalha_com IS 'Tipo de produto que trabalha (funcional, fechado, ambos)';
  END IF;
  
  -- Estoque Atual
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'estoque_atual'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN estoque_atual JSONB DEFAULT '[]'::jsonb;
    COMMENT ON COLUMN wellness_noel_profile.estoque_atual IS 'Lista dinâmica de produtos em estoque (JSONB)';
  END IF;
  
  -- Meta PV
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'meta_pv'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN meta_pv INTEGER CHECK (meta_pv >= 100 AND meta_pv <= 50000);
    COMMENT ON COLUMN wellness_noel_profile.meta_pv IS 'Meta de PV mensal (100-50000)';
  END IF;
  
  -- Meta Financeira
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'meta_financeira'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN meta_financeira NUMERIC(10,2) CHECK (meta_financeira >= 500 AND meta_financeira <= 200000);
    COMMENT ON COLUMN wellness_noel_profile.meta_financeira IS 'Meta financeira mensal (500-200000)';
  END IF;
  
  -- Contatos WhatsApp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'contatos_whatsapp'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN contatos_whatsapp INTEGER CHECK (contatos_whatsapp >= 0);
    COMMENT ON COLUMN wellness_noel_profile.contatos_whatsapp IS 'Quantidade de contatos no WhatsApp';
  END IF;
  
  -- Seguidores Instagram
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'seguidores_instagram'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN seguidores_instagram INTEGER CHECK (seguidores_instagram >= 0);
    COMMENT ON COLUMN wellness_noel_profile.seguidores_instagram IS 'Quantidade de seguidores no Instagram';
  END IF;
END $$;


