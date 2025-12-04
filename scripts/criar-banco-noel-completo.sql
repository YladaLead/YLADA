-- ============================================
-- BANCO DE DADOS COMPLETO - NOEL WELLNESS
-- Prefixo: ylada_wellness_
-- ============================================

-- ============================================
-- NÍVEL 1 - CONSULTOR
-- ============================================

CREATE TABLE IF NOT EXISTS ylada_wellness_consultores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Dados básicos
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  
  -- Disponibilidade
  tempo_disponivel_diario TEXT CHECK (tempo_disponivel_diario IN ('15-30 min', '30-60 min', '1-2h', '2-3h', '3-5h', '5h+')),
  tempo_disponivel_semanal TEXT CHECK (tempo_disponivel_semanal IN ('5-10h', '10-15h', '15-20h', '20-30h', '30h+')),
  
  -- Perfil
  experiencia TEXT CHECK (experiencia IN ('iniciante', '6 meses', '1 ano', '2-3 anos', '3+ anos')),
  estilo_trabalho TEXT CHECK (estilo_trabalho IN ('presencial', 'online', 'híbrido', 'indefinido')),
  opera_com_bebidas_prontas BOOLEAN DEFAULT false,
  estagio_negocio TEXT CHECK (estagio_negocio IN ('iniciante', 'ativo', 'produtivo', 'multiplicador', 'lider')) DEFAULT 'iniciante',
  
  -- Objetivos
  objetivo_financeiro NUMERIC,
  objetivo_pv NUMERIC,
  deseja_recrutar BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_consultores_user ON ylada_wellness_consultores(user_id);
CREATE INDEX IF NOT EXISTS idx_consultores_estagio ON ylada_wellness_consultores(estagio_negocio);

-- ============================================
-- NÍVEL 2 - DIAGNÓSTICO + PROGRESSO
-- ============================================

CREATE TABLE IF NOT EXISTS ylada_wellness_diagnosticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Respostas do diagnóstico
  tempo_disponivel TEXT,
  experiencia_herbalife TEXT,
  objetivo_principal TEXT,
  maior_dificuldade TEXT,
  estilo_preferido TEXT,
  trabalha_com_bebidas_prontas BOOLEAN,
  deseja_montar_equipe BOOLEAN,
  nivel_atual_vendas TEXT,
  nivel_atual_recrutamento TEXT,
  maior_desafio TEXT,
  como_quer_crescer TEXT,
  
  -- Resultado do diagnóstico
  perfil_identificado TEXT, -- ex: "Consultor Focado em Vendas"
  pontos_fortes TEXT[],
  pontos_melhoria TEXT[],
  recomendacoes TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnosticos_consultor ON ylada_wellness_diagnosticos(consultor_id);

CREATE TABLE IF NOT EXISTS ylada_wellness_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Data do progresso
  data DATE NOT NULL,
  
  -- Execuções do Ritual 2-5-10
  ritual_2_executado BOOLEAN DEFAULT false,
  ritual_5_executado BOOLEAN DEFAULT false,
  ritual_10_executado BOOLEAN DEFAULT false,
  
  -- Microtarefas do plano
  microtarefas_completadas INTEGER DEFAULT 0,
  microtarefas_total INTEGER DEFAULT 0,
  
  -- Métricas do dia
  pv_dia NUMERIC DEFAULT 0,
  vendas_dia INTEGER DEFAULT 0,
  contatos_dia INTEGER DEFAULT 0,
  recrutamentos_dia INTEGER DEFAULT 0,
  
  -- Observações
  observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(consultor_id, data)
);

CREATE INDEX IF NOT EXISTS idx_progresso_consultor_data ON ylada_wellness_progresso(consultor_id, data DESC);

-- ============================================
-- NÍVEL 3 - PLANOS PERSONALIZADOS
-- ============================================

CREATE TABLE IF NOT EXISTS ylada_wellness_planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Tipo de plano
  tipo_plano TEXT NOT NULL CHECK (tipo_plano IN ('7d', '14d', '30d', '90d')),
  
  -- Plano completo em JSON
  plano_json JSONB NOT NULL, -- Estrutura completa do plano
  
  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'concluido')),
  data_inicio DATE NOT NULL,
  data_fim DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planos_consultor ON ylada_wellness_planos(consultor_id);
CREATE INDEX IF NOT EXISTS idx_planos_status ON ylada_wellness_planos(status) WHERE status = 'ativo';

-- ============================================
-- NÍVEL 4 - BASE DE CONHECIMENTO
-- ============================================

