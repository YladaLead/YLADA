-- =====================================================
-- LIMPEZA TOTAL - DELETAR TODAS AS TABELAS
-- Execute este script primeiro para limpar tudo
-- =====================================================

-- Desabilitar RLS temporariamente para evitar problemas
SET session_replication_role = replica;

-- Dropar TODAS as tabelas existentes (em ordem alfabética reversa)
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

-- Dropar tabelas de usuários se existirem (apenas as que criamos)
DROP TABLE IF EXISTS users CASCADE;
-- NÃO deletar auth.users (é do sistema Supabase)

-- Reabilitar RLS
SET session_replication_role = DEFAULT;

-- Verificar se todas as tabelas foram deletadas
SELECT 
    'TABELAS RESTANTES:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Se retornar vazio, significa que todas foram deletadas!
