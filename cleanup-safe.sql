-- =====================================================
-- LIMPEZA SEGURA - DELETAR APENAS NOSSAS TABELAS
-- Execute este script para limpar apenas as tabelas que criamos
-- =====================================================

-- Desabilitar RLS temporariamente para evitar problemas
SET session_replication_role = replica;

-- Dropar apenas as tabelas que criamos (não as do sistema Supabase)
DROP TABLE IF EXISTS user_templates CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_metrics CASCADE;
DROP TABLE IF EXISTS user_calculators CASCADE;
DROP TABLE IF EXISTS translation_quality CASCADE;
DROP TABLE IF EXISTS templates_nutrition CASCADE;
DROP TABLE IF EXISTS templates_ia CASCADE;
DROP TABLE IF EXISTS templates_base CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS ia_learning CASCADE;
DROP TABLE IF EXISTS generated_tools CASCADE;
DROP TABLE IF EXISTS generated_links CASCADE;
DROP TABLE IF EXISTS countries_compliance CASCADE;
DROP TABLE IF EXISTS calculator_types CASCADE;
DROP TABLE IF EXISTS calculation_validations CASCADE;
DROP TABLE IF EXISTS assistant_metrics CASCADE;
DROP TABLE IF EXISTS ai_translations_cache CASCADE;
DROP TABLE IF EXISTS ai_response_cache CASCADE;
DROP TABLE IF EXISTS ai_generated_templates CASCADE;
DROP TABLE IF EXISTS ai_conversations CASCADE;

-- Dropar nossa tabela users (se existir)
DROP TABLE IF EXISTS users CASCADE;

-- Reabilitar RLS
SET session_replication_role = DEFAULT;

-- Verificar tabelas restantes
SELECT 
    'TABELAS RESTANTES:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name NOT LIKE 'auth.%'  -- Ignorar tabelas de autenticação
ORDER BY table_name;

-- Se retornar apenas tabelas do sistema (como auth.users), está limpo!

