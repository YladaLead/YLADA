-- ==========================================
-- MIGRATION: Adicionar Campos Faltantes
-- ==========================================
-- Data: 2025-12-18
-- Projeto: YLADA - Área Nutri
-- Objetivo: Corrigir schema do banco para alinhar com frontend
--
-- IMPORTANTE: Execute no Supabase SQL Editor
-- https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/editor
-- ==========================================

-- ==========================================
-- 1. TABELA CLIENTS - Campos Faltantes
-- ==========================================

-- Adicionar campo 'goal' (objetivo da cliente)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'goal'
  ) THEN
    ALTER TABLE clients ADD COLUMN goal TEXT;
    RAISE NOTICE 'Coluna clients.goal adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna clients.goal já existe';
  END IF;
END $$;

-- Adicionar campo 'instagram'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'instagram'
  ) THEN
    ALTER TABLE clients ADD COLUMN instagram VARCHAR(100);
    RAISE NOTICE 'Coluna clients.instagram adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna clients.instagram já existe';
  END IF;
END $$;

-- Adicionar campo 'phone_country_code'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'phone_country_code'
  ) THEN
    ALTER TABLE clients ADD COLUMN phone_country_code VARCHAR(5) DEFAULT 'BR';
    RAISE NOTICE 'Coluna clients.phone_country_code adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna clients.phone_country_code já existe';
  END IF;
END $$;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN clients.goal IS 'Objetivo da cliente (ex: emagrecimento, hipertrofia, saúde)';
COMMENT ON COLUMN clients.instagram IS 'Instagram da cliente (@username)';
COMMENT ON COLUMN clients.phone_country_code IS 'Código do país para telefone (BR, US, PT, etc.)';

-- ==========================================
-- 2. TABELA EMOTIONAL_BEHAVIORAL_HISTORY - Campos Faltantes
-- ==========================================

-- Adicionar campo 'story'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'emotional_behavioral_history' AND column_name = 'story'
  ) THEN
    ALTER TABLE emotional_behavioral_history ADD COLUMN story TEXT;
    RAISE NOTICE 'Coluna emotional_behavioral_history.story adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna emotional_behavioral_history.story já existe';
  END IF;
END $$;

-- Adicionar campo 'moment_of_change'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'emotional_behavioral_history' AND column_name = 'moment_of_change'
  ) THEN
    ALTER TABLE emotional_behavioral_history ADD COLUMN moment_of_change TEXT;
    RAISE NOTICE 'Coluna emotional_behavioral_history.moment_of_change adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna emotional_behavioral_history.moment_of_change já existe';
  END IF;
END $$;

-- Adicionar campo 'commitment'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'emotional_behavioral_history' AND column_name = 'commitment'
  ) THEN
    ALTER TABLE emotional_behavioral_history ADD COLUMN commitment INTEGER;
    -- Adicionar constraint para garantir valores entre 1 e 10
    ALTER TABLE emotional_behavioral_history 
      ADD CONSTRAINT emotional_behavioral_history_commitment_check 
      CHECK (commitment IS NULL OR (commitment >= 1 AND commitment <= 10));
    RAISE NOTICE 'Coluna emotional_behavioral_history.commitment adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna emotional_behavioral_history.commitment já existe';
  END IF;
END $$;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN emotional_behavioral_history.story IS 'História/contexto emocional da cliente';
COMMENT ON COLUMN emotional_behavioral_history.moment_of_change IS 'Momento de mudança identificado';
COMMENT ON COLUMN emotional_behavioral_history.commitment IS 'Nível de comprometimento (escala 1-10)';

-- ==========================================
-- 3. TABELA PROGRAMS - Campos Faltantes
-- ==========================================

-- Adicionar campo 'stage'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'programs' AND column_name = 'stage'
  ) THEN
    ALTER TABLE programs ADD COLUMN stage VARCHAR(50);
    RAISE NOTICE 'Coluna programs.stage adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna programs.stage já existe';
  END IF;
