-- =====================================================
-- Vincular presidente à conta de usuário (Wellness)
-- Assim o admin pode associar um usuário existente a cada
-- presidente; ao fazer login, esse usuário terá acesso
-- à área do presidente (gerar link para equipe, etc.).
--
-- OBRIGATÓRIO: rode esta migration no Supabase antes de
-- usar a página Admin → Presidentes (vínculo de contas).
-- =====================================================

ALTER TABLE presidentes_autorizados
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_presidentes_autorizados_user_id
  ON presidentes_autorizados(user_id);

COMMENT ON COLUMN presidentes_autorizados.user_id IS 'Conta de usuário vinculada a este presidente; ao logar, terá acesso à área do presidente.';
