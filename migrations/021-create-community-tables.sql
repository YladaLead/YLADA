-- =====================================================
-- YLADA - SISTEMA DE COMUNIDADE INTERNA
-- Criação das tabelas para comunidade (substituir WhatsApp)
-- =====================================================

-- =====================================================
-- 1. COMMUNITY_POSTS - Posts da Comunidade
-- =====================================================

CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL, -- 'nutri', 'wellness', 'coach', 'nutra'
  
  -- Conteúdo
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'texto', -- 'texto', 'imagem', 'link', 'video'
  
  -- Organização
  categoria VARCHAR(100) NOT NULL, -- 'duvidas', 'dicas', 'casos-sucesso', 'networking'
  tags TEXT[] DEFAULT '{}',
  
  -- Mídia
  imagens TEXT[], -- URLs das imagens
  video_url TEXT,
  link_url TEXT,
  link_preview JSONB, -- {title, description, image}
  
  -- Engajamento
  curtidas_count INTEGER DEFAULT 0,
  comentarios_count INTEGER DEFAULT 0,
  visualizacoes_count INTEGER DEFAULT 0,
  compartilhamentos_count INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'publico', -- 'publico', 'aprovacao', 'arquivado', 'removido'
  pinned BOOLEAN DEFAULT false,
  destacado BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Índices para Posts
CREATE INDEX IF NOT EXISTS idx_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_area ON community_posts(area);
CREATE INDEX IF NOT EXISTS idx_posts_categoria ON community_posts(categoria);
CREATE INDEX IF NOT EXISTS idx_posts_status ON community_posts(status) WHERE status = 'publico';
CREATE INDEX IF NOT EXISTS idx_posts_tags ON community_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON community_posts(pinned) WHERE pinned = true;
CREATE INDEX IF NOT EXISTS idx_posts_area_status ON community_posts(area, status, created_at DESC) WHERE status = 'publico';

-- =====================================================
-- 2. COMMUNITY_COMMENTS - Comentários nos Posts
-- =====================================================

CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE, -- Para respostas aninhadas
  
  -- Conteúdo
  conteudo TEXT NOT NULL,
  
  -- Engajamento
  curtidas_count INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'publico', -- 'publico', 'removido'
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Índices para Comentários
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON community_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON community_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_status ON community_comments(post_id, status, created_at) WHERE status = 'publico';

-- =====================================================
-- 3. COMMUNITY_REACTIONS - Curtidas/Reações
-- =====================================================

CREATE TABLE IF NOT EXISTS community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  tipo VARCHAR(20) DEFAULT 'curtir', -- 'curtir', 'amei', 'util', etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que usuário só pode curtir uma vez
  CONSTRAINT check_target CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Índices para Reações
CREATE INDEX IF NOT EXISTS idx_reactions_post ON community_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_comment ON community_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON community_reactions(user_id);

-- Índices únicos parciais para garantir uma reação por usuário/post ou usuário/comentário
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_post_reaction 
  ON community_reactions(user_id, post_id) 
  WHERE post_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_comment_reaction 
  ON community_reactions(user_id, comment_id) 
  WHERE comment_id IS NOT NULL;

-- =====================================================
-- 4. COMMUNITY_FOLLOWS - Seguir Membros
-- =====================================================

CREATE TABLE IF NOT EXISTS community_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Não pode seguir a si mesmo
  CONSTRAINT check_not_self CHECK (follower_id != following_id),
  -- Não pode seguir duas vezes
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- Índices para Seguir
CREATE INDEX IF NOT EXISTS idx_follows_follower ON community_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON community_follows(following_id);

-- =====================================================
-- 5. COMMUNITY_NOTIFICATIONS - Notificações
-- =====================================================

CREATE TABLE IF NOT EXISTS community_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Tipo de notificação
  tipo VARCHAR(50) NOT NULL, -- 'comentario', 'curtida', 'resposta', 'mencao', 'novo_post'
  
  -- Referências
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Quem fez a ação
  
  -- Conteúdo
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT,
  link TEXT, -- URL para onde redirecionar
  
  -- Status
  lida BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para Notificações
CREATE INDEX IF NOT EXISTS idx_notifications_user ON community_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_lida ON community_notifications(user_id, lida) WHERE lida = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON community_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON community_notifications(user_id, created_at DESC) WHERE lida = false;

-- =====================================================
-- 6. COMMUNITY_REPORTS - Denúncias
-- =====================================================

CREATE TABLE IF NOT EXISTS community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- O que está sendo denunciado
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  
  -- Motivo
  motivo VARCHAR(100) NOT NULL, -- 'spam', 'inapropriado', 'bullying', 'outro'
  descricao TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'analisando', 'resolvido', 'rejeitado'
  resolvido_por UUID REFERENCES auth.users(id),
  resolvido_em TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para Denúncias
CREATE INDEX IF NOT EXISTS idx_reports_status ON community_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_post ON community_reports(post_id);
CREATE INDEX IF NOT EXISTS idx_reports_comment ON community_reports(comment_id);

