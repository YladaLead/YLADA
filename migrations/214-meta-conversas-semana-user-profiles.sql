-- =====================================================
-- Meta semanal de conversas (Sistema de Conversas Ativas)
-- Permite meta personalizada por usuário/segmento no futuro.
-- =====================================================

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS meta_conversas_semana INTEGER DEFAULT 5;

COMMENT ON COLUMN user_profiles.meta_conversas_semana IS 'Meta de conversas/leads por semana para o painel Sistema de Conversas Ativas (Nutri e futuros segmentos)';

-- Validação (1–50) feita na API ao atualizar
