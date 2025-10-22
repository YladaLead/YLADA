-- =====================================================
-- YLADA - SCHEMA SIMPLES E FOCADO EM NUTRIÇÃO
-- Multi-idiomas: PT, EN, ES (apenas os essenciais)
-- =====================================================

-- =====================================================
-- 1. LIMPAR ESTRUTURA EXISTENTE (SE NECESSÁRIO)
-- =====================================================

-- Dropar tabelas se existirem (em ordem reversa devido às foreign keys)
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS user_templates CASCADE;
DROP TABLE IF EXISTS templates_nutrition CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- 2. CRIAR ESTRUTURA SIMPLES E FOCADA
-- =====================================-- =====================================================
-- LIMPEZA SEGURA - DELETAR APENAS NOSSAS TABELAS
-- Execute este script para limpar apenas as tabelas que criamos
-- =====================================================

-- Desabilitar RLS temporariamente para evitar problemas
SET session_replication_role = replica;

-- Dropar apenas as tabelas que criamos (não as do sistema Supabase)
DROP TABLE IF EXISTS user_templates CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_metrics CASCADE;
DROP TABLE IF EXISTS user_calculators CASCADE;
DROP TABLE IF EXISTS translation_quality CASCADE;
DROP TABLE IF EXISTS templates_nutrition CASCADE;
DROP TABLE IF EXISTS templates_ia CASCADE;
DROP TABLE IF EXISTS templates_base CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS ia_learning CASCADE;
DROP TABLE IF EXISTS generated_tools CASCADE;
DROP TABLE IF EXISTS generated_links CASCADE;
DROP TABLE IF EXISTS countries_compliance CASCADE;
DROP TABLE IF EXISTS calculator_types CASCADE;
DROP TABLE IF EXISTS calculation_validations CASCADE;
DROP TABLE IF EXISTS assistant_metrics CASCADE;
DROP TABLE IF EXISTS ai_translations_cache CASCADE;
DROP TABLE IF EXISTS ai_response_cache CASCADE;
DROP TABLE IF EXISTS ai_generated_templates CASCADE;
DROP TABLE IF EXISTS ai_conversations CASCADE;

-- Dropar nossa tabela users (se existir)
DROP TABLE IF EXISTS users CASCADE;

-- Reabilitar RLS
SET session_replication_role = DEFAULT;

-- Verificar tabelas restantes
SELECT 
    'TABELAS RESTANTES:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name NOT LIKE 'auth.%'  -- Ignorar tabelas de autenticação
ORDER BY table_name;

-- Se retornar apenas tabelas do sistema (como auth.users), está limpo!
================

-- Tabela principal de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  subscription_tier VARCHAR(50) DEFAULT 'free', -- free, pro, business
  language VARCHAR(10) DEFAULT 'pt' -- pt, en, es
);

-- Perfil específico para nutricionistas
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profession VARCHAR(100) DEFAULT 'nutricionista',
  specialization VARCHAR(100), -- emagrecimento, ganho-massa, esportiva, clinica
  target_audience VARCHAR(100), -- iniciantes, intermediarios, avancados
  main_objective VARCHAR(100), -- capturar-leads, vender-suplementos, consultas
  whatsapp VARCHAR(20),
  instagram VARCHAR(100),
  website VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates específicos para nutrição (pré-criados)
CREATE TABLE templates_nutrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- quiz, calculadora, planilha, landing
  language VARCHAR(10) NOT NULL, -- pt, en, es
  specialization VARCHAR(100), -- emagrecimento, ganho-massa, esportiva, clinica
  objective VARCHAR(100), -- capturar-leads, vender-suplementos, consultas
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- Template content específico
  cta_text VARCHAR(255), -- Texto do botão de ação
  whatsapp_message TEXT, -- Mensagem pré-formatada para WhatsApp
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates personalizados pelos usuários
CREATE TABLE user_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates_nutrition(id),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- Conteúdo personalizado
  custom_cta_text VARCHAR(255),
  custom_whatsapp_message TEXT,
  views INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, expired
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads capturados
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES user_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  additional_data JSONB, -- Dados extras do formulário
  source VARCHAR(50) DEFAULT 'template', -- template, whatsapp, email
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_language ON users(language);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_templates_nutrition_language ON templates_nutrition(language);
CREATE INDEX idx_templates_nutrition_specialization ON templates_nutrition(specialization);
CREATE INDEX idx_templates_nutrition_active ON templates_nutrition(is_active);
CREATE INDEX idx_user_templates_user_id ON user_templates(user_id);
CREATE INDEX idx_user_templates_slug ON user_templates(slug);
CREATE INDEX idx_user_templates_status ON user_templates(status);
CREATE INDEX idx_leads_template_id ON leads(template_id);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- =====================================================
-- 4. RLS (ROW LEVEL SECURITY) - SEGURANÇA
-- =====================================================

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (usuários só veem seus próprios dados)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own profiles" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profiles" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profiles" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own templates" ON user_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON user_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own templates" ON user_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON user_templates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own leads" ON leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert leads" ON leads FOR INSERT WITH CHECK (true); -- Qualquer um pode inserir leads

