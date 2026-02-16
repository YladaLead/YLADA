-- =====================================================
-- Perfil empresarial YLADA (Noel) — uma tabela por (user_id, segment)
-- Campos comuns + area_specific (JSONB); inclui kit diagnóstico (dor, fase, prioridade, modelo, canais, rotina).
-- @see docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md
-- @see docs/PASSO-A-PASSO-TRILHA-E-PERFIL.md (etapa 2.1)
-- =====================================================

-- Segmentos: med, psi, psicanalise, odonto, nutra, coach, seller (validados por CHECK abaixo; fácil adicionar "service" depois)
CREATE TABLE IF NOT EXISTS ylada_noel_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  segment TEXT NOT NULL CHECK (segment IN ('med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller')),

  -- Contexto
  tempo_atuacao_anos INTEGER,

  -- Motor do Noel (diagnóstico e prioridade)
  dor_principal TEXT,
  prioridade_atual TEXT,
  fase_negocio TEXT CHECK (fase_negocio IS NULL OR fase_negocio IN ('iniciante', 'em_crescimento', 'estabilizado', 'escalando')),

  -- Metas e objetivos
  metas_principais TEXT,
  objetivos_curto_prazo TEXT,

  -- Modelo de atuação e capacidade
  modelo_atuacao JSONB DEFAULT '[]'::jsonb,
  capacidade_semana INTEGER,
  ticket_medio NUMERIC,
  modelo_pagamento TEXT CHECK (modelo_pagamento IS NULL OR modelo_pagamento IN ('particular', 'convenio', 'plano', 'recorrencia', 'avulso', 'comissao', 'outro')),

  -- Canais e rotina
  canais_principais JSONB DEFAULT '[]'::jsonb,
  rotina_atual_resumo TEXT,
  frequencia_postagem TEXT,

  -- Observações (até 1500 chars; aplicativo pode validar)
  observacoes TEXT,

  -- Específico por área (especialidades, abordagens, oferta seller, etc.)
  area_specific JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, segment)
);

CREATE INDEX IF NOT EXISTS idx_ylada_noel_profile_user ON ylada_noel_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_ylada_noel_profile_segment ON ylada_noel_profile(segment);
CREATE INDEX IF NOT EXISTS idx_ylada_noel_profile_user_segment ON ylada_noel_profile(user_id, segment);

COMMENT ON TABLE ylada_noel_profile IS 'Perfil empresarial por área para o Noel YLADA: diagnóstico (dor, fase, prioridade), modelo de atuação, canais, rotina e area_specific por segmento.';

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_ylada_noel_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ylada_noel_profile_updated_at ON ylada_noel_profile;
CREATE TRIGGER update_ylada_noel_profile_updated_at
  BEFORE UPDATE ON ylada_noel_profile
  FOR EACH ROW EXECUTE FUNCTION update_ylada_noel_profile_updated_at();

-- RLS: usuário só acessa o próprio perfil
ALTER TABLE ylada_noel_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY ylada_noel_profile_select ON ylada_noel_profile
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY ylada_noel_profile_insert ON ylada_noel_profile
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY ylada_noel_profile_update ON ylada_noel_profile
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