END $$;

-- Adicionar campo 'weekly_goal'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'programs' AND column_name = 'weekly_goal'
  ) THEN
    ALTER TABLE programs ADD COLUMN weekly_goal TEXT;
    RAISE NOTICE 'Coluna programs.weekly_goal adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna programs.weekly_goal já existe';
  END IF;
END $$;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN programs.stage IS 'Estágio atual do programa (ex: adaptacao, progressao, manutencao)';
COMMENT ON COLUMN programs.weekly_goal IS 'Meta semanal do programa';

-- ==========================================
-- 4. ÍNDICES ADICIONAIS (para performance)
-- ==========================================

-- Índice para busca por Instagram
CREATE INDEX IF NOT EXISTS idx_clients_instagram ON clients(instagram) WHERE instagram IS NOT NULL;

-- Índice para busca por objetivo (goal)
CREATE INDEX IF NOT EXISTS idx_clients_goal ON clients(goal) WHERE goal IS NOT NULL;

-- Índice para busca por estágio do programa
CREATE INDEX IF NOT EXISTS idx_programs_stage ON programs(stage) WHERE stage IS NOT NULL;

-- ==========================================
-- 5. VERIFICAÇÃO FINAL
-- ==========================================

-- Verificar se todos os campos foram adicionados
DO $$ 
DECLARE
  missing_fields TEXT[] := ARRAY[]::TEXT[];
  field_exists BOOLEAN;
BEGIN
  -- Verificar clients.goal
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'goal'
  ) INTO field_exists;
  IF NOT field_exists THEN
    missing_fields := array_append(missing_fields, 'clients.goal');
  END IF;

  -- Verificar clients.instagram
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'instagram'
  ) INTO field_exists;
  IF NOT field_exists THEN
    missing_fields := array_append(missing_fields, 'clients.instagram');
  END IF;

  -- Verificar clients.phone_country_code
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'phone_country_code'
  ) INTO field_exists;
  IF NOT field_exists THEN
    missing_fields := array_append(missing_fields, 'clients.phone_country_code');
  END IF;

  -- Verificar emotional_behavioral_history.story
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'emotional_behavioral_history' AND column_name = 'story'
  ) INTO field_exists;
  IF NOT field_exists THEN
    missing_fields := array_append(missing_fields, 'emotional_behavioral_history.story');
  END IF;

  -- Verificar emotional_behavioral_history.moment_of_change
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'emotional_behavioral_history' AND column_name = 'moment_of_change'
  ) INTO field_exists;
  IF NOT field_exists THEN
    missing_fields := array_append(missing_fields, 'emotional_behavioral_history.moment_of_change');
  END IF;

  -- Verificar emotional_behavioral_history.commitment
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'emotional_behavioral_history' AND column_name = 'commitment'
  ) INTO field_exists;
  IF NOT field_exists THEN
    missing_fields := array_append(missing_fields, 'emotional_behavioral_history.commitment');
  END IF;

  -- Verificar programs.stage
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'programs' AND column_name = 'stage'
  ) INTO field_exists;
  IF NOT field_exists THEN
    missing_fields := array_append(missing_fields, 'programs.stage');
  END IF;

  -- Verificar programs.weekly_goal
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'programs' AND column_name = 'weekly_goal'
  ) INTO field_exists;
  IF NOT field_exists THEN
    missing_fields := array_append(missing_fields, 'programs.weekly_goal');
  END IF;

  -- Resultado
  IF array_length(missing_fields, 1) > 0 THEN
    RAISE WARNING 'ATENÇÃO: Campos ainda faltando: %', array_to_string(missing_fields, ', ');
  ELSE
    RAISE NOTICE '✅ SUCESSO! Todos os campos foram adicionados com sucesso!';
    RAISE NOTICE 'Execute agora o script de verificação: scripts/verify-missing-schema-fields.sql';
  END IF;
END $$;

-- ==========================================
-- FIM DA MIGRATION
-- ==========================================












