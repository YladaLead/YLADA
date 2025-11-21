-- =====================================================
-- YLADA COACH - TABELAS DE TEMPLATES E FERRAMENTAS
-- Estrutura idêntica à área Nutri, totalmente independente
-- =====================================================

-- =====================================================
-- 1. TEMPLATES BASE (coach_templates_nutrition)
-- =====================================================
-- Templates pré-criados disponíveis para Coach
CREATE TABLE IF NOT EXISTS coach_templates_nutrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- quiz, calculadora, planilha, landing, checklist, conteudo, diagnostico
  language VARCHAR(10) NOT NULL, -- pt, pt-PT, es, en, fr, it, de
  specialization VARCHAR(100), -- emagrecimento, ganho-massa, esportiva, clinica
  objective VARCHAR(100), -- capturar-leads, vender-suplementos, consultas
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- Template content específico
  cta_text VARCHAR(255), -- Texto do botão de ação
  whatsapp_message TEXT, -- Mensagem pré-formatada para WhatsApp
  profession VARCHAR(50) DEFAULT 'coach', -- Sempre 'coach' para esta tabela
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  slug VARCHAR(255), -- Slug do template
  icon VARCHAR(10), -- Emoji/ícone do template
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TEMPLATES PERSONALIZADOS (coach_user_templates)
-- =====================================================
-- Templates personalizados pelos usuários Coach
CREATE TABLE IF NOT EXISTS coach_user_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES coach_templates_nutrition(id) ON DELETE SET NULL,
  
  -- Dados básicos
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB, -- Conteúdo personalizado (pode ser NULL se não tiver template_id)
  
  -- Personalização
  custom_cta_text VARCHAR(255),
  custom_whatsapp_message TEXT,
  emoji VARCHAR(10),
  custom_colors JSONB DEFAULT '{"principal": "#8B5CF6", "secundaria": "#7C3AED"}'::jsonb, -- Cores padrão Coach (roxo)
  cta_type VARCHAR(20) DEFAULT 'whatsapp', -- whatsapp ou url_externa
  whatsapp_number VARCHAR(30),
  external_url VARCHAR(500),
  cta_button_text VARCHAR(100) DEFAULT 'Conversar com Especialista',
  template_slug VARCHAR(100), -- Slug do template base usado
  profession VARCHAR(50) DEFAULT 'coach', -- Sempre 'coach' para esta tabela
  
  -- Métricas
  views INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  
  -- Status e expiração
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, expired
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Short code para URLs encurtadas
  short_code VARCHAR(20) UNIQUE,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Templates base
CREATE INDEX IF NOT EXISTS idx_coach_templates_nutrition_language ON coach_templates_nutrition(language);
CREATE INDEX IF NOT EXISTS idx_coach_templates_nutrition_specialization ON coach_templates_nutrition(specialization);
CREATE INDEX IF NOT EXISTS idx_coach_templates_nutrition_active ON coach_templates_nutrition(is_active);
CREATE INDEX IF NOT EXISTS idx_coach_templates_nutrition_type ON coach_templates_nutrition(type);
CREATE INDEX IF NOT EXISTS idx_coach_templates_nutrition_profession ON coach_templates_nutrition(profession);
CREATE INDEX IF NOT EXISTS idx_coach_templates_nutrition_slug ON coach_templates_nutrition(slug);

-- Templates personalizados
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_user_id ON coach_user_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_template_id ON coach_user_templates(template_id);
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_slug ON coach_user_templates(slug);
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_status ON coach_user_templates(status);
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_profession ON coach_user_templates(profession);
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_template_slug ON coach_user_templates(template_slug);
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_short_code ON coach_user_templates(short_code);
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_status_profession ON coach_user_templates(status, profession);
CREATE INDEX IF NOT EXISTS idx_coach_user_templates_conversions_count ON coach_user_templates(conversions_count);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE coach_templates_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_user_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para templates base (públicos se ativos)
DROP POLICY IF EXISTS "Anyone can view active coach templates" ON coach_templates_nutrition;
CREATE POLICY "Anyone can view active coach templates"
  ON coach_templates_nutrition FOR SELECT
  USING (is_active = true);

