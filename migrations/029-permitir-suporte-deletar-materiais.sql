-- =====================================================
-- PERMITIR SUPORTE DELETAR MATERIAIS
-- Migração 029: Atualizar políticas para suporte poder deletar
-- =====================================================

BEGIN;

-- Remover política antiga de delete (apenas admins)
DROP POLICY IF EXISTS "Admins podem deletar" ON storage.objects;

-- Nova política: Permitir delete para admins E suporte
CREATE POLICY "Admins e Suporte podem deletar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'wellness-biblioteca' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND (is_admin = true OR is_support = true)
  )
);

COMMENT ON POLICY "Admins e Suporte podem deletar" ON storage.objects IS 
'Permite que administradores e equipe de suporte deletem arquivos do bucket wellness-biblioteca';

COMMIT;
