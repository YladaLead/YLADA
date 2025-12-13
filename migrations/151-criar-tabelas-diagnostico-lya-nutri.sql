-- ============================================
-- MIGRATION: Criar tabelas para Diagnóstico LYA Nutri
-- ============================================
-- Data: 2024
-- Descrição: Cria estrutura de dados para diagnóstico inicial e perfil estratégico da LYA

-- ============================================
-- TABELA: nutri_diagnostico
-- Armazena diagnóstico completo da nutricionista
-- ============================================
CREATE TABLE IF NOT EXISTS nutri_diagnostico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- BLOCO 1: Perfil Profissional
  tipo_atuacao VARCHAR(50), -- 'clinica_fisica', 'online', 'hibrida', 'iniciante', 'outra'
  tempo_atuacao VARCHAR(50), -- 'menos_1_ano', '1_3_anos', '3_5_anos', 'mais_5_anos'
  autoavaliacao VARCHAR(50), -- 'tecnica_boa_negocio_fraco', 'tecnica_boa_negocio_razoavel', 'tecnica_boa_negocio_bom', 'mais_empreendedora'
  
  -- BLOCO 2: Momento Atual do Negócio
  situacao_atual VARCHAR(50), -- 'poucos_pacientes', 'agenda_instavel', 'agenda_cheia_desorganizada', 'agenda_cheia_organizada'
  processos_captacao BOOLEAN DEFAULT false,
  processos_avaliacao BOOLEAN DEFAULT false,
  processos_fechamento BOOLEAN DEFAULT false,
  processos_acompanhamento BOOLEAN DEFAULT false,
  
  -- BLOCO 3: Objetivo Principal (90 dias)
  objetivo_principal VARCHAR(50), -- 'lotar_agenda', 'organizar_rotina', 'vender_planos', 'aumentar_faturamento', 'estruturar_negocio', 'outro'
  meta_financeira VARCHAR(50), -- 'ate_5k', '5k_10k', '10k_20k', 'acima_20k'
  
  -- BLOCO 4: Travas e Dificuldades (array de até 3)
  travas TEXT[], -- ['falta_clientes', 'falta_constancia', 'dificuldade_vender', 'falta_organizacao', 'inseguranca', 'falta_tempo', 'medo_aparecer', 'nao_saber_comecar']
  
  -- BLOCO 5: Tempo, Energia e Disciplina
  tempo_disponivel VARCHAR(50), -- 'ate_30min', '30_60min', '1_2h', '2_3h', '3_4h', '4_6h', 'mais_6h'
  preferencia VARCHAR(50), -- 'guiado', 'autonomo'
  
  -- BLOCO 6: Campo Aberto (OPCIONAL)
  campo_aberto TEXT, -- Texto livre opcional, sem restrições de tamanho
  
  -- Metadados
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_nutri_diagnostico_user_id ON nutri_diagnostico(user_id);

-- ============================================
-- TABELA: nutri_perfil_estrategico
-- Armazena perfil estratégico gerado automaticamente
-- ============================================
CREATE TABLE IF NOT EXISTS nutri_perfil_estrategico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Classificações automáticas
  tipo_nutri VARCHAR(50), -- 'iniciante', 'clinica_construcao', 'clinica_cheia', 'online_estrategica', 'hibrida'
  nivel_empresarial VARCHAR(50), -- 'baixo', 'medio', 'alto'
  foco_prioritario VARCHAR(50), -- 'captacao', 'organizacao', 'fechamento', 'acompanhamento'
  
  -- Configurações da LYA
  tom_lya VARCHAR(50), -- 'acolhedor', 'firme', 'estrategico', 'direto'
  ritmo_conducao VARCHAR(50), -- 'guiado', 'autonomo'
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_nutri_perfil_estrategico_user_id ON nutri_perfil_estrategico(user_id);

