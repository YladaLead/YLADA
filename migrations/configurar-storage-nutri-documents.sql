-- =====================================================
-- YLADA NUTRI - CONFIGURAÇÃO DO STORAGE PARA DOCUMENTOS
-- Configura políticas RLS para o bucket nutri-documents
-- =====================================================

-- IMPORTANTE: Execute este script APÓS criar o bucket 'nutri-documents' no Supabase Dashboard
-- Storage > New bucket > Name: nutri-documents > Public: ✅

-- =====================================================
-- 1. POLÍTICAS DE UPLOAD (INSERT)
-- =====================================================

-- Permitir que nutricionistas autenticados façam upload
CREATE POLICY IF NOT EXISTS "Nutricionistas podem fazer upload de documentos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'nutri-documents' AND
  (storage.foldername(name))[1] = 'nutri' AND
  (storage.foldername(name))[2] = 'client-documents'
);

-- =====================================================
-- 2. POLÍTICAS DE LEITURA (SELECT)
-- =====================================================

-- Permitir leitura pública (para visualização dos documentos)
CREATE POLICY IF NOT EXISTS "Documentos Nutri são públicos para leitura"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'nutri-documents');

-- =====================================================
-- 3. POLÍTICAS DE EXCLUSÃO (DELETE)
-- =====================================================

-- Permitir que nutricionistas autenticados deletem documentos
CREATE POLICY IF NOT EXISTS "Nutricionistas podem deletar seus documentos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'nutri-documents' AND
  (storage.foldername(name))[1] = 'nutri' AND
  (storage.foldername(name))[2] = 'client-documents'
);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se o bucket existe
SELECT 
    name,
    id,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE name = 'nutri-documents';

-- Verificar políticas criadas
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%nutri%document%';

