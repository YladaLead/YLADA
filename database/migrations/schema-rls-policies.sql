-- =====================================================
-- YLADA - POLÍTICAS RLS PARA ISOLAMENTO POR PERFIL
-- Garante que cada perfil só veja seus próprios dados
-- Admin pode ver tudo
-- =====================================================

-- =====================================================
-- 1. FUNÇÃO HELPER PARA VERIFICAR SE É ADMIN
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND is_admin = true
  );
END;
$$;

-- =====================================================
-- 2. FUNÇÃO HELPER PARA VERIFICAR PERFIL DO USUÁRIO
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_perfil()
RETURNS VARCHAR(50)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN (
    SELECT perfil 
    FROM user_profiles 
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$;

-- =====================================================
-- 3. POLÍTICAS RLS PARA user_templates
-- =====================================================

-- Habilitar RLS se ainda não estiver habilitado
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;

-- Dropar políticas existentes
DROP POLICY IF EXISTS "Users can view own tools" ON user_templates;
DROP POLICY IF EXISTS "Users can insert own tools" ON user_templates;
DROP POLICY IF EXISTS "Users can update own tools" ON user_templates;
DROP POLICY IF EXISTS "Users can delete own tools" ON user_templates;
DROP POLICY IF EXISTS "Admins can view all tools" ON user_templates;
DROP POLICY IF EXISTS "Admins can manage all tools" ON user_templates;

-- Política: Usuários podem ver apenas suas próprias ferramentas
CREATE POLICY "Users can view own tools"
ON user_templates FOR SELECT
USING (user_id = auth.uid());

-- Política: Usuários podem inserir suas próprias ferramentas
CREATE POLICY "Users can insert own tools"
ON user_templates FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Política: Usuários podem atualizar suas próprias ferramentas
CREATE POLICY "Users can update own tools"
ON user_templates FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Política: Usuários podem deletar suas próprias ferramentas
CREATE POLICY "Users can delete own tools"
ON user_templates FOR DELETE
USING (user_id = auth.uid());

-- Política: Admins podem ver todas as ferramentas
CREATE POLICY "Admins can view all tools"
ON user_templates FOR SELECT
USING (is_admin());

-- Política: Admins podem gerenciar todas as ferramentas
CREATE POLICY "Admins can manage all tools"
ON user_templates FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- 4. POLÍTICAS RLS PARA leads (se a tabela existir)
-- =====================================================

-- Verificar se tabela existe antes de criar políticas
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'leads'
  ) THEN
    -- Habilitar RLS
    ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

    -- Dropar políticas existentes
    DROP POLICY IF EXISTS "Users can view own leads" ON leads;
    DROP POLICY IF EXISTS "Users can insert own leads" ON leads;
    DROP POLICY IF EXISTS "Users can update own leads" ON leads;
    DROP POLICY IF EXISTS "Users can delete own leads" ON leads;
    DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
    DROP POLICY IF EXISTS "Admins can manage all leads" ON leads;

    -- Políticas para usuários (leads tem template_id que referencia user_templates e user_id direto)
    CREATE POLICY "Users can view own leads"
    ON leads FOR SELECT
    USING (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_templates ut
        WHERE ut.id = leads.template_id
        AND ut.user_id = auth.uid()
      )
    );

    CREATE POLICY "Users can insert own leads"
    ON leads FOR INSERT
    WITH CHECK (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_templates ut
        WHERE ut.id = leads.template_id
        AND ut.user_id = auth.uid()
      )
    );

    CREATE POLICY "Users can update own leads"
    ON leads FOR UPDATE
    USING (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_templates ut
        WHERE ut.id = leads.template_id
        AND ut.user_id = auth.uid()
      )
    )
    WITH CHECK (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_templates ut
        WHERE ut.id = leads.template_id
        AND ut.user_id = auth.uid()
      )
    );

    CREATE POLICY "Users can delete own leads"
    ON leads FOR DELETE
    USING (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_templates ut
        WHERE ut.id = leads.template_id
        AND ut.user_id = auth.uid()
      )
    );

    -- Políticas para admins
    CREATE POLICY "Admins can view all leads"
    ON leads FOR SELECT
    USING (is_admin());

    CREATE POLICY "Admins can manage all leads"
    ON leads FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
  END IF;