-- Políticas para templates personalizados (usuários só veem os seus)
DROP POLICY IF EXISTS "Users can view own coach templates" ON coach_user_templates;
DROP POLICY IF EXISTS "Users can insert own coach templates" ON coach_user_templates;
DROP POLICY IF EXISTS "Users can update own coach templates" ON coach_user_templates;
DROP POLICY IF EXISTS "Users can delete own coach templates" ON coach_user_templates;

CREATE POLICY "Users can view own coach templates"
  ON coach_user_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coach templates"
  ON coach_user_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coach templates"
  ON coach_user_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own coach templates"
  ON coach_user_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Política para visualização pública de templates ativos (para rotas públicas)
DROP POLICY IF EXISTS "Public can view active coach templates" ON coach_user_templates;
CREATE POLICY "Public can view active coach templates"
  ON coach_user_templates FOR SELECT
  USING (status = 'active' AND (expires_at IS NULL OR expires_at > NOW()));

-- =====================================================
-- 5. TRIGGERS PARA updated_at
-- =====================================================

-- Função para atualizar updated_at (se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_coach_templates_nutrition_updated_at ON coach_templates_nutrition;
CREATE TRIGGER update_coach_templates_nutrition_updated_at
  BEFORE UPDATE ON coach_templates_nutrition
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_user_templates_updated_at ON coach_user_templates;
CREATE TRIGGER update_coach_user_templates_updated_at
  BEFORE UPDATE ON coach_user_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE coach_templates_nutrition IS 'Templates base disponíveis para área Coach';
COMMENT ON TABLE coach_user_templates IS 'Templates personalizados pelos usuários Coach';

COMMENT ON COLUMN coach_user_templates.emoji IS 'Emoji personalizado da ferramenta';
COMMENT ON COLUMN coach_user_templates.custom_colors IS 'Cores personalizadas: {principal: "#hex", secundaria: "#hex"}';
COMMENT ON COLUMN coach_user_templates.cta_type IS 'Tipo de CTA: whatsapp ou url_externa';
COMMENT ON COLUMN coach_user_templates.whatsapp_number IS 'Número WhatsApp completo com código do país';
COMMENT ON COLUMN coach_user_templates.template_slug IS 'Slug do template base usado';
COMMENT ON COLUMN coach_user_templates.profession IS 'Profissão/Área: sempre "coach"';
COMMENT ON COLUMN coach_user_templates.short_code IS 'Código curto para URL encurtada';

-- =====================================================
-- 7. LEADS CAPTURADOS (coach_leads)
-- =====================================================
-- Leads capturados pelos templates Coach
CREATE TABLE IF NOT EXISTS coach_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES coach_user_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  additional_data JSONB, -- Dados extras do formulário
  source VARCHAR(50) DEFAULT 'template', -- template, whatsapp, email
  ip_address INET,
  user_agent TEXT,
  country VARCHAR(10), -- País do lead
  language VARCHAR(10), -- Idioma usado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para leads
CREATE INDEX IF NOT EXISTS idx_coach_leads_template_id ON coach_leads(template_id);
CREATE INDEX IF NOT EXISTS idx_coach_leads_user_id ON coach_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_leads_created_at ON coach_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_coach_leads_email ON coach_leads(email);
CREATE INDEX IF NOT EXISTS idx_coach_leads_phone ON coach_leads(phone);

-- Habilitar RLS
ALTER TABLE coach_leads ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para leads
DROP POLICY IF EXISTS "Users can view own coach leads" ON coach_leads;
DROP POLICY IF EXISTS "Users can insert coach leads" ON coach_leads;

CREATE POLICY "Users can view own coach leads"
  ON coach_leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert coach leads"
  ON coach_leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE coach_leads IS 'Leads capturados pelos templates Coach';

-- =====================================================
-- 8. QUIZZES PERSONALIZADOS (coach_quizzes)
-- =====================================================
-- Quizzes personalizados pelos usuários Coach
CREATE TABLE IF NOT EXISTS coach_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  emoji VARCHAR(10) DEFAULT '🎯',
  cores JSONB NOT NULL DEFAULT '{}', -- {primaria, secundaria, texto, fundo}
  configuracoes JSONB NOT NULL DEFAULT '{}', -- {tempoLimite, mostrarProgresso, permitirVoltar}
  entrega JSONB NOT NULL DEFAULT '{}', -- {tipoEntrega, urlRedirecionamento, coletarDados, camposColeta, customizacao, blocosConteudo, acaoAposCaptura}
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_code VARCHAR(20) UNIQUE, -- Código curto para URL encurtada
  views INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, draft
  profession VARCHAR(50) DEFAULT 'coach', -- Sempre 'coach' para esta tabela
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para perguntas dos quizzes Coach
CREATE TABLE IF NOT EXISTS coach_quiz_perguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES coach_quizzes(id) ON DELETE CASCADE NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'multipla', 'dissertativa', 'escala', 'simnao'
  titulo TEXT NOT NULL,
  opcoes JSONB, -- Array de strings para múltipla escolha
  obrigatoria BOOLEAN DEFAULT true,
  ordem INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para respostas dos quizzes Coach
CREATE TABLE IF NOT EXISTS coach_quiz_respostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES coach_quizzes(id) ON DELETE CASCADE NOT NULL,
  pergunta_id UUID REFERENCES coach_quiz_perguntas(id) ON DELETE CASCADE,
  nome VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(20),
  resposta JSONB NOT NULL, -- {resposta_texto, resposta_escala, resposta_opcoes}
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para quizzes Coach
CREATE INDEX IF NOT EXISTS idx_coach_quizzes_user_id ON coach_quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_quizzes_slug ON coach_quizzes(slug);
CREATE INDEX IF NOT EXISTS idx_coach_quizzes_status ON coach_quizzes(status);
CREATE INDEX IF NOT EXISTS idx_coach_quizzes_profession ON coach_quizzes(profession);
CREATE INDEX IF NOT EXISTS idx_coach_quizzes_short_code ON coach_quizzes(short_code);
CREATE INDEX IF NOT EXISTS idx_coach_quiz_perguntas_quiz_id ON coach_quiz_perguntas(quiz_id);
CREATE INDEX IF NOT EXISTS idx_coach_quiz_perguntas_ordem ON coach_quiz_perguntas(ordem);
CREATE INDEX IF NOT EXISTS idx_coach_quiz_respostas_quiz_id ON coach_quiz_respostas(quiz_id);
CREATE INDEX IF NOT EXISTS idx_coach_quiz_respostas_pergunta_id ON coach_quiz_respostas(pergunta_id);
CREATE INDEX IF NOT EXISTS idx_coach_quiz_respostas_created_at ON coach_quiz_respostas(created_at);

-- Habilitar RLS
ALTER TABLE coach_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_quiz_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_quiz_respostas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para quizzes Coach
DROP POLICY IF EXISTS "Users can view own coach quizzes" ON coach_quizzes;
DROP POLICY IF EXISTS "Users can insert own coach quizzes" ON coach_quizzes;
DROP POLICY IF EXISTS "Users can update own coach quizzes" ON coach_quizzes;
DROP POLICY IF EXISTS "Users can delete own coach quizzes" ON coach_quizzes;
DROP POLICY IF EXISTS "Anyone can view active coach quizzes" ON coach_quizzes;

CREATE POLICY "Users can view own coach quizzes" ON coach_quizzes FOR SELECT 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own coach quizzes" ON coach_quizzes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own coach quizzes" ON coach_quizzes FOR UPDATE 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own coach quizzes" ON coach_quizzes FOR DELETE 
  USING (auth.uid() = user_id);

-- Qualquer um pode ver quizzes ativos (para publicação)
CREATE POLICY "Anyone can view active coach quizzes" ON coach_quizzes FOR SELECT 
  USING (status = 'active');

DROP POLICY IF EXISTS "Users can manage own coach quiz_perguntas" ON coach_quiz_perguntas;
CREATE POLICY "Users can manage own coach quiz_perguntas" ON coach_quiz_perguntas FOR ALL 
  USING (
    quiz_id IN (SELECT id FROM coach_quizzes WHERE user_id = auth.uid())
  );

-- Qualquer um pode ver e inserir respostas (leads)
DROP POLICY IF EXISTS "Anyone can insert coach quiz_respostas" ON coach_quiz_respostas;
DROP POLICY IF EXISTS "Users can view own coach quiz responses" ON coach_quiz_respostas;

CREATE POLICY "Anyone can insert coach quiz_respostas" ON coach_quiz_respostas FOR INSERT 
  WITH CHECK (true);
  
CREATE POLICY "Users can view own coach quiz responses" ON coach_quiz_respostas FOR SELECT 
  USING (
    quiz_id IN (SELECT id FROM coach_quizzes WHERE user_id = auth.uid())
  );

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_coach_quizzes_updated_at ON coach_quizzes;
CREATE TRIGGER update_coach_quizzes_updated_at
  BEFORE UPDATE ON coach_quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_quiz_perguntas_updated_at ON coach_quiz_perguntas;
CREATE TRIGGER update_coach_quiz_perguntas_updated_at
  BEFORE UPDATE ON coach_quiz_perguntas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE coach_quizzes IS 'Quizzes personalizados pelos usuários Coach';
COMMENT ON TABLE coach_quiz_perguntas IS 'Perguntas dos quizzes Coach';
COMMENT ON TABLE coach_quiz_respostas IS 'Respostas dos quizzes Coach';

-- =====================================================
-- 9. PORTALS (coach_portals)
-- =====================================================
-- Portais criados pelos usuários Coach
CREATE TABLE IF NOT EXISTS coach_portals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  navigation_type VARCHAR(20) DEFAULT 'menu' CHECK (navigation_type IN ('menu', 'sequential')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  custom_colors JSONB DEFAULT '{"primary": "#8B5CF6", "secondary": "#7C3AED"}'::jsonb, -- Cores padrão Coach (roxo)
  header_text TEXT,
  footer_text TEXT,
  tools_order JSONB DEFAULT '[]'::jsonb,
  short_code VARCHAR(20) UNIQUE, -- Código curto para URL encurtada
  views INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  profession VARCHAR(50) DEFAULT 'coach', -- Sempre 'coach' para esta tabela
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento portal-ferramenta
CREATE TABLE IF NOT EXISTS coach_portal_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id UUID REFERENCES coach_portals(id) ON DELETE CASCADE NOT NULL,
  tool_id UUID REFERENCES coach_user_templates(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT false,
  display_name VARCHAR(255),
  redirect_to_tool_id UUID REFERENCES coach_user_templates(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para portals Coach
CREATE INDEX IF NOT EXISTS idx_coach_portals_user_id ON coach_portals(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_portals_slug ON coach_portals(slug);
CREATE INDEX IF NOT EXISTS idx_coach_portals_status ON coach_portals(status);
CREATE INDEX IF NOT EXISTS idx_coach_portals_profession ON coach_portals(profession);
CREATE INDEX IF NOT EXISTS idx_coach_portals_short_code ON coach_portals(short_code);
CREATE INDEX IF NOT EXISTS idx_coach_portal_tools_portal_id ON coach_portal_tools(portal_id);
CREATE INDEX IF NOT EXISTS idx_coach_portal_tools_tool_id ON coach_portal_tools(tool_id);
CREATE INDEX IF NOT EXISTS idx_coach_portal_tools_position ON coach_portal_tools(position);

-- Habilitar RLS
ALTER TABLE coach_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_portal_tools ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para portals Coach
DROP POLICY IF EXISTS "Users can view own coach portals" ON coach_portals;
DROP POLICY IF EXISTS "Users can insert own coach portals" ON coach_portals;
DROP POLICY IF EXISTS "Users can update own coach portals" ON coach_portals;
DROP POLICY IF EXISTS "Users can delete own coach portals" ON coach_portals;
DROP POLICY IF EXISTS "Anyone can view active coach portals" ON coach_portals;

CREATE POLICY "Users can view own coach portals" ON coach_portals FOR SELECT 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own coach portals" ON coach_portals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own coach portals" ON coach_portals FOR UPDATE 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own coach portals" ON coach_portals FOR DELETE 
  USING (auth.uid() = user_id);

-- Qualquer um pode ver portais ativos (para publicação)
CREATE POLICY "Anyone can view active coach portals" ON coach_portals FOR SELECT 
  USING (status = 'active');

DROP POLICY IF EXISTS "Users can manage own coach portal_tools" ON coach_portal_tools;
CREATE POLICY "Users can manage own coach portal_tools" ON coach_portal_tools FOR ALL 
  USING (
    portal_id IN (SELECT id FROM coach_portals WHERE user_id = auth.uid())
  );

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_coach_portals_updated_at ON coach_portals;
CREATE TRIGGER update_coach_portals_updated_at
  BEFORE UPDATE ON coach_portals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE coach_portals IS 'Portais criados pelos usuários Coach';
COMMENT ON TABLE coach_portal_tools IS 'Relacionamento portal-ferramenta Coach';

