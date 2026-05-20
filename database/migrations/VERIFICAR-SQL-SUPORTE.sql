-- =====================================================
-- VERIFICAR SE TABELAS DE SUPORTE JÁ EXISTEM
-- Execute este SQL primeiro para verificar
-- =====================================================

-- Verificar se as tabelas existem
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Existe'
        ELSE '❌ Não existe'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'faq_responses',
    'support_tickets',
    'support_messages',
    'support_agents',
    'support_conversations'
  )
ORDER BY table_name;

-- Se alguma tabela não aparecer, você precisa executar:
-- migrations/criar-tabelas-chat-suporte-nutri.sql

