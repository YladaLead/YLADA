-- ============================================
-- SCHEMA: WELLNESS PORTALS
-- Tabelas para o sistema de Portais de Bem-Estar
-- ============================================

-- Remover tabelas se existirem (para recriação)
DROP TABLE IF EXISTS portal_tools CASCADE;
DROP TABLE IF EXISTS wellness_portals CASCADE;

-- ============================================
-- TABELA: wellness_portals
-- Armazena os portais de bem-estar criados pelos usuários
-- ============================================
CREATE TABLE wellness_portals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações básicas
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  
  -- Configurações
  navigation_type VARCHAR(20) DEFAULT 'menu' CHECK (navigation_type IN ('menu', 'sequential')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  
  -- Personalização
  custom_colors JSONB DEFAULT '{"primary": "#10B981", "secondary": "#059669"}'::jsonb,
  header_text TEXT,
  footer_text TEXT,
  
  -- Ordem das ferramentas (para navegação sequencial)
  tools_order JSONB DEFAULT '[]'::jsonb,
  
  -- Estatísticas
  views INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: portal_tools
-- Relaciona ferramentas (user_templates) com portais
-- ============================================
CREATE TABLE portal_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id UUID NOT NULL REFERENCES wellness_portals(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES user_templates(id) ON DELETE CASCADE,
  
  -- Posição/ordem da ferramenta no portal
  position INTEGER NOT NULL DEFAULT 1,
  
  -- Configurações
  is_required BOOLEAN DEFAULT FALSE,
  display_name VARCHAR(255), -- Nome personalizado para exibição no portal
  redirect_to_tool_id UUID REFERENCES user_templates(id) ON DELETE SET NULL, -- Para redirecionamento após conclusão
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: uma ferramenta só pode aparecer uma vez por portal
  UNIQUE (portal_id, tool_id)
);

-- ============================================
-- ÍNDICES
-- ============================================

-- Índices para wellness_portals
CREATE INDEX idx_wellness_portals_user_id ON wellness_portals(user_id);
CREATE INDEX idx_wellness_portals_slug ON wellness_portals(slug);
CREATE INDEX idx_wellness_portals_status ON wellness_portals(status);
CREATE INDEX idx_wellness_portals_user_status ON wellness_portals(user_id, status);

-- Índices para portal_tools
CREATE INDEX idx_portal_tools_portal_id ON portal_tools(portal_id);
CREATE INDEX idx_portal_tools_tool_id ON portal_tools(tool_id);
CREATE INDEX idx_portal_tools_position ON portal_tools(portal_id, position);

-- ============================================
-- TRIGGERS: Atualizar updated_at automaticamente
-- ============================================

-- Função para atualizar updated_at (se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover triggers se existirem antes de criar
DROP TRIGGER IF EXISTS update_wellness_portals_updated_at ON wellness_portals;
CREATE TRIGGER update_wellness_portals_updated_at
  BEFORE UPDATE ON wellness_portals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portal_tools_updated_at ON portal_tools;
CREATE TRIGGER update_portal_tools_updated_at
  BEFORE UPDATE ON portal_tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE wellness_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_tools ENABLE ROW LEVEL SECURITY;

-- Função helper para verificar se é admin (se não existir)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função helper para obter perfil do usuário (se não existir)
CREATE OR REPLACE FUNCTION get_user_perfil()
RETURNS VARCHAR AS $$
BEGIN
  RETURN (
    SELECT perfil FROM user_profiles
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- POLÍTICAS RLS: wellness_portals
-- ============================================

-- Remover políticas se existirem antes de criar
DROP POLICY IF EXISTS "Users can view their own portals" ON wellness_portals;
DROP POLICY IF EXISTS "Users can create their own portals" ON wellness_portals;
DROP POLICY IF EXISTS "Users can update their own portals" ON wellness_portals;
DROP POLICY IF EXISTS "Users can delete their own portals" ON wellness_portals;
DROP POLICY IF EXISTS "Admins can view all portals" ON wellness_portals;
DROP POLICY IF EXISTS "Public can view active portals" ON wellness_portals;

-- SELECT: Usuários veem apenas seus próprios portais OU portais ativos (públicos) OU se for admin
CREATE POLICY "Users can view their own portals" ON wellness_portals
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR status = 'active' 
    OR is_admin()
  );

-- INSERT: Usuários wellness podem criar portais
CREATE POLICY "Users can create their own portals" ON wellness_portals
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND (
      get_user_perfil() = 'wellness' 
      OR is_admin()
    )
  );

-- UPDATE: Usuários podem atualizar apenas seus próprios portais OU se for admin
CREATE POLICY "Users can update their own portals" ON wellness_portals
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR is_admin()
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR is_admin()
  );

