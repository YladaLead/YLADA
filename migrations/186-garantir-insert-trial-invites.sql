-- ============================================
-- MIGRATION: Garantir INSERT em trial_invites via service role
-- Descrição: Adiciona política explícita para permitir INSERTs via service role
-- ============================================

-- Garantir que a coluna nome_presidente existe
ALTER TABLE trial_invites
ADD COLUMN IF NOT EXISTS nome_presidente TEXT;

-- Criar índice se não existir
CREATE INDEX IF NOT EXISTS idx_trial_invites_nome_presidente ON trial_invites(nome_presidente);

-- NOTA: Quando usamos service_role_key (supabaseAdmin), o RLS é automaticamente bypassado.
-- Mas vamos adicionar uma política explícita para garantir que funciona em todos os casos.

-- Remover política antiga se existir (para evitar conflitos)
DROP POLICY IF EXISTS "Service role can insert trial invites" ON trial_invites;

-- Política: Service role pode inserir (via API)
-- Esta política é redundante quando usamos service_role_key, mas garante compatibilidade
CREATE POLICY "Service role can insert trial invites"
  ON trial_invites
  FOR INSERT
  WITH CHECK (true); -- Service role sempre passa

-- Comentário
COMMENT ON COLUMN trial_invites.nome_presidente IS 'Nome do presidente selecionado (para ambiente de presidentes)';