CREATE TABLE IF NOT EXISTS ylada_wellness_base_conhecimento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Categorização
  categoria TEXT NOT NULL CHECK (categoria IN ('script_vendas', 'script_bebidas', 'script_indicacao', 'script_recrutamento', 'script_followup', 'frase_motivacional', 'fluxo_padrao', 'instrucao')),
  subcategoria TEXT,
  
  -- Conteúdo
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  
  -- Contexto de uso
  estagio_negocio TEXT[], -- Para quais estágios serve
  tempo_disponivel TEXT[], -- Para quais tempos serve
  tags TEXT[] DEFAULT '{}',
  
  -- Prioridade
  prioridade INTEGER DEFAULT 5 CHECK (prioridade >= 1 AND prioridade <= 10),
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_base_categoria ON ylada_wellness_base_conhecimento(categoria);
CREATE INDEX IF NOT EXISTS idx_base_estagio ON ylada_wellness_base_conhecimento USING GIN(estagio_negocio);
CREATE INDEX IF NOT EXISTS idx_base_tags ON ylada_wellness_base_conhecimento USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_base_ativo ON ylada_wellness_base_conhecimento(ativo) WHERE ativo = true;

-- ============================================
-- MEMÓRIA DO NOEL - INTERAÇÕES
-- ============================================

CREATE TABLE IF NOT EXISTS ylada_wellness_interacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Interação
  mensagem_usuario TEXT NOT NULL,
  resposta_noel TEXT NOT NULL,
  
  -- Contexto usado
  diagnostico_usado BOOLEAN DEFAULT false,
  plano_usado BOOLEAN DEFAULT false,
  progresso_usado BOOLEAN DEFAULT false,
  scripts_usados TEXT[],
  usado_ia BOOLEAN DEFAULT false,
  
  -- Análise
  topico_detectado TEXT,
  intencao_detectada TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interacoes_consultor ON ylada_wellness_interacoes(consultor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interacoes_topico ON ylada_wellness_interacoes(topico_detectado);

-- ============================================
-- SISTEMA DE NOTIFICAÇÕES
-- ============================================

CREATE TABLE IF NOT EXISTS ylada_wellness_notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Notificação
  tipo TEXT NOT NULL CHECK (tipo IN ('ritual', 'microtarefa', 'lembrete', 'motivacional', 'alerta', 'conquista')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  
  -- Ação
  acao_url TEXT, -- URL para ação relacionada
  acao_texto TEXT, -- Texto do botão de ação
  
  -- Status
  lida BOOLEAN DEFAULT false,
  data_envio TIMESTAMPTZ DEFAULT NOW(),
  data_leitura TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_consultor ON ylada_wellness_notificacoes(consultor_id, lida, data_envio DESC);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON ylada_wellness_notificacoes(tipo);

-- ============================================
-- RITUAL 2-5-10 - ESTRUTURA
-- ============================================

CREATE TABLE IF NOT EXISTS ylada_wellness_ritual_dias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Dia do ritual
  dia DATE NOT NULL,
  
  -- Ritual 2 (manhã)
  ritual_2_completado BOOLEAN DEFAULT false,
  ritual_2_horario TIME,
  ritual_2_observacoes TEXT,
  
  -- Ritual 5 (tarde)
  ritual_5_completado BOOLEAN DEFAULT false,
  ritual_5_horario TIME,
  ritual_5_observacoes TEXT,
  
  -- Ritual 10 (noite)
  ritual_10_completado BOOLEAN DEFAULT false,
  ritual_10_horario TIME,
  ritual_10_observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(consultor_id, dia)
);

CREATE INDEX IF NOT EXISTS idx_ritual_consultor_dia ON ylada_wellness_ritual_dias(consultor_id, dia DESC);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_ylada_wellness_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at (com DROP IF EXISTS para idempotência)
DROP TRIGGER IF EXISTS trigger_consultores_updated_at ON ylada_wellness_consultores;
CREATE TRIGGER trigger_consultores_updated_at
  BEFORE UPDATE ON ylada_wellness_consultores
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_diagnosticos_updated_at ON ylada_wellness_diagnosticos;
CREATE TRIGGER trigger_diagnosticos_updated_at
  BEFORE UPDATE ON ylada_wellness_diagnosticos
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_progresso_updated_at ON ylada_wellness_progresso;
CREATE TRIGGER trigger_progresso_updated_at
  BEFORE UPDATE ON ylada_wellness_progresso
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_planos_updated_at ON ylada_wellness_planos;
CREATE TRIGGER trigger_planos_updated_at
  BEFORE UPDATE ON ylada_wellness_planos
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_base_conhecimento_updated_at ON ylada_wellness_base_conhecimento;
CREATE TRIGGER trigger_base_conhecimento_updated_at
  BEFORE UPDATE ON ylada_wellness_base_conhecimento
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_ritual_updated_at ON ylada_wellness_ritual_dias;
CREATE TRIGGER trigger_ritual_updated_at
  BEFORE UPDATE ON ylada_wellness_ritual_dias
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE ylada_wellness_consultores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_base_conhecimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_ritual_dias ENABLE ROW LEVEL SECURITY;

-- Políticas: usuários podem ver apenas seus próprios dados
DROP POLICY IF EXISTS "Users can view own consultor" ON ylada_wellness_consultores;
CREATE POLICY "Users can view own consultor"
  ON ylada_wellness_consultores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own consultor" ON ylada_wellness_consultores;
CREATE POLICY "Users can manage own consultor"
  ON ylada_wellness_consultores FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own diagnosticos" ON ylada_wellness_diagnosticos;
CREATE POLICY "Users can view own diagnosticos"
  ON ylada_wellness_diagnosticos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_diagnosticos.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage own diagnosticos" ON ylada_wellness_diagnosticos;
CREATE POLICY "Users can manage own diagnosticos"
  ON ylada_wellness_diagnosticos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_diagnosticos.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view own progresso" ON ylada_wellness_progresso;
CREATE POLICY "Users can view own progresso"
  ON ylada_wellness_progresso FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_progresso.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage own progresso" ON ylada_wellness_progresso;
CREATE POLICY "Users can manage own progresso"
  ON ylada_wellness_progresso FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_progresso.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view own planos" ON ylada_wellness_planos;
CREATE POLICY "Users can view own planos"
  ON ylada_wellness_planos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_planos.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage own planos" ON ylada_wellness_planos;
CREATE POLICY "Users can manage own planos"
  ON ylada_wellness_planos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_planos.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can read base conhecimento" ON ylada_wellness_base_conhecimento;
CREATE POLICY "Users can read base conhecimento"
  ON ylada_wellness_base_conhecimento FOR SELECT
  TO authenticated
  USING (ativo = true);

DROP POLICY IF EXISTS "Users can view own interacoes" ON ylada_wellness_interacoes;
CREATE POLICY "Users can view own interacoes"
  ON ylada_wellness_interacoes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_interacoes.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own interacoes" ON ylada_wellness_interacoes;
CREATE POLICY "Users can insert own interacoes"
  ON ylada_wellness_interacoes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_interacoes.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view own notificacoes" ON ylada_wellness_notificacoes;
CREATE POLICY "Users can view own notificacoes"
  ON ylada_wellness_notificacoes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_notificacoes.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own notificacoes" ON ylada_wellness_notificacoes;
CREATE POLICY "Users can update own notificacoes"
  ON ylada_wellness_notificacoes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_notificacoes.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view own ritual" ON ylada_wellness_ritual_dias;
CREATE POLICY "Users can view own ritual"
  ON ylada_wellness_ritual_dias FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_ritual_dias.consultor_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage own ritual" ON ylada_wellness_ritual_dias;
CREATE POLICY "Users can manage own ritual"
  ON ylada_wellness_ritual_dias FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ylada_wellness_consultores
      WHERE id = ylada_wellness_ritual_dias.consultor_id
      AND user_id = auth.uid()
    )
  );