-- DELETE: Usuários podem deletar apenas seus próprios portais OU se for admin
CREATE POLICY "Users can delete their own portals" ON wellness_portals
  FOR DELETE
  USING (
    auth.uid() = user_id 
    OR is_admin()
  );

-- ============================================
-- POLÍTICAS RLS: portal_tools
-- ============================================

-- Remover políticas se existirem antes de criar
DROP POLICY IF EXISTS "Users can view tools of their portals" ON portal_tools;
DROP POLICY IF EXISTS "Users can add tools to their portals" ON portal_tools;
DROP POLICY IF EXISTS "Users can update tools of their portals" ON portal_tools;
DROP POLICY IF EXISTS "Users can delete tools from their portals" ON portal_tools;
DROP POLICY IF EXISTS "Public can view tools of active portals" ON portal_tools;

-- SELECT: Usuários veem ferramentas de seus portais OU portais ativos (públicos) OU se for admin
CREATE POLICY "Users can view tools of their portals" ON portal_tools
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wellness_portals
      WHERE wellness_portals.id = portal_tools.portal_id
      AND (
        wellness_portals.user_id = auth.uid()
        OR wellness_portals.status = 'active'
        OR is_admin()
      )
    )
  );

-- INSERT: Usuários podem adicionar ferramentas aos seus portais
CREATE POLICY "Users can add tools to their portals" ON portal_tools
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wellness_portals
      WHERE wellness_portals.id = portal_tools.portal_id
      AND wellness_portals.user_id = auth.uid()
    )
    OR is_admin()
  );

-- UPDATE: Usuários podem atualizar ferramentas de seus portais
CREATE POLICY "Users can update tools of their portals" ON portal_tools
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM wellness_portals
      WHERE wellness_portals.id = portal_tools.portal_id
      AND wellness_portals.user_id = auth.uid()
    )
    OR is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wellness_portals
      WHERE wellness_portals.id = portal_tools.portal_id
      AND wellness_portals.user_id = auth.uid()
    )
    OR is_admin()
  );

-- DELETE: Usuários podem remover ferramentas de seus portais
CREATE POLICY "Users can delete tools from their portals" ON portal_tools
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM wellness_portals
      WHERE wellness_portals.id = portal_tools.portal_id
      AND wellness_portals.user_id = auth.uid()
    )
    OR is_admin()
  );

-- ============================================
-- COMENTÁRIOS NAS TABELAS E COLUNAS
-- ============================================

COMMENT ON TABLE wellness_portals IS 'Portais de bem-estar criados pelos usuários Wellness';
COMMENT ON TABLE portal_tools IS 'Relacionamento entre portais e ferramentas (user_templates)';

COMMENT ON COLUMN wellness_portals.navigation_type IS 'Tipo de navegação: menu (usuário escolhe) ou sequential (ordem fixa)';
COMMENT ON COLUMN wellness_portals.custom_colors IS 'Cores personalizadas do portal em formato JSON: {"primary": "#hex", "secondary": "#hex"}';
COMMENT ON COLUMN wellness_portals.tools_order IS 'Array de IDs de ferramentas na ordem desejada (para navegação sequencial)';
COMMENT ON COLUMN portal_tools.position IS 'Posição/ordem da ferramenta no portal (1 = primeira)';
COMMENT ON COLUMN portal_tools.redirect_to_tool_id IS 'ID da ferramenta para redirecionar após conclusão desta (opcional)';

-- ============================================
-- FIM DO SCHEMA
-- ============================================

