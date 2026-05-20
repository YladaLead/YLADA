-- =====================================================
-- YLADA - SETUP APENAS DE POLICIES RLS
-- Execute este arquivo para configurar as políticas
-- sem recriar tabelas que já existem
-- =====================================================

-- =====================================================
-- 1. POLICIES PARA TABELAS PRINCIPAIS
-- =====================================================

-- Policies para users (se não existirem)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own data') THEN
    CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own data') THEN
    CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Policies para user_profiles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view own profiles') THEN
    CREATE POLICY "Users can view own profiles" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profiles') THEN
    CREATE POLICY "Users can update own profiles" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert own profiles') THEN
    CREATE POLICY "Users can insert own profiles" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Policies para templates_nutrition
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'templates_nutrition' AND policyname = 'Anyone can view active templates') THEN
    CREATE POLICY "Anyone can view active templates" ON templates_nutrition FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- Policies para user_templates
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_templates' AND policyname = 'Users can view own templates') THEN
    CREATE POLICY "Users can view own templates" ON user_templates FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_templates' AND policyname = 'Users can update own templates') THEN
    CREATE POLICY "Users can update own templates" ON user_templates FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_templates' AND policyname = 'Users can insert own templates') THEN
    CREATE POLICY "Users can insert own templates" ON user_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_templates' AND policyname = 'Users can delete own templates') THEN
    CREATE POLICY "Users can delete own templates" ON user_templates FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Policies para leads
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Users can view own leads') THEN
    CREATE POLICY "Users can view own leads" ON leads FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Anyone can insert leads') THEN
    CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- =====================================================
-- 2. POLICIES PARA TABELAS DE QUIZZES
-- =====================================================

-- Policies para quizzes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Users can view own quizzes') THEN
    CREATE POLICY "Users can view own quizzes" ON quizzes FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Users can insert own quizzes') THEN
    CREATE POLICY "Users can insert own quizzes" ON quizzes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Users can update own quizzes') THEN
    CREATE POLICY "Users can update own quizzes" ON quizzes FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Users can delete own quizzes') THEN
    CREATE POLICY "Users can delete own quizzes" ON quizzes FOR DELETE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Anyone can view active quizzes') THEN
    CREATE POLICY "Anyone can view active quizzes" ON quizzes FOR SELECT USING (status = 'active');
  END IF;
END $$;

-- Policies para quiz_perguntas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_perguntas' AND policyname = 'Users can manage own quiz_perguntas') THEN
    CREATE POLICY "Users can manage own quiz_perguntas" ON quiz_perguntas FOR ALL 
      USING (quiz_id IN (SELECT id FROM quizzes WHERE user_id = auth.uid()));
  END IF;
END $$;

-- Policies para quiz_respostas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_respostas' AND policyname = 'Anyone can insert quiz_respostas') THEN
    CREATE POLICY "Anyone can insert quiz_respostas" ON quiz_respostas FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_respostas' AND policyname = 'Users can view own quiz responses') THEN
    CREATE POLICY "Users can view own quiz responses" ON quiz_respostas FOR SELECT 
      USING (quiz_id IN (SELECT id FROM quizzes WHERE user_id = auth.uid()));
  END IF;
END $$;

-- =====================================================
-- 3. HABILITAR RLS (se ainda não estiver habilitado)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_respostas ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. VERIFICAR POLICIES CRIADAS
-- =====================================================

SELECT 
    'POLICIES CRIADAS:' as info,
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

