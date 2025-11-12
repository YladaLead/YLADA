-- =====================================================
-- CONFIGURAÇÃO COMPLETA DO SUPABASE - YLADA
-- Execute este script COMPLETO no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. CRIAR TABELA: access_tokens
-- =====================================================
-- Necessária para tokens de acesso temporários (usuários migrados, recuperação de acesso)

CREATE TABLE IF NOT EXISTS access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_access_tokens_user_id ON access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_access_tokens_expires_at ON access_tokens(expires_at);

-- Comentários
COMMENT ON TABLE access_tokens IS 'Tokens temporários para acesso ao dashboard via link de e-mail';
COMMENT ON COLUMN access_tokens.token IS 'Token único gerado para cada solicitação de acesso';
COMMENT ON COLUMN access_tokens.expires_at IS 'Data de expiração do token (padrão: 30 dias)';
COMMENT ON COLUMN access_tokens.used_at IS 'Data em que o token foi usado (NULL = não usado ainda)';

-- =====================================================
-- 2. VERIFICAR/CRIAR TABELA: templates_nutrition
-- =====================================================
-- Verificar se a tabela existe, se não, criar estrutura básica

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'templates_nutrition'
  ) THEN
    CREATE TABLE templates_nutrition (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL, -- quiz, calculadora, planilha, landing
      language VARCHAR(10) NOT NULL DEFAULT 'pt', -- pt, en, es
      specialization VARCHAR(100), -- emagrecimento, ganho-massa, esportiva, clinica
      objective VARCHAR(100), -- capturar-leads, vender-suplementos, consultas
      title VARCHAR(255) NOT NULL,
      description TEXT,
      content JSONB NOT NULL,
      cta_text VARCHAR(255),
      whatsapp_message TEXT,
      is_active BOOLEAN DEFAULT true,
      usage_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_templates_nutrition_type ON templates_nutrition(type);
    CREATE INDEX IF NOT EXISTS idx_templates_nutrition_language ON templates_nutrition(language);
    CREATE INDEX IF NOT EXISTS idx_templates_nutrition_active ON templates_nutrition(is_active);
  END IF;
END $$;

-- =====================================================
-- 3. VERIFICAR/CRIAR TABELA: user_templates
-- =====================================================
-- Verificar se existe e se tem coluna conversions_count

DO $$
BEGIN
  -- Verificar se tabela existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_templates'
  ) THEN
    CREATE TABLE user_templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      template_id UUID REFERENCES templates_nutrition(id),
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      content JSONB NOT NULL,
      custom_cta_text VARCHAR(255),
      custom_whatsapp_message TEXT,
      views INTEGER DEFAULT 0,
      leads_count INTEGER DEFAULT 0,
      conversions_count INTEGER DEFAULT 0,
      status VARCHAR(20) DEFAULT 'active',
      expires_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_user_templates_user_id ON user_templates(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_templates_template_id ON user_templates(template_id);
    CREATE INDEX IF NOT EXISTS idx_user_templates_slug ON user_templates(slug);
    CREATE INDEX IF NOT EXISTS idx_user_templates_conversions_count ON user_templates(conversions_count);
  ELSE
    -- Tabela existe, verificar se tem conversions_count
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'user_templates' 
      AND column_name = 'conversions_count'
    ) THEN
      ALTER TABLE user_templates 
      ADD COLUMN conversions_count INTEGER DEFAULT 0;
      
      CREATE INDEX IF NOT EXISTS idx_user_templates_conversions_count ON user_templates(conversions_count);
    END IF;
  END IF;
END $$;

-- =====================================================
-- 4. VERIFICAR/CRIAR TABELA: leads
-- =====================================================
-- Verificar se existe

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'leads'
  ) THEN
    CREATE TABLE leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      template_id UUID REFERENCES user_templates(id) ON DELETE CASCADE,
      user_id UUID REFERENCES auth.users(id),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      whatsapp VARCHAR(20),
      additional_data JSONB,
      source VARCHAR(50) DEFAULT 'template',
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_leads_template_id ON leads(template_id);
    CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
  END IF;
END $$;

-- =====================================================
-- 5. VERIFICAR RLS (Row Level Security)
-- =====================================================
-- Garantir que RLS está habilitado nas tabelas necessárias

ALTER TABLE access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. POLÍTICAS RLS PARA access_tokens
-- =====================================================
-- Admin pode ver tudo, usuários não acessam diretamente (via API apenas)

DROP POLICY IF EXISTS "Admin can manage all access tokens" ON access_tokens;
CREATE POLICY "Admin can manage all access tokens"
  ON access_tokens FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND is_admin = true
    )
  );

-- =====================================================
-- 7. POLÍTICAS RLS PARA templates_nutrition
-- =====================================================
-- Templates ativos são públicos para leitura, admin pode gerenciar tudo

DROP POLICY IF EXISTS "Anyone can view active templates" ON templates_nutrition;
CREATE POLICY "Anyone can view active templates"
  ON templates_nutrition FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage all templates" ON templates_nutrition;
CREATE POLICY "Admin can manage all templates"
  ON templates_nutrition FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND is_admin = true
    )
  );

-- =====================================================
-- 8. POLÍTICAS RLS PARA user_templates
-- =====================================================
-- Usuários podem ver/gerenciar seus próprios templates

DROP POLICY IF EXISTS "Users can view own templates" ON user_templates;
CREATE POLICY "Users can view own templates"
  ON user_templates FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own templates" ON user_templates;
CREATE POLICY "Users can manage own templates"
  ON user_templates FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin pode ver tudo
DROP POLICY IF EXISTS "Admin can view all templates" ON user_templates;
CREATE POLICY "Admin can view all templates"
  ON user_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND is_admin = true
    )
  );

-- =====================================================
-- 9. POLÍTICAS RLS PARA leads
-- =====================================================
-- Usuários podem ver leads dos seus próprios templates

DROP POLICY IF EXISTS "Users can view own leads" ON leads;
CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_templates
      WHERE user_templates.id = leads.template_id
      AND user_templates.user_id = auth.uid()
    )
  );

-- Admin pode ver tudo
DROP POLICY IF EXISTS "Admin can view all leads" ON leads;
CREATE POLICY "Admin can view all leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND is_admin = true
    )
  );

-- =====================================================
-- 10. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar tabelas criadas
SELECT 
  'Tabelas criadas:' as status,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('access_tokens', 'templates_nutrition', 'user_templates', 'leads')
ORDER BY tablename;

-- Verificar coluna conversions_count
SELECT 
  'Coluna conversions_count existe!' as status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_templates'
  AND column_name = 'conversions_count';

-- Verificar índices
SELECT 
  'Índices criados:' as status,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('access_tokens', 'templates_nutrition', 'user_templates', 'leads')
ORDER BY tablename, indexname;

