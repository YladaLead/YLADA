-- =====================================================
-- AJUSTES FINAIS - Schema Módulo de Gestão Nutri
-- =====================================================
-- Este script faz todos os ajustes necessários antes
-- de continuar com as interfaces do frontend
-- Execute no Supabase SQL Editor
-- =====================================================

BEGIN;

-- =====================================================
-- 1. ADICIONAR CAMPOS FALTANTES EM `clients`
-- =====================================================

-- Adicionar campo phone_country_code (para suporte internacional)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'phone_country_code'
    ) THEN
        ALTER TABLE clients ADD COLUMN phone_country_code VARCHAR(5) DEFAULT 'BR';
        -- Atualizar registros existentes para BR (padrão)
        UPDATE clients SET phone_country_code = 'BR' WHERE phone_country_code IS NULL;
    END IF;
END $$;

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

-- =====================================================
-- 2. AJUSTAR VALORES DE STATUS (se necessário)
-- =====================================================

-- Criar função para migrar status antigos para novos valores
DO $$
BEGIN
    -- Migrar 'ativo' para 'ativa'
    UPDATE clients 
    SET status = 'ativa' 
    WHERE status = 'ativo';
    
    -- Migrar 'pausado' para 'pausa'
    UPDATE clients 
    SET status = 'pausa' 
    WHERE status = 'pausado';
    
    -- Migrar 'encerrado' para 'finalizada'
    UPDATE clients 
    SET status = 'finalizada' 
    WHERE status = 'encerrado';
    
    -- Migrar 'inativo' para 'finalizada' (ou manter como está, dependendo da lógica)
    -- UPDATE clients 
    -- SET status = 'finalizada' 
    -- WHERE status = 'inativo';
END $$;

-- =====================================================
-- 3. ADICIONAR CAMPOS FALTANTES EM `emotional_behavioral_history`
-- =====================================================

-- Verificar se a tabela existe antes de adicionar campos
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'emotional_behavioral_history'
    ) THEN
        -- Adicionar campo story
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'emotional_behavioral_history' AND column_name = 'story'
        ) THEN
            ALTER TABLE emotional_behavioral_history ADD COLUMN story TEXT;
        END IF;

        -- Adicionar campo moment_of_change
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'emotional_behavioral_history' AND column_name = 'moment_of_change'
        ) THEN
            ALTER TABLE emotional_behavioral_history ADD COLUMN moment_of_change TEXT;
        END IF;

        -- Adicionar campo commitment
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

        -- Adicionar campo biggest_fear
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'emotional_behavioral_history' AND column_name = 'biggest_fear'
        ) THEN
            ALTER TABLE emotional_behavioral_history ADD COLUMN biggest_fear TEXT;
        END IF;

        -- Adicionar campo behavioral_block
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'emotional_behavioral_history' AND column_name = 'behavioral_block'
        ) THEN
            ALTER TABLE emotional_behavioral_history ADD COLUMN behavioral_block TEXT;
        END IF;
    END IF;
END $$;

-- =====================================================
-- 4. ADICIONAR CAMPOS FALTANTES EM `programs`
-- =====================================================

-- Verificar se a tabela existe antes de adicionar campos
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'programs'
    ) THEN
        -- Adicionar campo stage
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'programs' AND column_name = 'stage'
        ) THEN
            ALTER TABLE programs ADD COLUMN stage VARCHAR(50);
        END IF;

        -- Adicionar campo weekly_goal
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'programs' AND column_name = 'weekly_goal'
        ) THEN
            ALTER TABLE programs ADD COLUMN weekly_goal TEXT;
        END IF;
    END IF;
END $$;

-- =====================================================
-- 5. ADICIONAR ÍNDICES PARA NOVOS CAMPOS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_clients_phone_country_code ON clients(phone_country_code);
CREATE INDEX IF NOT EXISTS idx_clients_goal ON clients(goal) WHERE goal IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_instagram ON clients(instagram) WHERE instagram IS NOT NULL;

-- =====================================================
-- 6. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar campos adicionados em clients
DO $$
DECLARE
    missing_fields TEXT[];
BEGIN
    SELECT array_agg(column_name)
    INTO missing_fields
    FROM (
        SELECT 'phone_country_code' as column_name
        WHERE NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'clients' AND column_name = 'phone_country_code'
        )
        UNION ALL
        SELECT 'instagram' as column_name
        WHERE NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'clients' AND column_name = 'instagram'
        )
        UNION ALL
        SELECT 'goal' as column_name
        WHERE NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'clients' AND column_name = 'goal'
        )
    ) missing;
    
    IF array_length(missing_fields, 1) > 0 THEN
        RAISE NOTICE '⚠️ Campos ainda faltando em clients: %', array_to_string(missing_fields, ', ');
    ELSE
        RAISE NOTICE '✅ Todos os campos foram adicionados em clients';
    END IF;
END $$;

-- Listar campos adicionados
SELECT 
    '✅ Campos em clients:' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'clients' 
AND column_name IN ('phone_country_code', 'instagram', 'goal', 'status')
ORDER BY column_name;

COMMIT;

-- =====================================================
-- FIM DOS AJUSTES
-- =====================================================
-- 
-- RESUMO DO QUE FOI FEITO:
-- ✅ Adicionado phone_country_code em clients
-- ✅ Adicionado instagram em clients
-- ✅ Adicionado goal em clients
-- ✅ Ajustados valores de status (ativo -> ativa, pausado -> pausa, etc.)
-- ✅ Adicionados campos em emotional_behavioral_history (se tabela existir)
-- ✅ Adicionados campos em programs (se tabela existir)
-- ✅ Criados índices para novos campos
-- 
-- PRÓXIMOS PASSOS:
-- 1. Verificar se todas as tabelas foram criadas corretamente
-- 2. Testar as APIs com os novos campos
-- 3. Continuar com as interfaces do frontend
-- =====================================================