-- =====================================================
-- 5. INSERIR TEMPLATES PRÉ-CRIADOS PARA NUTRIÇÃO
-- =====================================================

-- Templates em Português Brasil
INSERT INTO templates_nutrition (name, type, language, specialization, objective, title, description, content, cta_text, whatsapp_message) VALUES
('Quiz Avaliação Nutricional', 'quiz', 'pt', 'emagrecimento', 'capturar-leads', 'Descubra seu perfil nutricional ideal', 'Quiz personalizado para identificar necessidades nutricionais', '{"questions": [{"id": 1, "question": "Qual seu principal objetivo?", "options": ["Emagrecer", "Ganhar massa", "Manter peso", "Melhorar saúde"]}]}', 'Descobrir meu perfil', 'Olá! Fiz o quiz nutricional e gostaria de saber mais sobre os resultados.'),
('Calculadora IMC', 'calculadora', 'pt', 'clinica', 'capturar-leads', 'Calcule seu IMC e receba orientações', 'Calculadora de Índice de Massa Corporal com orientações personalizadas', '{"fields": ["peso", "altura"], "formula": "peso/(altura*altura)"}', 'Calcular IMC', 'Olá! Calculei meu IMC e gostaria de uma consulta nutricional.'),
('Planilha Dieta Emagrecimento', 'planilha', 'pt', 'emagrecimento', 'vender-suplementos', 'Plano alimentar para emagrecimento', 'Planilha completa com cardápio e suplementos recomendados', '{"sections": ["cafe-da-manha", "lanche", "almoco", "lanche-tarde", "jantar"]}', 'Baixar planilha', 'Olá! Baixei a planilha de emagrecimento e quero saber sobre os suplementos.');

-- Templates em Inglês
INSERT INTO templates_nutrition (name, type, language, specialization, objective, title, description, content, cta_text, whatsapp_message) VALUES
('Nutrition Assessment Quiz', 'quiz', 'en', 'emagrecimento', 'capturar-leads', 'Discover your ideal nutritional profile', 'Personalized quiz to identify nutritional needs', '{"questions": [{"id": 1, "question": "What is your main goal?", "options": ["Lose weight", "Gain muscle", "Maintain weight", "Improve health"]}]}', 'Discover my profile', 'Hello! I took the nutrition quiz and would like to know more about the results.'),
('BMI Calculator', 'calculadora', 'en', 'clinica', 'capturar-leads', 'Calculate your BMI and get guidance', 'Body Mass Index calculator with personalized guidance', '{"fields": ["weight", "height"], "formula": "weight/(height*height)"}', 'Calculate BMI', 'Hello! I calculated my BMI and would like a nutritional consultation.');

-- Templates em Espanhol
INSERT INTO templates_nutrition (name, type, language, specialization, objective, title, description, content, cta_text, whatsapp_message) VALUES
('Quiz Evaluación Nutricional', 'quiz', 'es', 'emagrecimento', 'capturar-leads', 'Descubre tu perfil nutricional ideal', 'Quiz personalizado para identificar necesidades nutricionales', '{"questions": [{"id": 1, "question": "¿Cuál es tu principal objetivo?", "options": ["Adelgazar", "Ganar masa", "Mantener peso", "Mejorar salud"]}]}', 'Descubrir mi perfil', '¡Hola! Hice el quiz nutricional y me gustaría saber más sobre los resultados.'),
('Calculadora IMC', 'calculadora', 'es', 'clinica', 'capturar-leads', 'Calcula tu IMC y recibe orientación', 'Calculadora de Índice de Masa Corporal con orientación personalizada', '{"fields": ["peso", "altura"], "formula": "peso/(altura*altura)"}', 'Calcular IMC', '¡Hola! Calculé mi IMC y me gustaría una consulta nutricional.');

-- =====================================================
-- 6. VERIFICAR ESTRUTURA CRIADA
-- =====================================================

-- Verificar tabelas criadas
SELECT 
    'TABELAS CRIADAS:' as info,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'user_profiles', 'templates_nutrition', 'user_templates', 'leads')
ORDER BY table_name;

-- Verificar templates inseridos
SELECT 
    'TEMPLATES INSERIDOS:' as info,
    language,
    COUNT(*) as total_templates
FROM templates_nutrition 
GROUP BY language 
ORDER BY language;

