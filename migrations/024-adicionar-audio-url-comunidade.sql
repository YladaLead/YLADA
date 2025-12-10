-- =====================================================
-- Adicionar suporte a áudio nas mensagens da comunidade
-- =====================================================

-- Adicionar coluna audio_url na tabela community_posts
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Atualizar tipo para incluir 'audio'
-- (O tipo já é VARCHAR(50), então não precisa alterar a estrutura)
