-- ============================================
-- TABELA: wellness_noel_profile
-- Perfil do NOEL - Respostas do questionário inicial de onboarding
-- ============================================

CREATE TABLE IF NOT EXISTS wellness_noel_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Respostas do questionário inicial
  objetivo_principal TEXT CHECK (objetivo_principal IN (
    'vender_mais',
    'construir_carteira',
    'melhorar_rotina',
    'voltar_ritmo',
    'aprender_divulgar'
  )),
  
  tempo_disponivel TEXT CHECK (tempo_disponivel IN (
    '15_minutos',
    '30_minutos',
    '1_hora',
    'mais_1_hora'
  )),
  
  experiencia_vendas TEXT CHECK (experiencia_vendas IN (
    'sim_regularmente',
    'ja_vendi_tempo',
    'nunca_vendi'
  )),
  
  canal_preferido TEXT[] DEFAULT '{}', -- Array: ['whatsapp', 'instagram', 'presencial', 'grupos', 'misto']
  
  tem_lista_contatos TEXT CHECK (tem_lista_contatos IN ('sim', 'nao', 'parcialmente')),
  
  -- Status do onboarding
  onboarding_completo BOOLEAN DEFAULT false,
  onboarding_iniciado_at TIMESTAMPTZ,
  onboarding_completado_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_noel_profile_user ON wellness_noel_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_noel_profile_onboarding ON wellness_noel_profile(onboarding_completo);

-- Comentários
COMMENT ON TABLE wellness_noel_profile IS 'Perfil do NOEL - Respostas do questionário inicial de onboarding';
COMMENT ON COLUMN wellness_noel_profile.objetivo_principal IS 'Objetivo principal do consultor no wellness';
COMMENT ON COLUMN wellness_noel_profile.tempo_disponivel IS 'Tempo disponível por dia para trabalhar';
COMMENT ON COLUMN wellness_noel_profile.experiencia_vendas IS 'Experiência com vendas de bebidas funcionais';
COMMENT ON COLUMN wellness_noel_profile.canal_preferido IS 'Canais preferidos de trabalho (array)';
COMMENT ON COLUMN wellness_noel_profile.tem_lista_contatos IS 'Se já tem lista de contatos disponível';

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_wellness_noel_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wellness_noel_profile_updated_at
  BEFORE UPDATE ON wellness_noel_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_noel_profile_updated_at();

-- RLS (Row Level Security)
ALTER TABLE wellness_noel_profile ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só podem ver/editar seu próprio perfil
CREATE POLICY "Users can view own noel profile"
  ON wellness_noel_profile
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own noel profile"
  ON wellness_noel_profile
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own noel profile"
  ON wellness_noel_profile
  FOR UPDATE
  USING (auth.uid() = user_id);