-- Apenas admins podem gerenciar base de conhecimento
DROP POLICY IF EXISTS "Admins can manage base conhecimento" ON ylada_wellness_base_conhecimento;
CREATE POLICY "Admins can manage base conhecimento"
  ON ylada_wellness_base_conhecimento FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND (is_admin = true OR is_support = true)
    )
  );

COMMENT ON TABLE ylada_wellness_consultores IS 'Nível 1 - Consultores Wellness';
COMMENT ON TABLE ylada_wellness_diagnosticos IS 'Nível 2 - Diagnósticos completos';
COMMENT ON TABLE ylada_wellness_progresso IS 'Nível 2 - Progresso diário';
COMMENT ON TABLE ylada_wellness_planos IS 'Nível 3 - Planos personalizados (7/14/30/90 dias)';
COMMENT ON TABLE ylada_wellness_base_conhecimento IS 'Nível 4 - Base de conhecimento (scripts, frases, fluxos)';
COMMENT ON TABLE ylada_wellness_interacoes IS 'Memória do NOEL - Todas as interações';
COMMENT ON TABLE ylada_wellness_notificacoes IS 'Sistema de notificações inteligentes';
COMMENT ON TABLE ylada_wellness_ritual_dias IS 'Ritual 2-5-10 - Execuções diárias';

