-- ============================================
-- MIGRATION: Adicionar campo nome_presidente em trial_invites
-- Descrição: Armazena nome do presidente selecionado para rastreamento
-- ============================================

ALTER TABLE trial_invites
ADD COLUMN IF NOT EXISTS nome_presidente TEXT;

-- Índice para busca por presidente
CREATE INDEX IF NOT EXISTS idx_trial_invites_nome_presidente ON trial_invites(nome_presidente);

-- Comentário
COMMENT ON COLUMN trial_invites.nome_presidente IS 'Nome do presidente selecionado (para ambiente de presidentes)';
