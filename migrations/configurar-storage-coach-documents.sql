-- =====================================================
-- YLADA COACH - CONFIGURAÇÃO DO STORAGE PARA DOCUMENTOS
-- Configura políticas RLS para o bucket coach-documents
-- =====================================================

-- IMPORTANTE: Execute este script APÓS criar o bucket 'coach-documents' no Supabase Dashboard
-- Storage > New bucket > Name: coach-documents > Public: ✅

-- =====================================================
-- 1. POLÍTICAS DE UPLOAD (INSERT)
-- =====================================================

-- Permitir que coaches autenticados façam upload
CREATE POLICY IF NOT EXISTS "Coaches podem fazer upload de documentos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'coach-documents' AND
  (storage.foldername(name))[1] = 'coach' AND
  (storage.foldername(name))[2] = 'client-documents'
);

-- =====================================================
-- 2. POLÍTICAS DE LEITURA (SELECT)
-- =====================================================

-- Permitir leitura pública (para visualização dos documentos)
CREATE POLICY IF NOT EXISTS "Documentos são públicos para leitura"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'coach-documents');

-- =====================================================
-- 3. POLÍTICAS DE EXCLUSÃO (DELETE)
-- =====================================================

-- Permitir que coaches autenticados deletem documentos
CREATE POLICY IF NOT EXISTS "Coaches podem deletar seus documentos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'coach-documents' AND
  (storage.foldername(name))[1] = 'coach' AND
  (storage.foldername(name))[2] = 'client-documents'
);

-- =====================================================
-- 4. POLÍTICAS DE ATUALIZAÇÃO (UPDATE) - Opcional
-- =====================================================

-- Se quiser permitir atualização de metadados dos arquivos
-- (geralmente não necessário, mas pode ser útil)
-- CREATE POLICY IF NOT EXISTS "Coaches podem atualizar metadados"
-- ON storage.objects
-- FOR UPDATE
-- TO authenticated
-- USING (
--   bucket_id = 'coach-documents' AND
--   (storage.foldername(name))[1] = 'coach' AND
--   (storage.foldername(name))[2] = 'client-documents'
-- );

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
WHERE name = 'coach-documents';

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
  AND policyname LIKE '%coach%document%';

