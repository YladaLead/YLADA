-- ============================================
-- VERIFICAÇÃO: Buckets de Storage
-- Descrição: Verifica se os buckets existem e suas configurações
-- ============================================

-- Verificar se os buckets existem
SELECT 
  id,
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

-- Se os buckets não existirem, criar:
-- (Execute no Supabase Dashboard > Storage > Create Bucket)

-- ============================================
-- CRIAR BUCKETS (se não existirem)
-- ============================================

-- Bucket para PDFs e Imagens (PRIVADO)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'wellness-cursos-pdfs',
--   'wellness-cursos-pdfs',
--   false,
--   52428800, -- 50MB em bytes
--   ARRAY['application/pdf', 'application/x-pdf', 'image/jpeg', 'image/jpg', 'image/png']
-- );

-- Bucket para Vídeos (PRIVADO)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'wellness-cursos-videos',
--   'wellness-cursos-videos',
--   false,
--   104857600, -- 100MB em bytes
--   ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
-- );

-- Bucket para Thumbnails (PÚBLICO)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'wellness-cursos-thumbnails',
--   'wellness-cursos-thumbnails',
--   true,
--   5242880, -- 5MB em bytes
--   ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
-- );

-- ============================================
-- ATUALIZAR LIMITES DE TAMANHO (se necessário)
-- ============================================

-- Atualizar limite do bucket de PDFs para 50MB
-- UPDATE storage.buckets
-- SET file_size_limit = 52428800 -- 50MB
-- WHERE name = 'wellness-cursos-pdfs';

-- Atualizar tipos MIME permitidos para incluir imagens
-- UPDATE storage.buckets
-- SET allowed_mime_types = ARRAY[
--   'application/pdf', 
--   'application/x-pdf', 
--   'image/jpeg', 
--   'image/jpg', 
--   'image/png'
-- ]
-- WHERE name = 'wellness-cursos-pdfs';

-- ============================================
-- VERIFICAR POLÍTICAS DE STORAGE
-- ============================================

SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%wellness%'
ORDER BY policyname;

