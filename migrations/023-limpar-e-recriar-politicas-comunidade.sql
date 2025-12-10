-- =====================================================
-- LIMPAR E RECRIAR POLÍTICAS RLS DA COMUNIDADE
-- Execute este script se houver conflito com políticas antigas
-- =====================================================

-- =====================================================
-- 1. REMOVER TODAS AS POLÍTICAS EXISTENTES
-- =====================================================

-- Remover políticas de community_posts
DROP POLICY IF EXISTS "Usuários autenticados podem ver posts públicos" ON community_posts;
DROP POLICY IF EXISTS "Usuários podem criar posts" ON community_posts;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios posts" ON community_posts;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios posts" ON community_posts;
DROP POLICY IF EXISTS "Admins podem moderar posts" ON community_posts;
DROP POLICY IF EXISTS "Suporte pode ver todos os posts" ON community_posts;

-- Remover políticas de community_comments
DROP POLICY IF EXISTS "Usuários autenticados podem ver comentários públicos" ON community_comments;
DROP POLICY IF EXISTS "Usuários podem criar comentários" ON community_comments;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios comentários" ON community_comments;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios comentários" ON community_comments;
DROP POLICY IF EXISTS "Admins podem moderar comentários" ON community_comments;

-- Remover políticas de community_reactions
DROP POLICY IF EXISTS "Usuários autenticados podem ver reações" ON community_reactions;
DROP POLICY IF EXISTS "Usuários podem criar reações" ON community_reactions;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias reações" ON community_reactions;

-- Remover políticas de community_follows
DROP POLICY IF EXISTS "Usuários podem ver quem segue" ON community_follows;
DROP POLICY IF EXISTS "Usuários podem seguir outros" ON community_follows;
DROP POLICY IF EXISTS "Usuários podem deixar de seguir" ON community_follows;

-- Remover políticas de community_notifications
DROP POLICY IF EXISTS "Usuários podem ver suas notificações" ON community_notifications;
DROP POLICY IF EXISTS "Usuários podem marcar notificações como lidas" ON community_notifications;

-- Remover políticas de community_reports
DROP POLICY IF EXISTS "Usuários podem criar denúncias" ON community_reports;
DROP POLICY IF EXISTS "Admins podem ver denúncias" ON community_reports;

-- =====================================================
-- 2. GARANTIR QUE RLS ESTÁ HABILITADO
-- =====================================================

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. RECRIAR POLÍTICAS (DO ZERO)
-- =====================================================

-- =====================================================
-- POLÍTICAS PARA COMMUNITY_POSTS
-- =====================================================

-- Ver posts públicos
CREATE POLICY "Usuários autenticados podem ver posts públicos"
  ON community_posts FOR SELECT
  USING (
    status = 'publico' 
    AND deleted_at IS NULL
    AND (
      auth.uid() = user_id 
      OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() 
        AND (is_admin = true OR is_support = true)
      )
    )
  );

-- Criar posts
CREATE POLICY "Usuários podem criar posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Editar próprios posts
CREATE POLICY "Usuários podem editar seus próprios posts"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Deletar próprios posts
CREATE POLICY "Usuários podem deletar seus próprios posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS PARA COMMUNITY_COMMENTS
-- =====================================================

-- Ver comentários públicos
CREATE POLICY "Usuários autenticados podem ver comentários públicos"
  ON community_comments FOR SELECT
  USING (
    status = 'publico' 
    AND deleted_at IS NULL
  );

-- Criar comentários
CREATE POLICY "Usuários podem criar comentários"
  ON community_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Editar próprios comentários
CREATE POLICY "Usuários podem editar seus próprios comentários"
  ON community_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Deletar próprios comentários
CREATE POLICY "Usuários podem deletar seus próprios comentários"
  ON community_comments FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS PARA COMMUNITY_REACTIONS
-- =====================================================

-- Ver reações
CREATE POLICY "Usuários autenticados podem ver reações"
  ON community_reactions FOR SELECT
  USING (true);

-- Criar reações
CREATE POLICY "Usuários podem criar reações"
  ON community_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Deletar próprias reações
CREATE POLICY "Usuários podem deletar suas próprias reações"
  ON community_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS PARA COMMUNITY_FOLLOWS
-- =====================================================

-- Ver quem segue
CREATE POLICY "Usuários podem ver quem segue"
  ON community_follows FOR SELECT
  USING (true);

-- Seguir outros
CREATE POLICY "Usuários podem seguir outros"
  ON community_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id AND follower_id != following_id);

-- Deixar de seguir
CREATE POLICY "Usuários podem deixar de seguir"
  ON community_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- =====================================================
-- POLÍTICAS PARA COMMUNITY_NOTIFICATIONS
-- =====================================================

-- Ver próprias notificações
CREATE POLICY "Usuários podem ver suas notificações"
  ON community_notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Marcar como lida
CREATE POLICY "Usuários podem marcar notificações como lidas"
  ON community_notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS PARA COMMUNITY_REPORTS
-- =====================================================

-- Criar denúncias
CREATE POLICY "Usuários podem criar denúncias"
  ON community_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins podem ver denúncias
CREATE POLICY "Admins podem ver denúncias"
  ON community_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND (is_admin = true OR is_support = true)
    )
  );

-- =====================================================
-- 4. VERIFICAR SE TUDO ESTÁ OK
-- =====================================================

-- Verificar políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename LIKE 'community%'
ORDER BY tablename, policyname;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas RLS recriadas com sucesso!';
  RAISE NOTICE '✅ Execute a query acima para verificar todas as políticas.';
END $$;
