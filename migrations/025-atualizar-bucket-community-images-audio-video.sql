-- =====================================================
-- YLADA - ATUALIZAR BUCKET COMMUNITY-IMAGES PARA ÁUDIO/VÍDEO
-- =====================================================
-- Este script atualiza o bucket community-images para aceitar
-- arquivos de áudio e vídeo além de imagens

-- Atualizar bucket para aceitar áudio e vídeo
UPDATE storage.buckets
SET 
  file_size_limit = 10485760, -- 10MB (para vídeos)
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
  ]
WHERE id = 'community-images';

-- Se o bucket não existir, criar
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-images',
  'community-images',
  true,
  10485760, -- 10MB
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
ON CONFLICT (id) DO NOTHING;
