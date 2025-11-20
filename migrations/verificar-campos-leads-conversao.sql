-- =====================================================
-- VERIFICAÇÃO: Campos necessários para conversão de Leads
-- =====================================================
-- Este script verifica se todos os campos necessários existem
-- na tabela clients para a funcionalidade de conversão de leads

-- Verificar campos na tabela clients
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'clients'
    AND column_name IN (
        'lead_id',
        'converted_from_lead',
        'lead_source',
        'lead_template_id',
        'status'
    )
ORDER BY column_name;

-- Se algum campo não existir, execute o script abaixo:
-- migrations/add-lead-integration-columns.sql

-- =====================================================
-- RESUMO DOS CAMPOS NECESSÁRIOS:
-- =====================================================
-- ✅ lead_id - UUID (referência ao lead original)
-- ✅ converted_from_lead - BOOLEAN (flag de conversão)
-- ✅ lead_source - VARCHAR(100) (origem: quiz, calculadora, etc.)
-- ✅ lead_template_id - UUID (template que gerou o lead)
-- ✅ status - VARCHAR(50) (status do cliente no Kanban)

-- =====================================================
-- TABELAS USADAS (TODAS JÁ EXISTEM):
-- =====================================================
-- ✅ clients - Clientes (já existe)
-- ✅ leads - Leads (já existe)
-- ✅ user_templates - Templates (já existe)
-- ✅ assessments - Avaliações (já existe)
-- ✅ client_history - Histórico (já existe)

-- NENHUMA TABELA NOVA É NECESSÁRIA! ✅

