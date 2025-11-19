-- =====================================================
-- MIGRAÇÃO COMPLETA - Módulo de Gestão Nutri
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- Ele adiciona todas as colunas e tabelas necessárias

BEGIN;

-- =====================================================
-- 1. ADICIONAR COLUNAS DE INTEGRAÇÃO COM LEADS
-- =====================================================

-- Adicionar coluna converted_from_lead se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'converted_from_lead'
    ) THEN
        ALTER TABLE clients ADD COLUMN converted_from_lead BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Adicionar coluna lead_source se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'lead_source'
    ) THEN
        ALTER TABLE clients ADD COLUMN lead_source VARCHAR(100);
    END IF;
END $$;

-- Adicionar coluna lead_template_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'lead_template_id'
    ) THEN
        ALTER TABLE clients ADD COLUMN lead_template_id UUID REFERENCES user_templates(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Adicionar índices
CREATE INDEX IF NOT EXISTS idx_clients_lead_source ON clients(lead_source);
CREATE INDEX IF NOT EXISTS idx_clients_converted_from_lead ON clients(converted_from_lead);
CREATE INDEX IF NOT EXISTS idx_clients_lead_template_id ON clients(lead_template_id);

-- =====================================================
-- 2. ADICIONAR COLUNAS DE REAVALIAÇÃO
-- =====================================================

-- Verificar se a tabela assessments existe
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'assessments'
    ) THEN
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
    END IF;
END $$;

-- Adicionar índices para assessments
CREATE INDEX IF NOT EXISTS idx_assessments_parent_id ON assessments(parent_assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessments_is_reevaluation ON assessments(is_reevaluation);

-- =====================================================
-- 3. CRIAR TABELA DE HISTÓRICO EMOCIONAL E COMPORTAMENTAL
-- =====================================================

CREATE TABLE IF NOT EXISTS emotional_behavioral_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Data do registro
  record_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Tipo de registro
  record_type VARCHAR(50) NOT NULL, -- 'emocional', 'comportamental', 'ambos'
  
  -- Registro Emocional
  emotional_state VARCHAR(100), -- 'ansioso', 'estressado', 'motivado', 'desanimado', 'equilibrado', 'outro'
  emotional_notes TEXT,
  stress_level INTEGER, -- Nível de estresse (1-10)
  mood_score INTEGER, -- Score de humor (1-10)
  sleep_quality VARCHAR(50), -- 'otimo', 'bom', 'regular', 'ruim', 'pessimo'
  energy_level VARCHAR(50), -- 'alta', 'media', 'baixa'
  
  -- Registro Comportamental
  adherence_score INTEGER, -- Score de adesão ao programa (1-10)
  meal_following_percentage DECIMAL(5,2), -- Percentual de refeições seguidas
  exercise_frequency VARCHAR(50), -- Frequência de exercícios
  water_intake_liters DECIMAL(4,2), -- Ingestão de água (litros)
  behavioral_notes TEXT,
  
  -- Padrões identificados
  patterns_identified TEXT[], -- Padrões identificados (ex: ['come por ansiedade', 'pula refeições'])
  triggers TEXT[], -- Gatilhos identificados (ex: ['trabalho', 'fim de semana'])
  
  -- Observações gerais
  notes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Índices para emotional_behavioral_history
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_client_id ON emotional_behavioral_history(client_id);
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_user_id ON emotional_behavioral_history(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_record_date ON emotional_behavioral_history(record_date);
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_type ON emotional_behavioral_history(record_type);

-- RLS para emotional_behavioral_history
ALTER TABLE emotional_behavioral_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para emotional_behavioral_history
-- Remover políticas existentes primeiro (se existirem)
DROP POLICY IF EXISTS "Users can view own emotional behavioral history" ON emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can insert own emotional behavioral history" ON emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can update own emotional behavioral history" ON emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can delete own emotional behavioral history" ON emotional_behavioral_history;

-- Criar políticas
CREATE POLICY "Users can view own emotional behavioral history" ON emotional_behavioral_history 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotional behavioral history" ON emotional_behavioral_history 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emotional behavioral history" ON emotional_behavioral_history 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emotional behavioral history" ON emotional_behavioral_history 
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger para updated_at (se a função não existir, criar)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS update_emotional_behavioral_updated_at ON emotional_behavioral_history;
CREATE TRIGGER update_emotional_behavioral_updated_at 
    BEFORE UPDATE ON emotional_behavioral_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar colunas adicionadas em clients
SELECT 
    'Colunas em clients:' as info,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'clients' 
AND column_name IN ('converted_from_lead', 'lead_source', 'lead_template_id')
ORDER BY column_name;

-- Verificar colunas adicionadas em assessments (se a tabela existir)
SELECT 
    'Colunas em assessments:' as info,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'assessments' 
AND column_name IN ('is_reevaluation', 'parent_assessment_id', 'assessment_number', 'comparison_data')
ORDER BY column_name;

-- Verificar se a tabela emotional_behavioral_history foi criada
SELECT 
    'Tabela emotional_behavioral_history:' as info,
    COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'emotional_behavioral_history';