-- ============================================
-- TABELA: lya_analise_nutri
-- Armazena análises atuais da LYA
-- ============================================
CREATE TABLE IF NOT EXISTS lya_analise_nutri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Análise atual
  foco_principal TEXT,
  acao_pratica TEXT,
  link_interno TEXT,
  metrica_simples TEXT,
  mensagem_completa TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar análise mais recente
CREATE INDEX IF NOT EXISTS idx_lya_analise_user_updated ON lya_analise_nutri(user_id, updated_at DESC);

-- ============================================
-- ADICIONAR FLAG EM user_profiles
-- ============================================
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS diagnostico_completo BOOLEAN DEFAULT false;

-- Índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_user_profiles_diagnostico_completo ON user_profiles(diagnostico_completo) WHERE diagnostico_completo = true;

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE nutri_diagnostico ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutri_perfil_estrategico ENABLE ROW LEVEL SECURITY;
ALTER TABLE lya_analise_nutri ENABLE ROW LEVEL SECURITY;

-- Políticas para nutri_diagnostico
DROP POLICY IF EXISTS "Users can view own diagnostico" ON nutri_diagnostico;
CREATE POLICY "Users can view own diagnostico"
ON nutri_diagnostico FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own diagnostico" ON nutri_diagnostico;
CREATE POLICY "Users can insert own diagnostico"
ON nutri_diagnostico FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own diagnostico" ON nutri_diagnostico;
CREATE POLICY "Users can update own diagnostico"
ON nutri_diagnostico FOR UPDATE
USING (auth.uid() = user_id);

-- Políticas para nutri_perfil_estrategico
DROP POLICY IF EXISTS "Users can view own perfil estrategico" ON nutri_perfil_estrategico;
CREATE POLICY "Users can view own perfil estrategico"
ON nutri_perfil_estrategico FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own perfil estrategico" ON nutri_perfil_estrategico;
CREATE POLICY "Users can insert own perfil estrategico"
ON nutri_perfil_estrategico FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own perfil estrategico" ON nutri_perfil_estrategico;
CREATE POLICY "Users can update own perfil estrategico"
ON nutri_perfil_estrategico FOR UPDATE
USING (auth.uid() = user_id);

-- Políticas para lya_analise_nutri
DROP POLICY IF EXISTS "Users can view own lya analise" ON lya_analise_nutri;
CREATE POLICY "Users can view own lya analise"
ON lya_analise_nutri FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lya analise" ON lya_analise_nutri;
CREATE POLICY "Users can insert own lya analise"
ON lya_analise_nutri FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lya analise" ON lya_analise_nutri;
CREATE POLICY "Users can update own lya analise"
ON lya_analise_nutri FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_nutri_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers (remover antes de criar para evitar erro se já existirem)
DROP TRIGGER IF EXISTS update_nutri_diagnostico_updated_at ON nutri_diagnostico;
CREATE TRIGGER update_nutri_diagnostico_updated_at
  BEFORE UPDATE ON nutri_diagnostico
  FOR EACH ROW
  EXECUTE FUNCTION update_nutri_updated_at();

DROP TRIGGER IF EXISTS update_nutri_perfil_estrategico_updated_at ON nutri_perfil_estrategico;
CREATE TRIGGER update_nutri_perfil_estrategico_updated_at
  BEFORE UPDATE ON nutri_perfil_estrategico
  FOR EACH ROW
  EXECUTE FUNCTION update_nutri_updated_at();

DROP TRIGGER IF EXISTS update_lya_analise_nutri_updated_at ON lya_analise_nutri;
CREATE TRIGGER update_lya_analise_nutri_updated_at
  BEFORE UPDATE ON lya_analise_nutri
  FOR EACH ROW
  EXECUTE FUNCTION update_nutri_updated_at();

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE nutri_diagnostico IS 'Armazena diagnóstico completo da nutricionista';
COMMENT ON TABLE nutri_perfil_estrategico IS 'Armazena perfil estratégico gerado automaticamente a partir do diagnóstico';
COMMENT ON TABLE lya_analise_nutri IS 'Armazena análises atuais da LYA para cada nutricionista';

