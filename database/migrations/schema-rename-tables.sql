-- =====================================================
-- YLADA - RENOMEAR TABELAS PARA NOMENCLATURA PADRONIZADA
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. BACKUP DAS TABELAS ORIGINAIS
-- =====================================================

CREATE TABLE IF NOT EXISTS templates_nutrition_backup AS SELECT * FROM templates_nutrition;
CREATE TABLE IF NOT EXISTS user_templates_backup AS SELECT * FROM user_templates;
CREATE TABLE IF NOT EXISTS quiz_perguntas_backup AS SELECT * FROM quiz_perguntas;
CREATE TABLE IF NOT EXISTS quiz_respostas_backup AS SELECT * FROM quiz_respostas;

-- =====================================================
-- 2. RENOMEAR TABELAS
-- =====================================================

-- templates_nutrition → template_catalog
ALTER TABLE IF EXISTS templates_nutrition RENAME TO template_catalog;

-- user_templates → user_instances
ALTER TABLE IF EXISTS user_templates RENAME TO user_instances;

-- quiz_perguntas → quiz_questions
ALTER TABLE IF EXISTS quiz_perguntas RENAME TO quiz_questions;

-- quiz_respostas → quiz_responses
ALTER TABLE IF EXISTS quiz_respostas RENAME TO quiz_responses;

-- =====================================================
-- 3. RENOMEAR ÍNDICES
-- =====================================================

-- Índices de template_catalog (era templates_nutrition)
ALTER INDEX IF EXISTS idx_templates_nutrition_language RENAME TO idx_template_catalog_language;
ALTER INDEX IF EXISTS idx_templates_nutrition_specialization RENAME TO idx_template_catalog_specialization;
ALTER INDEX IF EXISTS idx_templates_nutrition_active RENAME TO idx_template_catalog_active;

-- Índices de user_instances (era user_templates)
ALTER INDEX IF EXISTS idx_user_templates_user_id RENAME TO idx_user_instances_user_id;
ALTER INDEX IF EXISTS idx_user_templates_slug RENAME TO idx_user_instances_slug;
ALTER INDEX IF EXISTS idx_user_templates_status RENAME TO idx_user_instances_status;

-- Índices de quiz_questions (era quiz_perguntas)
ALTER INDEX IF EXISTS idx_quiz_perguntas_quiz_id RENAME TO idx_quiz_questions_quiz_id;
ALTER INDEX IF EXISTS idx_quiz_perguntas_ordem RENAME TO idx_quiz_questions_ordem;

-- Índices de quiz_responses (era quiz_respostas)
ALTER INDEX IF EXISTS idx_quiz_respostas_quiz_id RENAME TO idx_quiz_responses_quiz_id;
ALTER INDEX IF EXISTS idx_quiz_respostas_pergunta_id RENAME TO idx_quiz_responses_question_id;
ALTER INDEX IF EXISTS idx_quiz_respostas_created_at RENAME TO idx_quiz_responses_created_at;

-- =====================================================
-- 4. ATUALIZAR FOREIGN KEYS E COLUNAS
-- =====================================================

-- Atualizar foreign key em leads
DO $$ 
BEGIN
    -- Remover constraint antiga
    ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_template_id_fkey;
    
    -- Renomear coluna template_id → instance_id
    ALTER TABLE leads RENAME COLUMN template_id TO instance_id;
    
    -- Adicionar nova constraint
    ALTER TABLE leads ADD CONSTRAINT leads_instance_id_fkey 
        FOREIGN KEY (instance_id) REFERENCES user_instances(id) ON DELETE CASCADE;
END $$;

-- Atualizar foreign key em quiz_responses
DO $$
BEGIN
    -- Remover constraint antiga
    ALTER TABLE quiz_responses DROP CONSTRAINT IF EXISTS quiz_respostas_pergunta_id_fkey;
    
    -- Renomear coluna pergunta_id → question_id
    ALTER TABLE quiz_responses RENAME COLUMN pergunta_id TO question_id;
    
    -- Adicionar nova constraint
    ALTER TABLE quiz_responses ADD CONSTRAINT quiz_responses_question_id_fkey 
        FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE;
END $$;

-- Atualizar foreign key em user_instances para reference template_catalog
DO $$
BEGIN
    ALTER TABLE user_instances DROP CONSTRAINT IF EXISTS user_instances_template_id_fkey;
    ALTER TABLE user_instances ADD CONSTRAINT user_instances_template_id_fkey 
        FOREIGN KEY (template_id) REFERENCES template_catalog(id);
END $$;

-- =====================================================
-- 5. RENOMEAR POLÍTICAS RLS
-- =====================================================

-- Políticas de template_catalog
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'templates_nutrition' AND policyname = 'Users can view own templates') THEN
        ALTER POLICY "Users can view own templates" ON templates_nutrition RENAME TO "Users can view own templates";
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'template_catalog' AND policyname = 'Users can view own templates') THEN
        DROP POLICY "Users can view own templates" ON template_catalog;
        CREATE POLICY "Users can view all templates" ON template_catalog FOR SELECT USING (true);
    END IF;
END $$;

-- Políticas de user_instances
DO $$
BEGIN
    ALTER POLICY IF EXISTS "Users can view own templates" ON user_instances RENAME TO "Users can view own instances";
    ALTER POLICY IF EXISTS "Users can update own templates" ON user_instances RENAME TO "Users can update own instances";
    ALTER POLICY IF EXISTS "Users can insert own templates" ON user_instances RENAME TO "Users can insert own instances";
    ALTER POLICY IF EXISTS "Users can delete own templates" ON user_instances RENAME TO "Users can delete own instances";
END $$;

-- Políticas de quiz_questions
DO $$
BEGIN
    ALTER POLICY IF EXISTS "Users can manage own quiz_perguntas" ON quiz_questions RENAME TO "Users can manage own quiz_questions";
END $$;

-- Políticas de quiz_responses
DO $$
BEGIN
    ALTER POLICY IF EXISTS "Anyone can insert quiz_respostas" ON quiz_responses RENAME TO "Anyone can insert quiz_responses";
    ALTER POLICY IF EXISTS "Users can view own quiz responses" ON quiz_responses RENAME TO "Users can view own quiz responses";
END $$;

-- =====================================================
-- 6. VERIFICAR TABELAS RENOMEADAS
-- =====================================================

SELECT 
    'TABELAS RENOMEADAS:' as info,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('template_catalog', 'user_instances', 'quiz_questions', 'quiz_responses', 'users', 'user_profiles', 'leads', 'quizzes')
ORDER BY table_name;

-- =====================================================
-- 7. RESUMO DAS MUDANÇAS
-- =====================================================

SELECT 
    'MUDANÇAS APLICADAS:' as info,
    'templates_nutrition' as tabela_antiga,
    'template_catalog' as tabela_nova
UNION ALL
SELECT 
    '' as info,
    'user_templates' as tabela_antiga,
    'user_instances' as tabela_nova
UNION ALL
SELECT 
    '' as info,
    'quiz_perguntas' as tabela_antiga,
    'quiz_questions' as tabela_nova
UNION ALL
SELECT 
    '' as info,
    'quiz_respostas' as tabela_antiga,
    'quiz_responses' as tabela_nova;

