-- =====================================================
-- FIX: Corrigir políticas de storage para upload de logos
-- =====================================================

-- 1. Deletar todas as políticas antigas
DROP POLICY IF EXISTS "Nutris podem fazer upload de logos" ON storage.objects;
DROP POLICY IF EXISTS "Logos são públicos" ON storage.objects;
DROP POLICY IF EXISTS "Nutris podem gerenciar seus logos" ON storage.objects;

-- 2. Criar política PERMISSIVA para INSERT (qualquer usuário autenticado)
CREATE POLICY "Upload de logos - autenticados"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'nutri-logos'
);

-- 3. Criar política para SELECT (público)
CREATE POLICY "Logos públicos - leitura"
ON storage.objects
FOR SELECT
TO public
USING (
    bucket_id = 'nutri-logos'
);

-- 4. Criar política para UPDATE (dono do arquivo)
CREATE POLICY "Atualizar próprio logo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'nutri-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'nutri-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Criar política para DELETE (dono do arquivo)
CREATE POLICY "Deletar próprio logo"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'nutri-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Verificar se bucket existe e é público
DO $$
BEGIN
    -- Atualizar bucket para ser público se já existir
    UPDATE storage.buckets
    SET public = true
    WHERE id = 'nutri-logos';
    
    -- Se não existir, criar
    IF NOT FOUND THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('nutri-logos', 'nutri-logos', true)
        ON CONFLICT (id) DO NOTHING;
    END IF;
    
    RAISE NOTICE '✅ Políticas de storage corrigidas!';
    RAISE NOTICE '✅ Bucket nutri-logos configurado como público';
END $$;

-- 7. Verificar políticas criadas
SELECT 
    policyname as "Política",
    cmd as "Operação",
    roles as "Roles"
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%logo%'
ORDER BY policyname;
