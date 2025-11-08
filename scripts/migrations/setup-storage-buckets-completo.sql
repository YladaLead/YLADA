-- ============================================
-- SETUP COMPLETO: Buckets de Storage para Cursos Wellness
-- Descrição: Cria ou atualiza buckets e políticas
-- ============================================

-- ============================================
-- 1. VERIFICAR BUCKETS EXISTENTES
-- ============================================
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE name IN (
  'wellness-cursos-pdfs',
  'wellness-cursos-videos',
  'wellness-cursos-thumbnails'
);

-- ============================================
-- 2. CRIAR BUCKETS (se não existirem)
-- ============================================

-- Bucket para PDFs e Imagens (PRIVADO)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wellness-cursos-pdfs',
  'wellness-cursos-pdfs',
  false,
  52428800, -- 50MB em bytes
  ARRAY[
    'application/pdf', 
    'application/x-pdf', 
    'image/jpeg', 
    'image/jpg', 
    'image/png'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'application/pdf', 
    'application/x-pdf', 
    'image/jpeg', 
    'image/jpg', 
    'image/png'
  ];

-- Bucket para Vídeos (PRIVADO)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wellness-cursos-videos',
  'wellness-cursos-videos',
  false,
  104857600, -- 100MB em bytes
  ARRAY[
    'video/mp4', 
    'video/webm', 
    'video/ogg', 
    'video/quicktime', 
    'video/x-msvideo', 
    'video/x-matroska'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY[
    'video/mp4', 
    'video/webm', 
    'video/ogg', 
    'video/quicktime', 
    'video/x-msvideo', 
    'video/x-matroska'
  ];

-- Bucket para Thumbnails (PÚBLICO)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wellness-cursos-thumbnails',
  'wellness-cursos-thumbnails',
  true,
  5242880, -- 5MB em bytes
  ARRAY[
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY[
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp'
  ];

-- ============================================
-- 3. REMOVER POLÍTICAS ANTIGAS (se existirem)
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
-- 4. CRIAR POLÍTICAS CORRIGIDAS
-- ============================================

-- ============================================
-- BUCKET: wellness-cursos-thumbnails (PÚBLICO)
-- ============================================

-- SELECT: Público
CREATE POLICY "Thumbnails são públicos para leitura"
ON storage.objects FOR SELECT
USING (bucket_id = 'wellness-cursos-thumbnails');

-- INSERT/UPDATE/DELETE: Apenas admins
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

-- INSERT/UPDATE/DELETE: Apenas admins
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

-- INSERT/UPDATE/DELETE: Apenas admins
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
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar buckets criados
SELECT 
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name IN (
  'wellness-cursos-pdfs',
  'wellness-cursos-videos',
  'wellness-cursos-thumbnails'
);

-- Verificar políticas criadas
SELECT 
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%wellness%'
ORDER BY policyname;

