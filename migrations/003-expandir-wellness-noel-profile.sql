-- =====================================================
-- WELLNESS SYSTEM - EXPANDIR PERFIL NOEL
-- Migração 003: Adicionar todos os campos do perfil completo
-- =====================================================

-- Adicionar campos ao wellness_noel_profile
DO $$ 
BEGIN
  -- 1. DADOS DO PERFIL DO CONSULTOR
  -- Nome (já existe em user_profiles, mas pode querer armazenar aqui também)
  -- Idade
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'idade'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN idade INTEGER;
  END IF;
  
  -- Cidade
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'cidade'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN cidade VARCHAR(255);
  END IF;
  
  -- Experiência Herbalife (expandir valores)
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
  END IF;
  
  -- Objetivo Principal (expandir valores)
  -- Atualizar constraint se necessário
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'objetivo_principal'
  ) THEN
    -- Remover constraint antiga se existir
    ALTER TABLE wellness_noel_profile DROP CONSTRAINT IF EXISTS wellness_noel_profile_objetivo_principal_check;
    -- Adicionar nova constraint com valores expandidos
    ALTER TABLE wellness_noel_profile ADD CONSTRAINT wellness_noel_profile_objetivo_principal_check 
      CHECK (objetivo_principal IN (
        'usar_recomendar',
        'renda_extra',
        'carteira',
        'plano_presidente',
        'fechado',
        'funcional',
        -- Valores antigos (manter compatibilidade)
        'vender_mais',
        'construir_carteira',
        'melhorar_rotina',
        'voltar_ritmo',
        'aprender_divulgar'
      ));
  END IF;
  
  -- Canal Principal (simplificar de array para string única)
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
  END IF;
  
  -- Tempo Disponível (expandir valores)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'tempo_disponivel'
  ) THEN
    ALTER TABLE wellness_noel_profile DROP CONSTRAINT IF EXISTS wellness_noel_profile_tempo_disponivel_check;
    ALTER TABLE wellness_noel_profile ADD CONSTRAINT wellness_noel_profile_tempo_disponivel_check 
      CHECK (tempo_disponivel IN (
        '5min',
        '15min',
        '30min',
        '1h',
        '1h_plus',
        -- Valores antigos (manter compatibilidade)
        '15_minutos',
        '30_minutos',
        '1_hora',
        'mais_1_hora'
      ));
  END IF;
  
  -- 2. DADOS OPERACIONAIS
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
  END IF;
  
  -- Estoque Atual (JSONB para lista dinâmica)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'estoque_atual'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN estoque_atual JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  -- Meta PV
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'meta_pv'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN meta_pv INTEGER CHECK (meta_pv >= 100 AND meta_pv <= 10000);
  END IF;
  
  -- Meta Financeira
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'meta_financeira'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN meta_financeira NUMERIC(10,2) CHECK (meta_financeira >= 500 AND meta_financeira <= 20000);
  END IF;
  
  -- 3. DADOS SOCIAIS
  -- Contatos WhatsApp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'contatos_whatsapp'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN contatos_whatsapp INTEGER CHECK (contatos_whatsapp >= 0);
  END IF;
  
  -- Seguidores Instagram
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'seguidores_instagram'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN seguidores_instagram INTEGER CHECK (seguidores_instagram >= 0);
  END IF;
  
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
  END IF;
  
  -- Público Preferido (JSONB array para múltiplas opções)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'publico_preferido'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN publico_preferido TEXT[] DEFAULT '{}';
  END IF;
  
  -- 4. PREFERÊNCIAS
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
  END IF;
  
  -- Lembretes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'lembretes'
  ) THEN
    ALTER TABLE wellness_noel_profile ADD COLUMN lembretes BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Criar índices para campos novos
CREATE INDEX IF NOT EXISTS idx_noel_profile_cidade ON wellness_noel_profile(cidade);
CREATE INDEX IF NOT EXISTS idx_noel_profile_experiencia ON wellness_noel_profile(experiencia_herbalife);
CREATE INDEX IF NOT EXISTS idx_noel_profile_objetivo ON wellness_noel_profile(objetivo_principal);
CREATE INDEX IF NOT EXISTS idx_noel_profile_canal ON wellness_noel_profile(canal_principal);
CREATE INDEX IF NOT EXISTS idx_noel_profile_trabalha_com ON wellness_noel_profile(trabalha_com);
CREATE INDEX IF NOT EXISTS idx_noel_profile_meta_pv ON wellness_noel_profile(meta_pv);
CREATE INDEX IF NOT EXISTS idx_noel_profile_publico ON wellness_noel_profile USING GIN(publico_preferido);

-- Comentários
COMMENT ON COLUMN wellness_noel_profile.idade IS 'Idade do consultor (opcional)';
COMMENT ON COLUMN wellness_noel_profile.cidade IS 'Cidade do consultor';
COMMENT ON COLUMN wellness_noel_profile.experiencia_herbalife IS 'Nível de experiência com Herbalife';
COMMENT ON COLUMN wellness_noel_profile.canal_principal IS 'Canal principal de trabalho';
COMMENT ON COLUMN wellness_noel_profile.prepara_bebidas IS 'Se prepara bebidas funcionais';
COMMENT ON COLUMN wellness_noel_profile.trabalha_com IS 'Tipo de produto que trabalha (funcional, fechado, ambos)';
COMMENT ON COLUMN wellness_noel_profile.estoque_atual IS 'Lista dinâmica de produtos em estoque (JSONB)';
COMMENT ON COLUMN wellness_noel_profile.meta_pv IS 'Meta de PV mensal (100-10000)';
COMMENT ON COLUMN wellness_noel_profile.meta_financeira IS 'Meta financeira mensal (500-20000)';
COMMENT ON COLUMN wellness_noel_profile.contatos_whatsapp IS 'Quantidade de contatos no WhatsApp';
COMMENT ON COLUMN wellness_noel_profile.seguidores_instagram IS 'Quantidade de seguidores no Instagram';
COMMENT ON COLUMN wellness_noel_profile.abertura_recrutar IS 'Abertura para recrutar novos distribuidores';
COMMENT ON COLUMN wellness_noel_profile.publico_preferido IS 'Array de públicos preferidos';
COMMENT ON COLUMN wellness_noel_profile.tom IS 'Tom de comunicação preferido';
COMMENT ON COLUMN wellness_noel_profile.ritmo IS 'Ritmo de trabalho preferido';
COMMENT ON COLUMN wellness_noel_profile.lembretes IS 'Se deseja receber lembretes do sistema';





