-- Memória estratégica do Noel: acompanha a jornada do profissional entre conversas.
-- Permite que o Noel responda "O que faço agora?" com base no que já aconteceu.
-- Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md
-- Referência: MATRIZ-CENTRAL-CRONOGRAMA.md (2.2 Memória Noel)

CREATE TABLE IF NOT EXISTS ylada_noel_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  segment TEXT NOT NULL DEFAULT 'ylada',
  -- Perfil e contexto detectados nas conversas
  professional_profile TEXT,
  main_goal TEXT,
  main_problem TEXT,
  current_strategy TEXT,
  funnel_stage TEXT,
  -- Ações recentes (ex.: criou_link_emagrecimento, compartilhou_diagnostico)
  last_actions JSONB DEFAULT '[]'::jsonb,
  -- Última interação para contexto
  last_interaction_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, segment)
);

CREATE INDEX IF NOT EXISTS idx_ylada_noel_memory_user ON ylada_noel_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_ylada_noel_memory_segment ON ylada_noel_memory(segment);

COMMENT ON TABLE ylada_noel_memory IS 'Memória estratégica do Noel: perfil, objetivo, problema, estratégia em uso e ações recentes. Permite continuidade de mentoria entre conversas.';
COMMENT ON COLUMN ylada_noel_memory.professional_profile IS 'Perfil do profissional detectado (ex.: iniciante, agenda_vazia, muitos_curiosos).';
COMMENT ON COLUMN ylada_noel_memory.main_goal IS 'Objetivo principal (ex.: gerar_contatos, melhorar_conversao).';
COMMENT ON COLUMN ylada_noel_memory.main_problem IS 'Problema/situação principal (ex.: agenda_vazia).';
COMMENT ON COLUMN ylada_noel_memory.current_strategy IS 'Estratégia em uso (ex.: diagnostico_link, compartilhar_link).';
COMMENT ON COLUMN ylada_noel_memory.funnel_stage IS 'Estágio do funil (ex.: atracao, conversa, decisao).';
COMMENT ON COLUMN ylada_noel_memory.last_actions IS 'Array de ações recentes (ex.: ["criou_link_emagrecimento", "compartilhou_diagnostico"]).';

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_ylada_noel_memory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ylada_noel_memory_updated_at ON ylada_noel_memory;
CREATE TRIGGER update_ylada_noel_memory_updated_at
  BEFORE UPDATE ON ylada_noel_memory FOR EACH ROW EXECUTE FUNCTION update_ylada_noel_memory_updated_at();

-- RLS: usuário só acessa própria memória
ALTER TABLE ylada_noel_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY ylada_noel_memory_select ON ylada_noel_memory
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY ylada_noel_memory_insert ON ylada_noel_memory
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY ylada_noel_memory_update ON ylada_noel_memory
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
