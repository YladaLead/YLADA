-- =====================================================
-- YLADA COACH - TABELA DE DOCUMENTOS DOS CLIENTES
-- Armazena exames, documentos e imagens enviados pelos clientes
-- =====================================================

-- Tabela de documentos dos clientes
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Coach
  
  -- Informações do arquivo
  file_url TEXT NOT NULL, -- URL do arquivo no Supabase Storage
  file_name VARCHAR(255) NOT NULL, -- Nome original do arquivo
  file_size INTEGER, -- Tamanho em bytes
  file_type VARCHAR(100), -- MIME type (ex: image/jpeg, application/pdf)
  file_extension VARCHAR(10), -- Extensão do arquivo (ex: jpg, pdf)
  
  -- Categorização
  document_type VARCHAR(50) DEFAULT 'outro', -- 'exame', 'documento', 'receita', 'atestado', 'imagem', 'outro'
  category VARCHAR(100), -- Categoria personalizada (ex: 'sangue', 'urina', 'raio-x')
  description TEXT, -- Descrição opcional do documento
  
  -- Metadados
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_document_type ON client_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_client_documents_uploaded_at ON client_documents(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_documents_deleted_at ON client_documents(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE client_documents IS 'Armazena documentos, exames e imagens enviados pelos clientes para o Coach';
COMMENT ON COLUMN client_documents.file_url IS 'URL completa do arquivo no Supabase Storage';
COMMENT ON COLUMN client_documents.document_type IS 'Tipo de documento: exame, documento, receita, atestado, imagem, outro';
COMMENT ON COLUMN client_documents.category IS 'Categoria personalizada para organização (ex: sangue, urina, raio-x)';

