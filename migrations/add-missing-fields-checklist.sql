-- =====================================================
-- MIGRAÇÃO: Adicionar Campos Faltantes do Checklist Oficial
-- =====================================================
-- Este script adiciona os campos obrigatórios identificados
-- na auditoria que estão faltando no schema atual

BEGIN;

-- =====================================================
-- 1. ADICIONAR CAMPOS FALTANTES EM `clients`
-- =====================================================

-- Adicionar campo instagram
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'instagram'
    ) THEN
        ALTER TABLE clients ADD COLUMN instagram VARCHAR(100);
    END IF;
END $$;

-- Adicionar campo goal
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'goal'
    ) THEN
        ALTER TABLE clients ADD COLUMN goal TEXT;
    END IF;
END $$;

-- Adicionar campo origin (alias para lead_source, mantendo ambos)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'origin'
    ) THEN
        ALTER TABLE clients ADD COLUMN origin VARCHAR(50);
        -- Copiar valores de lead_source para origin se existirem
        UPDATE clients SET origin = lead_source WHERE lead_source IS NOT NULL;
    END IF;
END $$;

-- Adicionar campo origin_id (alias genérico, mantendo lead_template_id e lead_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'origin_id'
    ) THEN
        ALTER TABLE clients ADD COLUMN origin_id UUID;
        -- Preencher origin_id com lead_template_id ou lead_id se existirem
        UPDATE clients 
        SET origin_id = COALESCE(lead_template_id, lead_id) 
        WHERE lead_template_id IS NOT NULL OR lead_id IS NOT NULL;
    END IF;
END $$;

-- =====================================================
-- 2. ADICIONAR CAMPOS FALTANTES EM `emotional_behavioral_history`
-- =====================================================

-- Adicionar campo story
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'emotional_behavioral_history' AND column_name = 'story'
    ) THEN
        ALTER TABLE emotional_behavioral_history ADD COLUMN story TEXT;
    END IF;
END $$;

-- Adicionar campo moment_of_change
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'emotional_behavioral_history' AND column_name = 'moment_of_change'
    ) THEN
        ALTER TABLE emotional_behavioral_history ADD COLUMN moment_of_change TEXT;
    END IF;
END $$;

-- Adicionar campo commitment
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'emotional_behavioral_history' AND column_name = 'commitment'
    ) THEN
        ALTER TABLE emotional_behavioral_history ADD COLUMN commitment INTEGER;
        -- Copiar valores de adherence_score para commitment se existirem
        UPDATE emotional_behavioral_history 
        SET commitment = adherence_score 
        WHERE adherence_score IS NOT NULL AND commitment IS NULL;
    END IF;
END $$;

-- Adicionar campo biggest_fear
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'emotional_behavioral_history' AND column_name = 'biggest_fear'
    ) THEN
        ALTER TABLE emotional_behavioral_history ADD COLUMN biggest_fear TEXT;
    END IF;
END $$;

-- Adicionar campo behavioral_block
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'emotional_behavioral_history' AND column_name = 'behavioral_block'
    ) THEN
        ALTER TABLE emotional_behavioral_history ADD COLUMN behavioral_block TEXT;
    END IF;
END $$;

-- =====================================================
-- 3. ADICIONAR CAMPOS FALTANTES EM `programs`
-- =====================================================

-- Adicionar campo stage
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'programs' AND column_name = 'stage'
    ) THEN
        ALTER TABLE programs ADD COLUMN stage VARCHAR(50);
    END IF;
END $$;

-- Adicionar campo weekly_goal
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'programs' AND column_name = 'weekly_goal'
    ) THEN
        ALTER TABLE programs ADD COLUMN weekly_goal TEXT;
    END IF;
END $$;

-- =====================================================
-- 4. ADICIONAR ÍNDICES PARA NOVOS CAMPOS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_clients_origin ON clients(origin);
CREATE INDEX IF NOT EXISTS idx_clients_origin_id ON clients(origin_id);
CREATE INDEX IF NOT EXISTS idx_clients_goal ON clients(goal);

-- =====================================================
-- 5. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar campos adicionados em clients
SELECT 
    'Campos em clients:' as info,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'clients' 
AND column_name IN ('instagram', 'goal', 'origin', 'origin_id')
ORDER BY column_name;

-- Verificar campos adicionados em emotional_behavioral_history
SELECT 
    'Campos em emotional_behavioral_history:' as info,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'emotional_behavioral_history' 
AND column_name IN ('story', 'moment_of_change', 'commitment', 'biggest_fear', 'behavioral_block')
ORDER BY column_name;

-- Verificar campos adicionados em programs
SELECT 
    'Campos em programs:' as info,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'programs' 
AND column_name IN ('stage', 'weekly_goal')
ORDER BY column_name;

COMMIT;

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================