END $$;

-- =====================================================
-- 5. POLÍTICAS RLS PARA contacts (se a tabela existir)
-- =====================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'contacts'
  ) THEN
    ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own contacts" ON contacts;
    DROP POLICY IF EXISTS "Users can insert own contacts" ON contacts;
    DROP POLICY IF EXISTS "Users can update own contacts" ON contacts;
    DROP POLICY IF EXISTS "Users can delete own contacts" ON contacts;
    DROP POLICY IF EXISTS "Admins can view all contacts" ON contacts;
    DROP POLICY IF EXISTS "Admins can manage all contacts" ON contacts;

    CREATE POLICY "Users can view own contacts"
    ON contacts FOR SELECT
    USING (user_id = auth.uid());

    CREATE POLICY "Users can insert own contacts"
    ON contacts FOR INSERT
    WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Users can update own contacts"
    ON contacts FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Users can delete own contacts"
    ON contacts FOR DELETE
    USING (user_id = auth.uid());

    CREATE POLICY "Admins can view all contacts"
    ON contacts FOR SELECT
    USING (is_admin());

    CREATE POLICY "Admins can manage all contacts"
    ON contacts FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
  END IF;
END $$;

-- =====================================================
-- 6. POLÍTICAS RLS PARA quizzes (se a tabela existir)
-- =====================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'quizzes'
  ) THEN
    ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own quizzes" ON quizzes;
    DROP POLICY IF EXISTS "Users can insert own quizzes" ON quizzes;
    DROP POLICY IF EXISTS "Users can update own quizzes" ON quizzes;
    DROP POLICY IF EXISTS "Users can delete own quizzes" ON quizzes;
    DROP POLICY IF EXISTS "Admins can view all quizzes" ON quizzes;
    DROP POLICY IF EXISTS "Admins can manage all quizzes" ON quizzes;

    CREATE POLICY "Users can view own quizzes"
    ON quizzes FOR SELECT
    USING (user_id = auth.uid());

    CREATE POLICY "Users can insert own quizzes"
    ON quizzes FOR INSERT
    WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Users can update own quizzes"
    ON quizzes FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Users can delete own quizzes"
    ON quizzes FOR DELETE
    USING (user_id = auth.uid());

    CREATE POLICY "Admins can view all quizzes"
    ON quizzes FOR SELECT
    USING (is_admin());

    CREATE POLICY "Admins can manage all quizzes"
    ON quizzes FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
  END IF;
END $$;

-- =====================================================
-- 7. POLÍTICAS RLS PARA subscriptions (se a tabela existir)
-- =====================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions'
  ) THEN
    ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON subscriptions;

    CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (user_id = auth.uid());

    CREATE POLICY "Users can insert own subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Users can update own subscriptions"
    ON subscriptions FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Admins can view all subscriptions"
    ON subscriptions FOR SELECT
    USING (is_admin());

    CREATE POLICY "Admins can manage all subscriptions"
    ON subscriptions FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
  END IF;
END $$;

-- =====================================================
-- 8. ATUALIZAR POLÍTICAS DE user_profiles PARA SUPORTAR ADMIN
-- =====================================================

-- Admin pode ver todos os perfis (para gestão)
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
USING (
  is_admin()
  OR auth.uid() = user_id
);

-- Admin pode atualizar todos os perfis (para gestão)
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

CREATE POLICY "Admins can update all profiles"
ON user_profiles FOR UPDATE
USING (
  is_admin()
  OR auth.uid() = user_id
)
WITH CHECK (
  is_admin()
  OR auth.uid() = user_id
);

-- =====================================================
-- 9. COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON FUNCTION is_admin() IS 'Verifica se o usuário autenticado é admin';
COMMENT ON FUNCTION get_user_perfil() IS 'Retorna o perfil do usuário autenticado (nutri, nutra, wellness, coach, admin)';

-- =====================================================
-- 10. VERIFICAÇÃO DE SEGURANÇA
-- =====================================================

-- Verificar se RLS está habilitado nas tabelas críticas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_templates'
    AND rowsecurity = true
  ) THEN
    RAISE WARNING 'RLS não está habilitado em user_templates!';
  END IF;
END $$;

