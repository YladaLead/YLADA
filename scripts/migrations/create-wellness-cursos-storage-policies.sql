-- ============================================
-- POLÍTICAS DE STORAGE: Cursos Wellness
-- Descrição: Políticas de acesso para os buckets de cursos wellness
-- Data: 2024
-- ============================================

-- ============================================
-- BUCKET: wellness-cursos-thumbnails (PÚBLICO)
-- ============================================

-- Política: Qualquer pessoa pode ler (SELECT) thumbnails
CREATE POLICY "Thumbnails são públicos para leitura"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wellness-cursos-thumbnails'
);

-- Política: Apenas admins podem fazer upload (INSERT) de thumbnails
CREATE POLICY "Apenas admins podem fazer upload de thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wellness-cursos-thumbnails' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Apenas admins podem atualizar (UPDATE) thumbnails
CREATE POLICY "Apenas admins podem atualizar thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wellness-cursos-thumbnails' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Apenas admins podem deletar (DELETE) thumbnails
CREATE POLICY "Apenas admins podem deletar thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wellness-cursos-thumbnails' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- BUCKET: wellness-cursos-pdfs (PRIVADO)
-- ============================================

-- Política: Apenas usuários autenticados podem ler (SELECT) PDFs
CREATE POLICY "Usuários autenticados podem ler PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wellness-cursos-pdfs' AND
  auth.role() = 'authenticated'
);

-- Política: Apenas admins podem fazer upload (INSERT) de PDFs
CREATE POLICY "Apenas admins podem fazer upload de PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wellness-cursos-pdfs' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Apenas admins podem atualizar (UPDATE) PDFs
CREATE POLICY "Apenas admins podem atualizar PDFs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wellness-cursos-pdfs' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Apenas admins podem deletar (DELETE) PDFs
CREATE POLICY "Apenas admins podem deletar PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wellness-cursos-pdfs' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- BUCKET: wellness-cursos-videos (PRIVADO)
-- ============================================

-- Política: Apenas usuários autenticados podem ler (SELECT) vídeos
CREATE POLICY "Usuários autenticados podem ler vídeos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wellness-cursos-videos' AND
  auth.role() = 'authenticated'
);

-- Política: Apenas admins podem fazer upload (INSERT) de vídeos
CREATE POLICY "Apenas admins podem fazer upload de vídeos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wellness-cursos-videos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Apenas admins podem atualizar (UPDATE) vídeos
CREATE POLICY "Apenas admins podem atualizar vídeos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wellness-cursos-videos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Apenas admins podem deletar (DELETE) vídeos
CREATE POLICY "Apenas admins podem deletar vídeos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wellness-cursos-videos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. Certifique-se de que os buckets foram criados antes de executar este script
-- 2. As políticas verificam se o usuário tem role='admin' no metadata
-- 3. Para thumbnails: leitura pública, upload apenas admins
-- 4. Para PDFs e vídeos: leitura apenas autenticados, upload apenas admins
-- 5. Se precisar ajustar as políticas, você pode usar DROP POLICY e recriar

-- ============================================
-- COMANDOS ÚTEIS PARA GERENCIAR POLÍTICAS
-- ============================================

-- Listar todas as políticas de storage:
-- SELECT * FROM pg_policies WHERE schemaname = 'storage';

-- Deletar uma política específica (exemplo):
-- DROP POLICY "Nome da política" ON storage.objects;

