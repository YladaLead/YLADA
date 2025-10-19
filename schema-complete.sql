-- =====================================================
-- YLADA DATABASE STRUCTURE - COMPLETE SCHEMA
-- Alinhado com a Assistente YLADA e estratégia de economia de IA
-- =====================================================

-- =====================================================
-- 1. USUÁRIOS E PERFIS
-- =====================================================

-- Tabela principal de usuários (integra com Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  subscription_tier VARCHAR(50) DEFAULT 'free', -- free, pro, business, enterprise
  credits_remaining INTEGER DEFAULT 10,
  language VARCHAR(10) DEFAULT 'pt'
);

-- Perfil detalhado do usuário (dados para economia de IA)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dados básicos
  profession VARCHAR(100), -- nutricionista, personal-trainer, etc.
  specialization VARCHAR(200), -- emagrecimento, performance, etc.
  target_audience TEXT, -- mulheres 25-45, atletas, etc.
  main_objective VARCHAR(100), -- capturar-leads, gerar-indicacoes, etc.
  preferred_tool_type VARCHAR(50), -- quiz, calculator, checklist, etc.
  
  -- Dados de negócio
  business_model VARCHAR(100), -- consultoria-individual, grupo, etc.
  price_range VARCHAR(50), -- baixo, medio, alto
  experience_level VARCHAR(50), -- iniciante, intermediario, avancado
  
  -- Preferências da IA
  ai_personality VARCHAR(50) DEFAULT 'profissional', -- profissional, casual, tecnico
  response_length VARCHAR(50) DEFAULT 'curto', -- curto, medio, longo
  use_emojis BOOLEAN DEFAULT true,
  
  -- Histórico e aprendizado
  last_tool_created TIMESTAMP WITH TIME ZONE,
  total_tools_created INTEGER DEFAULT 0,
  successful_conversions INTEGER DEFAULT 0,
  preferred_categories TEXT[], -- array de categorias preferidas
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- =====================================================
-- 2. TEMPLATES E FERRAMENTAS
-- =====================================================

-- Templates base (pré-definidos para economia de IA)
CREATE TABLE templates_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  name VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- quiz, calculator, checklist, etc.
  category VARCHAR(100) NOT NULL, -- atracao, indicacao, conversao
  
  -- Segmentação
  profession VARCHAR(100), -- nutricionista, personal-trainer, etc.
  specialization VARCHAR(200), -- emagrecimento, performance, etc.
  objective VARCHAR(100), -- capturar-leads, gerar-indicacoes, etc.
  
  -- Conteúdo
  content JSONB NOT NULL, -- estrutura da ferramenta
  questions JSONB, -- perguntas específicas
  calculations JSONB, -- cálculos para calculadoras
  checklist_items JSONB, -- itens para checklists
  
  -- Metadados
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ferramentas geradas pelos usuários
CREATE TABLE generated_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates_base(id),
  
  -- Identificação
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  
  -- Conteúdo personalizado
  content JSONB NOT NULL, -- conteúdo final da ferramenta
  customizations JSONB, -- personalizações feitas pelo usuário
  
  -- Configurações
  status VARCHAR(50) DEFAULT 'active', -- active, paused, archived
  is_public BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Métricas
  views_count INTEGER DEFAULT 0,
  completions_count INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. LEADS E CONVERSÕES
-- =====================================================

-- Leads capturados pelas ferramentas
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES generated_tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dados do lead
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  
  -- Respostas da ferramenta
  responses JSONB, -- respostas do quiz/formulário
  score DECIMAL(5,2), -- pontuação se aplicável
  result_summary TEXT, -- resumo do resultado
  
  -- Status de conversão
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, converted, lost
  conversion_value DECIMAL(10,2), -- valor da conversão se aplicável
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  ip_address INET,
  user_agent TEXT,
  referrer VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. IA E APRENDIZADO
-- =====================================================