-- =====================================================
-- 7. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para atualizar contador de comentários
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET comentarios_count = comentarios_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET comentarios_count = GREATEST(comentarios_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador de comentários
DROP TRIGGER IF EXISTS trigger_update_comments_count ON community_comments;
CREATE TRIGGER trigger_update_comments_count
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();

-- Função para atualizar contador de curtidas
CREATE OR REPLACE FUNCTION update_post_reactions_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE community_posts
      SET curtidas_count = curtidas_count + 1
      WHERE id = NEW.post_id;
    ELSIF NEW.comment_id IS NOT NULL THEN
      UPDATE community_comments
      SET curtidas_count = curtidas_count + 1
      WHERE id = NEW.comment_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE community_posts
      SET curtidas_count = GREATEST(curtidas_count - 1, 0)
      WHERE id = OLD.post_id;
    ELSIF OLD.comment_id IS NOT NULL THEN
      UPDATE community_comments
      SET curtidas_count = GREATEST(curtidas_count - 1, 0)
      WHERE id = OLD.comment_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador de curtidas
DROP TRIGGER IF EXISTS trigger_update_reactions_count ON community_reactions;
CREATE TRIGGER trigger_update_reactions_count
  AFTER INSERT OR DELETE ON community_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_post_reactions_count();

-- =====================================================
-- 8. RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;

-- Políticas para Posts
DROP POLICY IF EXISTS "Usuários autenticados podem ver posts públicos" ON community_posts;
CREATE POLICY "Usuários autenticados podem ver posts públicos"
  ON community_posts FOR SELECT
  USING (auth.role() = 'authenticated' AND status = 'publico');

DROP POLICY IF EXISTS "Usuários podem criar posts" ON community_posts;
CREATE POLICY "Usuários podem criar posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem editar seus próprios posts" ON community_posts;
CREATE POLICY "Usuários podem editar seus próprios posts"
  ON community_posts FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios posts" ON community_posts;
CREATE POLICY "Usuários podem deletar seus próprios posts"
  ON community_posts FOR DELETE
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Políticas para Comentários
DROP POLICY IF EXISTS "Usuários autenticados podem ver comentários públicos" ON community_comments;
CREATE POLICY "Usuários autenticados podem ver comentários públicos"
  ON community_comments FOR SELECT
  USING (auth.role() = 'authenticated' AND status = 'publico');

DROP POLICY IF EXISTS "Usuários podem criar comentários" ON community_comments;
CREATE POLICY "Usuários podem criar comentários"
  ON community_comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem editar seus próprios comentários" ON community_comments;
CREATE POLICY "Usuários podem editar seus próprios comentários"
  ON community_comments FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios comentários" ON community_comments;
CREATE POLICY "Usuários podem deletar seus próprios comentários"
  ON community_comments FOR DELETE
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Políticas para Reações
DROP POLICY IF EXISTS "Usuários autenticados podem ver reações" ON community_reactions;
CREATE POLICY "Usuários autenticados podem ver reações"
  ON community_reactions FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários podem criar reações" ON community_reactions;
CREATE POLICY "Usuários podem criar reações"
  ON community_reactions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias reações" ON community_reactions;
CREATE POLICY "Usuários podem deletar suas próprias reações"
  ON community_reactions FOR DELETE
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Políticas para Seguir
DROP POLICY IF EXISTS "Usuários autenticados podem ver follows" ON community_follows;
CREATE POLICY "Usuários autenticados podem ver follows"
  ON community_follows FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários podem seguir outros" ON community_follows;
CREATE POLICY "Usuários podem seguir outros"
  ON community_follows FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = follower_id);

DROP POLICY IF EXISTS "Usuários podem deixar de seguir" ON community_follows;
CREATE POLICY "Usuários podem deixar de seguir"
  ON community_follows FOR DELETE
  USING (auth.role() = 'authenticated' AND auth.uid() = follower_id);

-- Políticas para Notificações
DROP POLICY IF EXISTS "Usuários podem ver suas próprias notificações" ON community_notifications;
CREATE POLICY "Usuários podem ver suas próprias notificações"
  ON community_notifications FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Sistema pode criar notificações" ON community_notifications;
CREATE POLICY "Sistema pode criar notificações"
  ON community_notifications FOR INSERT
  WITH CHECK (true); -- Permitir criação via service role

DROP POLICY IF EXISTS "Usuários podem atualizar suas notificações" ON community_notifications;
CREATE POLICY "Usuários podem atualizar suas notificações"
  ON community_notifications FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Políticas para Denúncias
DROP POLICY IF EXISTS "Usuários podem criar denúncias" ON community_reports;
CREATE POLICY "Usuários podem criar denúncias"
  ON community_reports FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins podem ver todas as denúncias" ON community_reports;
CREATE POLICY "Admins podem ver todas as denúncias"
  ON community_reports FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- 9. COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE community_posts IS 'Posts da comunidade interna';
COMMENT ON TABLE community_comments IS 'Comentários nos posts';
COMMENT ON TABLE community_reactions IS 'Curtidas/reações em posts e comentários';
COMMENT ON TABLE community_follows IS 'Relação de seguir entre membros';
COMMENT ON TABLE community_notifications IS 'Notificações da comunidade';
COMMENT ON TABLE community_reports IS 'Denúncias de conteúdo inapropriado';
