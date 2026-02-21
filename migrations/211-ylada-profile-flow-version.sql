-- =====================================================
-- Perfil YLADA: versionamento do flow (flow_id, flow_version).
-- Permite evoluir fluxos sem quebrar perfis antigos; Noel pode interpretar com qual versão o perfil foi preenchido.
-- @see docs/PERFIL-POR-TOPICO-PROFISSAO-FLUXOS.md
-- =====================================================

ALTER TABLE ylada_noel_profile
  ADD COLUMN IF NOT EXISTS flow_id TEXT,
  ADD COLUMN IF NOT EXISTS flow_version INTEGER;

COMMENT ON COLUMN ylada_noel_profile.flow_id IS 'Identificador do fluxo usado ao preencher (ex.: liberal_v1, vendas_v1).';
COMMENT ON COLUMN ylada_noel_profile.flow_version IS 'Versão do fluxo no momento do preenchimento (ex.: 1).';

CREATE INDEX IF NOT EXISTS idx_ylada_noel_profile_flow_id ON ylada_noel_profile(flow_id) WHERE flow_id IS NOT NULL;
