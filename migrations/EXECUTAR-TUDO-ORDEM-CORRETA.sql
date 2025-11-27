-- =====================================================
-- YLADA - EXECUTAR TUDO NA ORDEM CORRETA
-- Execute este arquivo primeiro para criar as tabelas
-- Depois execute os scripts de FAQs
-- =====================================================

-- =====================================================
-- PASSO 1: CRIAR TABELAS (OBRIGATÓRIO PRIMEIRO)
-- =====================================================
-- Execute o arquivo: migrations/criar-tabelas-chat-suporte-nutri.sql
-- OU copie e cole o conteúdo abaixo:

\i migrations/criar-tabelas-chat-suporte-nutri.sql

-- =====================================================
-- PASSO 2: POPULAR FAQs (DEPOIS DAS TABELAS)
-- =====================================================
-- Execute os arquivos nesta ordem:
-- 1. migrations/popular-faqs-nutri-fase1-lote1.sql
-- 2. migrations/popular-faqs-nutri-fase1-lote2.sql
-- 3. migrations/popular-faqs-nutri-fase1-lote3.sql

-- OU execute os comandos abaixo:

\i migrations/popular-faqs-nutri-fase1-lote1.sql
\i migrations/popular-faqs-nutri-fase1-lote2.sql
\i migrations/popular-faqs-nutri-fase1-lote3.sql

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se tabelas foram criadas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as colunas
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN (
    'faq_responses',
    'support_tickets',
    'support_messages',
    'support_agents',
    'support_conversations'
  )
ORDER BY table_name;

-- Verificar quantos FAQs foram inseridos
SELECT 
    COUNT(*) as total_faqs,
    COUNT(DISTINCT categoria) as categorias,
    COUNT(DISTINCT subcategoria) as subcategorias
FROM faq_responses
WHERE area = 'nutri';

-- Listar categorias de FAQs
SELECT 
    categoria,
    COUNT(*) as quantidade
FROM faq_responses
WHERE area = 'nutri'
GROUP BY categoria
ORDER BY quantidade DESC;

