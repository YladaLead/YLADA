-- ============================================
-- CORREÇÃO: Políticas de Storage para usar user_profiles.is_admin
-- Descrição: Atualiza as políticas para verificar is_admin na tabela user_profiles
-- Data: 2024
-- ============================================

-- ============================================
-- REMOVER POLÍTICAS ANTIGAS
-- ============================================

-- Thumbnails
DROP POLICY IF EXISTS "Apenas admins podem fazer upload de thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem atualizar thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem deletar thumbnails" ON storage.objects;

-- PDFs
DROP POLICY IF EXISTS "Apenas admins podem fazer upload de PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem atualizar PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem deletar PDFs" ON storage.objects;

-- Vídeos
DROP POLICY IF EXISTS "Apenas admins podem fazer upload de vídeos" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem atualizar vídeos" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins podem deletar vídeos" ON storage.objects;

-- ============================================
-- CRIAR POLÍTICAS CORRIGIDAS
-- ============================================

-- ============================================
-- BUCKET: wellness-cursos-thumbnails
-- ============================================

-- Política: Apenas admins podem fazer upload (INSERT) de thumbnails
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

-- Política: Apenas admins podem atualizar (UPDATE) thumbnails
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

-- Política: Apenas admins podem deletar (DELETE) thumbnails
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
-- BUCKET: wellness-cursos-pdfs
-- ============================================

-- Política: Apenas admins podem fazer upload (INSERT) de PDFs
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

-- Política: Apenas admins podem atualizar (UPDATE) PDFs
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

-- Política: Apenas admins podem deletar (DELETE) PDFs
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
-- BUCKET: wellness-cursos-videos
-- ============================================

-- Política: Apenas admins podem fazer upload (INSERT) de vídeos
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

-- Política: Apenas admins podem atualizar (UPDATE) vídeos
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

-- Política: Apenas admins podem deletar (DELETE) vídeos
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
-- NOTAS
-- ============================================
-- As políticas agora verificam user_profiles.is_admin em vez de 
-- auth.users.raw_user_meta_data->>'role' = 'admin'
-- Isso está alinhado com o resto do sistema que usa user_profiles.is_admin


