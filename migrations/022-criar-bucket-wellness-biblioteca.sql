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

-- Política: Permitir upload apenas para admins
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins podem fazer upload'
  ) THEN
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
  END IF;
END $$;

-- Política: Permitir leitura para usuários wellness autenticados
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Wellness users podem ler'
  ) THEN
    CREATE POLICY "Wellness users podem ler"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'wellness-biblioteca' AND
      (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_id = auth.uid()
          AND profile_type IN ('wellness', 'admin')
        )
      )
    );
  END IF;
END $$;

-- Política: Permitir delete apenas para admins
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins podem deletar'
  ) THEN
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
  END IF;
END $$;

-- Comentários
COMMENT ON POLICY "Admins podem fazer upload" ON storage.objects IS 'Permite que apenas admins façam upload de materiais na biblioteca';
COMMENT ON POLICY "Wellness users podem ler" ON storage.objects IS 'Permite que usuários wellness leiam materiais da biblioteca';
COMMENT ON POLICY "Admins podem deletar" ON storage.objects IS 'Permite que apenas admins deletem materiais da biblioteca';
