-- =====================================================
-- FIX FORÇADO: Desabilitar RLS e criar políticas permissivas
-- =====================================================

-- 1. REMOVER TODAS as políticas antigas
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname ILIKE '%logo%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- 2. DESABILITAR RLS temporariamente (para teste)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 3. Garantir que o bucket é público
UPDATE storage.buckets
SET public = true,
    file_size_limit = 2097152, -- 2MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
WHERE id = 'nutri-logos';

-- 4. REABILITAR RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas MUITO PERMISSIVAS
CREATE POLICY "nutri_logos_insert"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'nutri-logos');

CREATE POLICY "nutri_logos_select"
ON storage.objects
FOR SELECT
USING (bucket_id = 'nutri-logos');

CREATE POLICY "nutri_logos_update"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'nutri-logos')
WITH CHECK (bucket_id = 'nutri-logos');

CREATE POLICY "nutri_logos_delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'nutri-logos');

-- 6. Verificar
SELECT 
    '✅ Bucket configurado' as status,
    id,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'nutri-logos';

SELECT 
    '✅ Políticas criadas' as status,
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE 'nutri_logos%'
ORDER BY policyname;
