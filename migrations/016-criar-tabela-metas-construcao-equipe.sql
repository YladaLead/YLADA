-- ============================================
-- MIGRAÇÃO 016: Criar Tabela de Metas de Construção de Equipe
-- Data: 2025-01-27
-- Objetivo: Criar estrutura para metas de construção de negócio, recrutamento e royalties
-- ============================================

-- TABELA: wellness_metas_construcao
-- Armazena metas relacionadas à construção de equipe, recrutamento e royalties
CREATE TABLE IF NOT EXISTS wellness_metas_construcao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Meta de PV de Equipe (construção de negócio)
  meta_pv_equipe NUMERIC(10,2) DEFAULT 0,
  pv_equipe_atual NUMERIC(10,2) DEFAULT 0,
  
  -- Meta de Recrutamento (número de pessoas)
  meta_recrutamento INTEGER DEFAULT 0, -- Número de pessoas a recrutar
  recrutamento_atual INTEGER DEFAULT 0, -- Número de pessoas já recrutadas
  
  -- Meta de Royalties (quando atingir GET/Milionário/Presidente)
  meta_royalties NUMERIC(10,2) DEFAULT 0, -- Valor em reais
  royalties_atual NUMERIC(10,2) DEFAULT 0, -- Royalties atuais
  
  -- Nível de carreira alvo
  nivel_carreira_alvo TEXT CHECK (nivel_carreira_alvo IN (
    'consultor_ativo',
    'consultor_1000pv',
    'equipe_mundial',
    'get',
    'milionario',
    'presidente'
  )),
  
  -- Prazo para atingir metas (em meses)
  prazo_meses INTEGER DEFAULT 12,
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_metas_construcao_user ON wellness_metas_construcao(user_id);
CREATE INDEX IF NOT EXISTS idx_metas_construcao_nivel ON wellness_metas_construcao(nivel_carreira_alvo);
CREATE INDEX IF NOT EXISTS idx_metas_construcao_ativo ON wellness_metas_construcao(ativo);

-- Comentários
COMMENT ON TABLE wellness_metas_construcao IS 'Metas de construção de equipe, recrutamento e royalties';
COMMENT ON COLUMN wellness_metas_construcao.meta_pv_equipe IS 'Meta de PV de equipe (construção de negócio)';
COMMENT ON COLUMN wellness_metas_construcao.meta_recrutamento IS 'Meta de número de pessoas a recrutar';
COMMENT ON COLUMN wellness_metas_construcao.meta_royalties IS 'Meta de royalties em reais (quando atingir GET/Milionário/Presidente)';
COMMENT ON COLUMN wellness_metas_construcao.nivel_carreira_alvo IS 'Nível de carreira que o usuário quer atingir';

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_wellness_metas_construcao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_wellness_metas_construcao_updated_at ON wellness_metas_construcao;

CREATE TRIGGER update_wellness_metas_construcao_updated_at
  BEFORE UPDATE ON wellness_metas_construcao
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_metas_construcao_updated_at();

-- RLS (Row Level Security)
ALTER TABLE wellness_metas_construcao ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias metas
DROP POLICY IF EXISTS "Users can view own metas construcao" ON wellness_metas_construcao;
CREATE POLICY "Users can view own metas construcao"
  ON wellness_metas_construcao FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem inserir suas próprias metas
DROP POLICY IF EXISTS "Users can insert own metas construcao" ON wellness_metas_construcao;
CREATE POLICY "Users can insert own metas construcao"
  ON wellness_metas_construcao FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias metas
DROP POLICY IF EXISTS "Users can update own metas construcao" ON wellness_metas_construcao;
CREATE POLICY "Users can update own metas construcao"
  ON wellness_metas_construcao FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

