-- =====================================================
-- PERMITIR SUPORTE DELETAR MATERIAIS
-- Migração 029: Atualizar políticas para suporte poder deletar
-- =====================================================
--
-- IMPORTANTE: As políticas de storage precisam ser criadas
-- manualmente via Supabase Dashboard devido a permissões.
-- Veja as instruções abaixo.
--

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '⚠️  CONFIGURAÇÃO MANUAL NECESSÁRIA';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'As políticas de storage precisam ser atualizadas manualmente.';
  RAISE NOTICE '';
  RAISE NOTICE '📋 PASSO A PASSO:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Acesse: https://supabase.com/dashboard';
  RAISE NOTICE '2. Vá em: Storage → Policies';
  RAISE NOTICE '3. Selecione o bucket: wellness-biblioteca';
  RAISE NOTICE '4. Encontre a política: "Admins podem deletar"';
  RAISE NOTICE '5. Clique em "Edit" (ou delete e crie nova)';
  RAISE NOTICE '';
  RAISE NOTICE '6. Substitua a política por:';
  RAISE NOTICE '';
  RAISE NOTICE '   Nome: "Admins e Suporte podem deletar"';
  RAISE NOTICE '   Target roles: authenticated';
  RAISE NOTICE '   Operation: DELETE';
  RAISE NOTICE '   USING expression:';
  RAISE NOTICE '';
  RAISE NOTICE '   bucket_id = ''wellness-biblioteca'' AND';
  RAISE NOTICE '   EXISTS (';
  RAISE NOTICE '     SELECT 1 FROM user_profiles';
  RAISE NOTICE '     WHERE user_id = auth.uid()';
  RAISE NOTICE '     AND (is_admin = true OR is_support = true)';
  RAISE NOTICE '   )';
  RAISE NOTICE '';
  RAISE NOTICE '7. Clique em "Save"';
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '✅ Após configurar, o suporte poderá deletar materiais!';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '';
END $$;

-- Tentar remover política antiga (pode falhar se não tiver permissão)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins podem deletar" ON storage.objects;
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE '⚠️  Não foi possível remover política automaticamente. Remova manualmente no Dashboard.';
  WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Erro ao remover política: %', SQLERRM;
END $$;

-- Tentar criar nova política (pode falhar se não tiver permissão)
DO $$
BEGIN
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
  
  RAISE NOTICE '✅ Política criada automaticamente com sucesso!';
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE '⚠️  Não foi possível criar política automaticamente. Siga as instruções acima.';
  WHEN duplicate_object THEN
    RAISE NOTICE '✅ Política já existe!';
  WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Erro ao criar política: %', SQLERRM;
    RAISE NOTICE '   Siga as instruções acima para criar manualmente.';
END $$;
