-- =====================================================
-- CRIAR BUCKET E POLÍTICAS PARA BIBLIOTECA WELLNESS
-- Migração 022: Configurar storage para upload de materiais
-- =====================================================

-- Criar bucket wellness-biblioteca
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wellness-biblioteca',
  'wellness-biblioteca',
  true, -- Público para acesso direto
  104857600, -- 100MB limite
  ARRAY[
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- IMPORTANTE: As políticas de storage precisam ser criadas
-- via Supabase Dashboard ou com permissões de superuser
-- =====================================================
-- 
-- Após executar este script, crie as políticas manualmente:
-- 
-- 1. Acesse: Supabase Dashboard → Storage → Policies
-- 2. Selecione o bucket: wellness-biblioteca
-- 3. Clique em "New Policy"
-- 
-- OU execute o script abaixo separadamente (se tiver permissões):
--

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Admins podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Wellness users podem ler" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar" ON storage.objects;

-- Política: Permitir upload apenas para admins
CREATE POLICY "Admins podem fazer upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'wellness-biblioteca' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND profile_type = 'admin'
  )
);

-- Política: Permitir leitura para usuários wellness autenticados
CREATE POLICY "Wellness users podem ler"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'wellness-biblioteca' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND profile_type IN ('wellness', 'admin')
  )
);

-- Política: Permitir delete apenas para admins
CREATE POLICY "Admins podem deletar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'wellness-biblioteca' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND profile_type = 'admin'
  )
);
