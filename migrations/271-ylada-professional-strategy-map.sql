-- Mapa Estratégico do Profissional — visualização da jornada (posicionamento → atração → ... → indicações).
-- O Noel usa para orientar o próximo passo e o front pode exibir progresso.
-- Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md

CREATE TABLE IF NOT EXISTS ylada_professional_strategy_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  segment TEXT NOT NULL DEFAULT 'ylada',
  -- Perfil e objetivo (espelhados da memória para consulta rápida)
  profile TEXT,
  goal TEXT,
  -- Progresso por etapa (true = etapa concluída)
  posicionamento_ok BOOLEAN DEFAULT false,
  atracao_ok BOOLEAN DEFAULT false,
  diagnostico_ok BOOLEAN DEFAULT false,
  conversa_ok BOOLEAN DEFAULT false,
  clientes_ok BOOLEAN DEFAULT false,
  fidelizacao_ok BOOLEAN DEFAULT false,
  indicacoes_ok BOOLEAN DEFAULT false,
  -- Métricas para inferir progresso
  diagnostics_created INTEGER DEFAULT 0,
  conversations_started INTEGER DEFAULT 0,
  clients_converted INTEGER DEFAULT 0,
  -- Próxima etapa a focar
  current_stage TEXT,
  last_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, segment)
);

CREATE INDEX IF NOT EXISTS idx_ylada_strategy_map_user ON ylada_professional_strategy_map(user_id);
CREATE INDEX IF NOT EXISTS idx_ylada_strategy_map_segment ON ylada_professional_strategy_map(segment);

COMMENT ON TABLE ylada_professional_strategy_map IS 'Mapa estratégico: progresso do profissional nas etapas posicionamento → atração → diagnóstico → conversa → clientes → fidelização → indicações.';
COMMENT ON COLUMN ylada_professional_strategy_map.current_stage IS 'Próxima etapa a focar: posicionamento, atracao, diagnostico, conversa, clientes, fidelizacao, indicacoes.';

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_ylada_strategy_map_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ylada_strategy_map_updated_at ON ylada_professional_strategy_map;
CREATE TRIGGER update_ylada_strategy_map_updated_at
  BEFORE UPDATE ON ylada_professional_strategy_map FOR EACH ROW EXECUTE FUNCTION update_ylada_strategy_map_updated_at();

-- RLS
ALTER TABLE ylada_professional_strategy_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY ylada_strategy_map_select ON ylada_professional_strategy_map
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY ylada_strategy_map_insert ON ylada_professional_strategy_map
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY ylada_strategy_map_update ON ylada_professional_strategy_map
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
