-- =====================================================
-- Perfil YLADA: profile_type (liberal | vendas) e profession (tópico/profissão).
-- Permite fluxos e campos diferentes por tipo; compatível com perfis existentes (nullable).
-- @see docs/PERFIL-POR-TOPICO-PROFISSAO-FLUXOS.md
-- =====================================================

ALTER TABLE ylada_noel_profile
  ADD COLUMN IF NOT EXISTS profile_type TEXT,
  ADD COLUMN IF NOT EXISTS profession TEXT;

ALTER TABLE ylada_noel_profile
  DROP CONSTRAINT IF EXISTS ylada_noel_profile_profile_type_check;

ALTER TABLE ylada_noel_profile
  ADD CONSTRAINT ylada_noel_profile_profile_type_check
  CHECK (profile_type IS NULL OR profile_type IN ('liberal', 'vendas'));

COMMENT ON COLUMN ylada_noel_profile.profile_type IS 'Tipo de perfil: liberal (consultório/atendimento) ou vendas (funil/produtos). Define fluxo de preenchimento e ênfase do Noel.';
COMMENT ON COLUMN ylada_noel_profile.profession IS 'Profissão/tópico: medico, estetica, odonto, psi, coach, nutra, seller. Refinamento para próximas etapas e linguagem.';

CREATE INDEX IF NOT EXISTS idx_ylada_noel_profile_profile_type ON ylada_noel_profile(profile_type) WHERE profile_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ylada_noel_profile_profession ON ylada_noel_profile(profession) WHERE profession IS NOT NULL;
