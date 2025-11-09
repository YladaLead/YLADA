-- ============================================
-- CORREÇÃO: Apenas Políticas de Storage
-- Descrição: Atualiza políticas para usar user_profiles.is_admin
-- Execute este script se os buckets já estão criados
-- ============================================

-- ============================================
-- REMOVER TODAS AS POLÍTICAS ANTIGAS
-- ============================================

DROP POLICY IF EXISTS "Thumbnails são públicos para leitura" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem fazer upload de thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem atualizar thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem deletar thumbnails" ON storage.objects;

DROP POLICY IF EXISTS "Usuários autenticados podem ler PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem fazer upload de PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem atualizar PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem deletar PDFs" ON storage.objects;

DROP POLICY IF EXISTS "Usuários autenticados podem ler vídeos" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem fazer upload de vídeos" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem atualizar vídeos" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem deletar vídeos" ON storage.objects;

-- ============================================
-- CRIAR POLÍTICAS CORRIGIDAS
-- ============================================

-- ============================================
-- BUCKET: wellness-cursos-thumbnails (PÚBLICO)
-- ============================================

-- SELECT: Público (qualquer um pode ler)
CREATE POLICY "Thumbnails são públicos para leitura"
ON storage.objects FOR SELECT
USING (bucket_id = 'wellness-cursos-thumbnails');

-- INSERT: Apenas admins
CREATE POLICY "Apenas admins podem fazer upload de thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wellness-cursos-thumbnails' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- UPDATE: Apenas admins
CREATE POLICY "Apenas admins podem atualizar thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wellness-cursos-thumbnails' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- DELETE: Apenas admins
CREATE POLICY "Apenas admins podem deletar thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wellness-cursos-thumbnails' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- ============================================
-- BUCKET: wellness-cursos-pdfs (PRIVADO)
-- ============================================

-- SELECT: Apenas autenticados
CREATE POLICY "Usuários autenticados podem ler PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wellness-cursos-pdfs' AND
  auth.role() = 'authenticated'
);

-- INSERT: Apenas admins
CREATE POLICY "Apenas admins podem fazer upload de PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wellness-cursos-pdfs' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- UPDATE: Apenas admins
CREATE POLICY "Apenas admins podem atualizar PDFs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wellness-cursos-pdfs' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- DELETE: Apenas admins
CREATE POLICY "Apenas admins podem deletar PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wellness-cursos-pdfs' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- ============================================
-- BUCKET: wellness-cursos-videos (PRIVADO)
-- ============================================

-- SELECT: Apenas autenticados
CREATE POLICY "Usuários autenticados podem ler vídeos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wellness-cursos-videos' AND
  auth.role() = 'authenticated'
);

-- INSERT: Apenas admins
CREATE POLICY "Apenas admins podem fazer upload de vídeos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wellness-cursos-videos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- UPDATE: Apenas admins
CREATE POLICY "Apenas admins podem atualizar vídeos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wellness-cursos-videos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- DELETE: Apenas admins
CREATE POLICY "Apenas admins podem deletar vídeos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wellness-cursos-videos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Verificar políticas criadas
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'SELECT' THEN 'Leitura'
    WHEN cmd = 'INSERT' THEN 'Upload'
    WHEN cmd = 'UPDATE' THEN 'Atualização'
    WHEN cmd = 'DELETE' THEN 'Exclusão'
  END as operacao
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%wellness%'
ORDER BY policyname;


