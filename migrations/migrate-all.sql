-- =====================================================
-- MIGRAÇÃO COMPLETA - Módulo de Gestão Nutri
-- =====================================================
-- Este script executa todas as migrações necessárias
-- para atualizar o banco de dados com as novas funcionalidades

-- Executar migrações em ordem
\i migrations/add-lead-integration-columns.sql
\i migrations/add-reevaluation-columns.sql
\i migrations/create-emotional-behavioral-table.sql

-- Verificar status final
SELECT 
    'Migração concluída!' as status,
    COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name IN (
    'clients',
    'client_evolution',
    'appointments',
    'assessments',
    'programs',
    'custom_forms',
    'form_responses',
    'client_history',
    'emotional_behavioral_history'
);