-- Histórico de conversas com a IA
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Conversa
  messages JSONB NOT NULL, -- array de mensagens da conversa
  conversation_type VARCHAR(50) DEFAULT 'tool_creation', -- tool_creation, support, etc.
  
  -- Resultado
  tool_created_id UUID REFERENCES generated_tools(id),
  success BOOLEAN DEFAULT true,
  user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  
  -- Metadados
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10,4) DEFAULT 0.0000
);

-- Templates gerados pela IA (para aprendizado)
CREATE TABLE ai_generated_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES ai_conversations(id),
  
  -- Prompt e resultado
  original_prompt TEXT NOT NULL,
  ai_response JSONB NOT NULL,
  final_template JSONB, -- template final gerado
  
  -- Qualidade
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  was_used BOOLEAN DEFAULT false,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10,4) DEFAULT 0.0000
);

-- =====================================================
-- 5. CACHE E PERFORMANCE
-- =====================================================

-- Cache de respostas da IA (para economia)
CREATE TABLE ai_response_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Chave do cache
  cache_key VARCHAR(500) UNIQUE NOT NULL,
  user_profile_hash VARCHAR(100), -- hash do perfil do usuário
  
  -- Resposta em cache
  cached_response JSONB NOT NULL,
  response_type VARCHAR(50), -- template_suggestion, tool_recommendation, etc.
  
  -- Metadados
  hit_count INTEGER DEFAULT 0,
  last_hit_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. ANALYTICS E MÉTRICAS
-- =====================================================

-- Métricas de uso por usuário
CREATE TABLE user_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Métricas de uso
  tools_created INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Métricas de IA
  ai_conversations_count INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_ai_cost DECIMAL(10,4) DEFAULT 0.0000,
  
  -- Métricas de tempo
  avg_tool_creation_time INTEGER, -- em segundos
  last_activity_at TIMESTAMP WITH TIME ZONE,
  
  -- Período
  period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas frequentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_profession ON user_profiles(profession);
CREATE INDEX idx_templates_base_type_category ON templates_base(type, category);
CREATE INDEX idx_templates_base_profession ON templates_base(profession);
CREATE INDEX idx_generated_tools_user_id ON generated_tools(user_id);
CREATE INDEX idx_generated_tools_slug ON generated_tools(slug);
CREATE INDEX idx_generated_tools_status ON generated_tools(status);
CREATE INDEX idx_leads_tool_id ON leads(tool_id);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_response_cache_key ON ai_response_cache(cache_key);
CREATE INDEX idx_ai_response_cache_expires ON ai_response_cache(expires_at);

-- =====================================================
-- 8. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas relevantes
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_base_updated_at BEFORE UPDATE ON templates_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_tools_updated_at BEFORE UPDATE ON generated_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_metrics_updated_at BEFORE UPDATE ON user_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança básicas
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tools" ON generated_tools FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tools" ON generated_tools FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tools" ON generated_tools FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own leads" ON leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own leads" ON leads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 10. DADOS INICIAIS (TEMPLATES BASE)
-- =====================================================

-- Inserir templates base para nutricionistas (exemplo)
INSERT INTO templates_base (name, description, type, category, profession, specialization, objective, content) VALUES
('Quiz de Perfil de Energia', 'Descubra seu tipo de energia e necessidades nutricionais', 'quiz', 'atracao', 'nutricionista', 'emagrecimento', 'capturar-leads', '{"questions": [{"question": "Como você se sente ao acordar?", "options": ["Energético", "Cansado", "Com fome", "Sem apetite"]}]}'),
('Calculadora de Equilíbrio', 'Calcule seu índice de equilíbrio corpo e mente', 'calculator', 'atracao', 'nutricionista', 'bem-estar', 'capturar-leads', '{"formula": "score = (energia + sono + alimentacao) / 3", "inputs": ["energia", "sono", "alimentacao"]}'),
('Checklist de Rotina Saudável', '10 sinais de que você precisa mudar sua rotina', 'checklist', 'atracao', 'nutricionista', 'habitos', 'capturar-leads', '{"items": ["Acorda cansado", "Sente fome constante", "Tem dificuldade para dormir"]}');

-- =====================================================
-- ESTRUTURA COMPLETA CRIADA!
-- =====================================================
