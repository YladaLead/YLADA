-- ============================================
-- MIGRATION 033: Criar Tabela para Interações NOEL Sales Support
-- ============================================
-- Tabela específica para interações do NOEL na página de vendas
-- Permite user_id NULL (público) e armazena email quando disponível
-- ============================================

CREATE TABLE IF NOT EXISTS noel_sales_support_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação (pode ser público, sem user_id)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  
  -- Mensagens
  user_message TEXT NOT NULL,
  noel_response TEXT NOT NULL,
  
  -- Contexto
  module TEXT DEFAULT 'sales-support',
  source TEXT DEFAULT 'sales-support',
  
  -- Aprendizado
  needs_learning BOOLEAN DEFAULT false,
  unanswered BOOLEAN DEFAULT false,
  
  -- Metadados
  conversation_history JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_noel_sales_support_created_at 
ON noel_sales_support_interactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_noel_sales_support_needs_learning 
ON noel_sales_support_interactions(needs_learning) 
WHERE needs_learning = true;

CREATE INDEX IF NOT EXISTS idx_noel_sales_support_unanswered 
ON noel_sales_support_interactions(unanswered) 
WHERE unanswered = true;

CREATE INDEX IF NOT EXISTS idx_noel_sales_support_user_email 
ON noel_sales_support_interactions(user_email) 
WHERE user_email IS NOT NULL;

-- Comentários
COMMENT ON TABLE noel_sales_support_interactions IS 'Interações do NOEL na página de vendas (público, sem autenticação)';
COMMENT ON COLUMN noel_sales_support_interactions.user_id IS 'ID do usuário se estiver logado, NULL se público';
COMMENT ON COLUMN noel_sales_support_interactions.user_email IS 'Email do usuário (quando fornecido)';
COMMENT ON COLUMN noel_sales_support_interactions.needs_learning IS 'Se a interação precisa ser revisada para aprendizado';
COMMENT ON COLUMN noel_sales_support_interactions.unanswered IS 'Se o NOEL não soube responder adequadamente';

-- Habilitar RLS
ALTER TABLE noel_sales_support_interactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Apenas admins podem ver todas as interações
DROP POLICY IF EXISTS "Admins can view all sales support interactions" ON noel_sales_support_interactions;
CREATE POLICY "Admins can view all sales support interactions"
  ON noel_sales_support_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND (is_admin = TRUE OR perfil = 'admin')
    )
  );

-- Sistema pode inserir (via service role)
DROP POLICY IF EXISTS "Service role can insert sales support interactions" ON noel_sales_support_interactions;
CREATE POLICY "Service role can insert sales support interactions"
  ON noel_sales_support_interactions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Admins podem gerenciar
DROP POLICY IF EXISTS "Admins can manage sales support interactions" ON noel_sales_support_interactions;
CREATE POLICY "Admins can manage sales support interactions"
  ON noel_sales_support_interactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND (is_admin = TRUE OR perfil = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND (is_admin = TRUE OR perfil = 'admin')
    )
  );
