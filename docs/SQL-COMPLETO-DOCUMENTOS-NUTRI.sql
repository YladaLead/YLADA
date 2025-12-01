-- =====================================================
-- YLADA NUTRI - SQL COMPLETO PARA DOCUMENTOS
-- Execute este script completo no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PARTE 1: CRIAR TABELA (se ainda não existe)
-- =====================================================

CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(50) NOT NULL,
  file_extension VARCHAR(10),
  document_type VARCHAR(50) NOT NULL DEFAULT 'outro',
  category VARCHAR(100),
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_document_type ON client_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_client_documents_deleted_at ON client_documents(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE client_documents IS 'Armazena documentos e arquivos relacionados aos clientes (Coach e Nutri).';
COMMENT ON COLUMN client_documents.client_id IS 'ID do cliente ao qual o documento pertence.';
COMMENT ON COLUMN client_documents.user_id IS 'ID do profissional (Coach/Nutri) que fez o upload do documento.';
COMMENT ON COLUMN client_documents.file_url IS 'URL do arquivo no Supabase Storage.';
COMMENT ON COLUMN client_documents.file_name IS 'Nome original do arquivo.';
COMMENT ON COLUMN client_documents.document_type IS 'Tipo do documento (ex: exame, documento, receita, atestado, imagem, outro).';
COMMENT ON COLUMN client_documents.deleted_at IS 'Data de exclusão (soft delete).';

-- =====================================================
-- PARTE 2: CONFIGURAR POLÍTICAS RLS DO STORAGE
-- IMPORTANTE: Crie o bucket 'nutri-documents' no Dashboard primeiro!
-- =====================================================

-- 1. POLÍTICA DE UPLOAD (INSERT)
DROP POLICY IF EXISTS "Nutricionistas podem fazer upload de documentos" ON storage.objects;

CREATE POLICY "Nutricionistas podem fazer upload de documentos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'nutri-documents' AND
  (storage.foldername(name))[1] = 'nutri' AND
  (storage.foldername(name))[2] = 'client-documents'
);

-- 2. POLÍTICA DE LEITURA (SELECT) - PÚBLICA
DROP POLICY IF EXISTS "Documentos Nutri são públicos para leitura" ON storage.objects;

CREATE POLICY "Documentos Nutri são públicos para leitura"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'nutri-documents');

-- 3. POLÍTICA DE EXCLUSÃO (DELETE)
DROP POLICY IF EXISTS "Nutricionistas podem deletar seus documentos" ON storage.objects;

CREATE POLICY "Nutricionistas podem deletar seus documentos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'nutri-documents' AND
  (storage.foldername(name))[1] = 'nutri' AND
  (storage.foldername(name))[2] = 'client-documents'
);

-- =====================================================
-- PARTE 3: VERIFICAÇÃO (OPCIONAL)
-- =====================================================

-- Verificar se a tabela foi criada
SELECT 
  'Tabela client_documents criada' AS status,
  COUNT(*) AS total_documentos
FROM client_documents;

-- Verificar se o bucket existe (execute no Dashboard ou via API)
-- SELECT name, id, public, file_size_limit
-- FROM storage.buckets
-- WHERE name = 'nutri-documents';

-- Verificar políticas criadas
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%nutri%document%'
ORDER BY policyname;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
-- 
-- PRÓXIMOS PASSOS:
-- 1. ✅ Execute este script no Supabase SQL Editor
-- 2. ⚠️ Crie o bucket 'nutri-documents' no Dashboard (Storage > New bucket)
-- 3. ✅ Teste fazendo upload de um documento em /pt/nutri/clientes/[id] > Tab Documentos
-- =====================================================

