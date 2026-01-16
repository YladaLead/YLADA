-- ============================================
-- MIGRAÇÃO 185: Adicionar campo reflexao_metas na tabela wellness_metas_construcao
-- Data: 2025-01-28
-- Objetivo: Adicionar campo de texto livre para reflexão pessoal sobre metas que o NOEL usa para personalizar respostas
-- ============================================

-- Adicionar coluna reflexao_metas
ALTER TABLE wellness_metas_construcao
ADD COLUMN IF NOT EXISTS reflexao_metas TEXT;

-- Comentário
COMMENT ON COLUMN wellness_metas_construcao.reflexao_metas IS 'Reflexão pessoal sobre metas e objetivos que o NOEL usa para personalizar respostas e orientações';
