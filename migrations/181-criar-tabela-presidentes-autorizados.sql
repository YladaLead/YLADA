-- ============================================
-- MIGRATION: Criar tabela presidentes_autorizados
-- Descrição: Lista de presidentes autorizados para trial
-- ============================================

CREATE TABLE IF NOT EXISTS presidentes_autorizados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Nome completo do presidente
  nome_completo TEXT NOT NULL,
  
  -- Email do presidente (opcional, para validação)
  email TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'ativo', -- 'ativo', 'inativo'
  
  -- Quem autorizou
  autorizado_por_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  autorizado_por_email TEXT,
  
  -- Observações
  observacoes TEXT,
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_presidentes_autorizados_nome ON presidentes_autorizados(LOWER(nome_completo));
CREATE INDEX IF NOT EXISTS idx_presidentes_autorizados_email ON presidentes_autorizados(email);
CREATE INDEX IF NOT EXISTS idx_presidentes_autorizados_status ON presidentes_autorizados(status);

-- RLS (Row Level Security)
ALTER TABLE presidentes_autorizados ENABLE ROW LEVEL SECURITY;

-- Política: Apenas admins podem ver todos os presidentes autorizados
CREATE POLICY "Admins can view all authorized presidents"
  ON presidentes_autorizados
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Política: Apenas admins podem inserir/atualizar
-- (Criação será feita via API com service role)

-- Comentários
COMMENT ON TABLE presidentes_autorizados IS 'Lista de presidentes autorizados para criar conta no ambiente de presidentes';
COMMENT ON COLUMN presidentes_autorizados.nome_completo IS 'Nome completo do presidente (usado para validação)';
COMMENT ON COLUMN presidentes_autorizados.email IS 'Email do presidente (opcional, para validação adicional)';
COMMENT ON COLUMN presidentes_autorizados.status IS 'Status: ativo (pode criar conta), inativo (não pode criar conta)';
