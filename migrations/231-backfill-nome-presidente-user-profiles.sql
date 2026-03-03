-- =====================================================
-- BACKFILL: Preencher nome_presidente em user_profiles
-- a partir de trial_invites (quem gerou o link)
-- 
-- Para usuários wellness que usaram link do presidente
-- mas não tinham nome_presidente no perfil.
-- =====================================================

-- 1. Garantir que a coluna existe
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS nome_presidente TEXT;

-- 2. Atualizar user_profiles com nome_presidente de trial_invites
--    (usuários que usaram link e têm used_by_user_id preenchido)
UPDATE user_profiles up
SET nome_presidente = ti.nome_presidente
FROM trial_invites ti
WHERE ti.used_by_user_id = up.user_id
  AND ti.status = 'used'
  AND ti.nome_presidente IS NOT NULL
  AND ti.nome_presidente != ''
  AND (up.nome_presidente IS NULL OR up.nome_presidente = '');

-- 3. Fallback: se trial_invites tem created_by_user_id mas não nome_presidente,
--    buscar em presidentes_autorizados
UPDATE user_profiles up
SET nome_presidente = pa.nome_completo
FROM trial_invites ti
JOIN presidentes_autorizados pa ON pa.user_id = ti.created_by_user_id AND pa.status = 'ativo'
WHERE ti.used_by_user_id = up.user_id
  AND ti.status = 'used'
  AND ti.created_by_user_id IS NOT NULL
  AND (ti.nome_presidente IS NULL OR ti.nome_presidente = '')
  AND (up.nome_presidente IS NULL OR up.nome_presidente = '');

-- Log de quantos foram atualizados (opcional, para conferência)
-- SELECT COUNT(*) FROM user_profiles WHERE nome_presidente IS NOT NULL AND nome_presidente != '';
