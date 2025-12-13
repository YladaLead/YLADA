-- =====================================================
-- CRIAR BUCKET PARA ASSETS PÚBLICOS DE LANDING PAGES
-- Migração 032: Configurar storage para vídeos e imagens de landing pages
-- =====================================================
--
-- ⚠️ IMPORTANTE: Antes de fazer upload de arquivos maiores que 50MB,
-- você precisa aumentar o limite global de upload do Supabase:
--
-- 1. Acesse: Supabase Dashboard → Storage → Settings
-- 2. Encontre "File size upload limit"
-- 3. Aumente para pelo menos 150MB (ou mais se necessário)
-- 4. Salve as alterações
--
-- Sem isso, uploads acima de 50MB falharão mesmo que o bucket
-- tenha um limite maior configurado.
-- =====================================================

-- Criar bucket landing-pages-assets (PÚBLICO)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'landing-pages-assets',
  'landing-pages-assets',
  true, -- Público para acesso direto sem autenticação
  157286400, -- 150MB limite (para vídeos maiores)
  ARRAY[
    'video/mp4',
    'video/mpeg',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 157286400,
  allowed_mime_types = ARRAY[
    'video/mp4',
    'video/mpeg',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

-- =====================================================
-- POLÍTICAS DE ACESSO
-- =====================================================
-- Como o bucket é público, não precisamos de políticas de SELECT
-- Mas precisamos de políticas para INSERT/UPDATE/DELETE

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Admins podem fazer upload landing pages" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar landing pages" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar landing pages" ON storage.objects;

-- Política: Permitir upload para admins
CREATE POLICY "Admins podem fazer upload landing pages"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'landing-pages-assets' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND is_admin = true
  )
);

-- Política: Permitir atualização para admins
CREATE POLICY "Admins podem atualizar landing pages"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'landing-pages-assets' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND is_admin = true
  )
);

-- Política: Permitir delete apenas para admins
CREATE POLICY "Admins podem deletar landing pages"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'landing-pages-assets' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND is_admin = true
  )
);

-- =====================================================
-- NOTA: Como o bucket é público, qualquer pessoa pode
-- fazer SELECT (ler) os arquivos sem autenticação.
-- Isso é intencional para assets de landing pages.
-- =====================================================
