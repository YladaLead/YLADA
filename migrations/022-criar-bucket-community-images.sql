-- =====================================================
-- YLADA - BUCKET PARA IMAGENS DA COMUNIDADE
-- =====================================================

-- NOTA: Este SQL deve ser executado no Supabase SQL Editor
-- O bucket também precisa ser criado manualmente no Storage

-- 1. Criar bucket (execute no SQL Editor do Supabase)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-images',
  'community-images',
  true, -- Público para permitir acesso às imagens
  10485760, -- 10MB limite (para vídeos)
  ARRAY[
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/gif', 
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'audio/webm',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/x-m4a'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/gif', 
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'audio/webm',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/x-m4a'
  ];

-- 2. Política: Qualquer usuário autenticado pode fazer upload
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'community-images' AND
  (storage.foldername(name))[1] = 'community'
);

-- 3. Política: Qualquer usuário pode ver imagens (público)
DROP POLICY IF EXISTS "Imagens são públicas" ON storage.objects;
CREATE POLICY "Imagens são públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'community-images');

-- 4. Política: Usuários podem deletar apenas suas próprias imagens
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias imagens" ON storage.objects;
CREATE POLICY "Usuários podem deletar suas próprias imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'community-images' AND
  (storage.foldername(name))[1] = 'community' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- =====================================================
-- INSTRUÇÕES MANUAIS:
-- =====================================================
-- 
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em Storage
-- 3. Clique em "New bucket"
-- 4. Configure:
--    - Name: community-images
--    - Public bucket: ✅ (marcado)
--    - File size limit: 5MB
--    - Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp
-- 5. Clique em "Create bucket"
-- 
-- Depois execute este SQL para criar as políticas de acesso
-- =====================================================
