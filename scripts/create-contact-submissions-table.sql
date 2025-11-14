-- =====================================================
-- CRIAR TABELA: contact_submissions
-- Armazena submissões do formulário de contato
-- =====================================================

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  profissao VARCHAR(255),
  pais VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_nome ON contact_submissions(nome);

-- Comentários nas colunas
COMMENT ON TABLE contact_submissions IS 'Armazena submissões do formulário de contato da página inicial';
COMMENT ON COLUMN contact_submissions.nome IS 'Nome completo do contato';
COMMENT ON COLUMN contact_submissions.profissao IS 'Profissão do contato (opcional)';
COMMENT ON COLUMN contact_submissions.pais IS 'País do contato (opcional)';
COMMENT ON COLUMN contact_submissions.email IS 'E-mail do contato (obrigatório)';
COMMENT ON COLUMN contact_submissions.telefone IS 'Telefone do contato (opcional, apenas números)';
COMMENT ON COLUMN contact_submissions.ip_address IS 'Endereço IP de onde veio a submissão';
COMMENT ON COLUMN contact_submissions.user_agent IS 'User Agent do navegador';

-- Habilitar RLS (Row Level Security) se necessário
-- ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Política de segurança (opcional - ajustar conforme necessário)
-- CREATE POLICY "Admin can view all submissions" ON contact_submissions
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM user_profiles
--       WHERE user_profiles.user_id = auth.uid()
--       AND user_profiles.is_admin = true
--     )
--   );

-- Verificar se a tabela foi criada
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'contact_submissions'
ORDER BY ordinal_position;

