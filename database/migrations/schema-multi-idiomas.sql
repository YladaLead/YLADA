-- YLADA - SCHEMA MULTI-IDIOMAS + FILTROS PROFISSIONAIS
-- Suporte completo para PT, EN, ES + filtros por profissão

-- Limpar tabelas se existirem
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS user_templates CASCADE;
DROP TABLE IF EXISTS templates_nutrition CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tabela principal de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  language VARCHAR(10) DEFAULT 'pt',
  country VARCHAR(10) DEFAULT 'BR' -- BR, US, ES, etc.
);

-- Perfil específico para profissionais
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profession VARCHAR(100) NOT NULL, -- 'nutricionista', 'distribuidor_suplementos', 'vendedor_nutraceuticos'
  specialization VARCHAR(100), -- 'emagrecimento', 'ganho-massa', 'esportiva', 'clinica'
  target_audience VARCHAR(100), -- 'iniciantes', 'intermediarios', 'avancados'
  main_objective VARCHAR(100), -- 'capturar-leads', 'vender-suplementos', 'consultas'
  whatsapp VARCHAR(20),
  instagram VARCHAR(100),
  website VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates base com suporte multi-idiomas
CREATE TABLE templates_nutrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL, -- {"pt": "Quiz Diagnóstico", "en": "Diagnostic Quiz", "es": "Cuestionario Diagnóstico"}
  description JSONB NOT NULL, -- Descrição em múltiplos idiomas
  type VARCHAR(50) NOT NULL, -- 'quiz', 'calculadora', 'planilha', 'catalogo'
  profession VARCHAR(100) NOT NULL, -- 'nutricionista', 'distribuidor_suplementos', 'vendedor_nutraceuticos', 'todos'
  specialization VARCHAR(100), -- 'emagrecimento', 'ganho-massa', 'esportiva', 'clinica', 'todos'
  language VARCHAR(10) NOT NULL, -- 'pt', 'en', 'es'
  country VARCHAR(10) NOT NULL, -- 'BR', 'US', 'ES', etc.
  objective VARCHAR(100), -- 'capturar-leads', 'vender-suplementos', 'consultas'
  title JSONB NOT NULL, -- Título em múltiplos idiomas
  content JSONB NOT NULL, -- Conteúdo do template
  cta_text JSONB, -- Texto do CTA em múltiplos idiomas
  whatsapp_message JSONB, -- Mensagem WhatsApp em múltiplos idiomas
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
  content JSONB NOT NULL,
  custom_cta_text VARCHAR(255),
  custom_whatsapp_message TEXT,
  capture_data BOOLEAN DEFAULT true, -- true = salva leads, false = apenas valor
  redirect_url VARCHAR(500), -- URL para redirecionar após preenchimento
  show_results BOOLEAN DEFAULT true, -- Mostrar diagnóstico
  collect_contact BOOLEAN DEFAULT true, -- Coletar email/telefone
  views INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
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
  source VARCHAR(50) DEFAULT 'template',
  ip_address INET,
  user_agent TEXT,
  country VARCHAR(10), -- País do lead
  language VARCHAR(10), -- Idioma usado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_language ON users(language);
CREATE INDEX idx_users_country ON users(country);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_profession ON user_profiles(profession);
CREATE INDEX idx_templates_nutrition_language ON templates_nutrition(language);
CREATE INDEX idx_templates_nutrition_country ON templates_nutrition(country);
CREATE INDEX idx_templates_nutrition_profession ON templates_nutrition(profession);
CREATE INDEX idx_templates_nutrition_active ON templates_nutrition(is_active);
CREATE INDEX idx_user_templates_user_id ON user_templates(user_id);
CREATE INDEX idx_user_templates_slug ON user_templates(slug);
CREATE INDEX idx_leads_template_id ON leads(template_id);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
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
CREATE POLICY "Users can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Inserir templates multi-idiomas e multi-profissão
INSERT INTO templates_nutrition (name, description, type, profession, specialization, language, country, objective, title, content, cta_text, whatsapp_message) VALUES

-- QUIZ DIAGNÓSTICO NUTRICIONAL - PORTUGUÊS
(
  '{"pt": "Quiz Diagnóstico Nutricional", "en": "Nutritional Diagnostic Quiz", "es": "Cuestionario Diagnóstico Nutricional"}',
  '{"pt": "Descubra o perfil nutricional ideal através de perguntas estratégicas", "en": "Discover your ideal nutritional profile through strategic questions", "es": "Descubre tu perfil nutricional ideal a través de preguntas estratégicas"}',
  'quiz',
  'todos',
  'todos',
  'pt',
  'BR',
  'capturar-leads',
  '{"pt": "Descubra seu Perfil Nutricional Ideal", "en": "Discover Your Ideal Nutritional Profile", "es": "Descubre tu Perfil Nutricional Ideal"}',
  '{"questions": [{"id": 1, "question": "Qual seu principal objetivo?", "options": ["Emagrecer", "Ganhar massa", "Manter peso", "Melhorar saúde"]}, {"id": 2, "question": "Com que frequência você consome vegetais?", "options": ["Diariamente", "Algumas vezes/semana", "Raramente"]}]}',
  '{"pt": "Descobrir meu perfil", "en": "Discover my profile", "es": "Descubrir mi perfil"}',
  '{"pt": "Olá! Fiz o quiz nutricional e gostaria de saber mais sobre os resultados.", "en": "Hello! I took the nutrition quiz and would like to know more about the results.", "es": "¡Hola! Hice el cuestionario nutricional y me gustaría saber más sobre los resultados."}'
),

-- CALCULADORA IMC - PORTUGUÊS
(
  '{"pt": "Calculadora IMC Avançada", "en": "Advanced BMI Calculator", "es": "Calculadora IMC Avanzada"}',
  '{"pt": "Calcule seu IMC e receba recomendações personalizadas", "en": "Calculate your BMI and get personalized recommendations", "es": "Calcula tu IMC y recibe recomendaciones personalizadas"}',
  'calculadora',
  'todos',
  'todos',
  'pt',
  'BR',
  'capturar-leads',
  '{"pt": "Calcule seu IMC e Peso Ideal", "en": "Calculate Your BMI and Ideal Weight", "es": "Calcula tu IMC y Peso Ideal"}',
  '{"fields": ["peso", "altura", "idade", "atividade_fisica"], "formula": "peso/(altura*altura)"}',
  '{"pt": "Calcular IMC", "en": "Calculate BMI", "es": "Calcular IMC"}',
  '{"pt": "Olá! Calculei meu IMC e gostaria de uma consulta nutricional.", "en": "Hello! I calculated my BMI and would like a nutritional consultation.", "es": "¡Hola! Calculé mi IMC y me gustaría una consulta nutricional."}'
),

-- PLANILHA DIETA - PORTUGUÊS
(
  '{"pt": "Planilha Dieta Personalizada", "en": "Personalized Diet Plan", "es": "Plan de Dieta Personalizado"}',
  '{"pt": "Cardápio semanal completo baseado no seu perfil nutricional", "en": "Complete weekly menu based on your nutritional profile", "es": "Menú semanal completo basado en tu perfil nutricional"}',
  'planilha',
  'nutricionista',
  'todos',
  'pt',
  'BR',
  'capturar-leads',
  '{"pt": "Sua Dieta Personalizada", "en": "Your Personalized Diet", "es": "Tu Dieta Personalizada"}',
  '{"sections": ["cafe-da-manha", "lanche", "almoco", "lanche-tarde", "jantar"]}',
  '{"pt": "Baixar planilha", "en": "Download plan", "es": "Descargar plan"}',
  '{"pt": "Olá! Baixei a planilha de dieta e quero acompanhamento nutricional.", "en": "Hello! I downloaded the diet plan and want nutritional follow-up.", "es": "¡Hola! Descargué el plan de dieta y quiero seguimiento nutricional."}'
),

-- CATÁLOGO SUPLEMENTOS - PORTUGUÊS
(
  '{"pt": "Catálogo Suplementos Interativo", "en": "Interactive Supplements Catalog", "es": "Catálogo Interactivo de Suplementos"}',
  '{"pt": "Descubra os suplementos ideais para seus objetivos", "en": "Discover the ideal supplements for your goals", "es": "Descubre los suplementos ideales para tus objetivos"}',
  'catalogo',
  'distribuidor_suplementos',
  'todos',
  'pt',
  'BR',
  'vender-suplementos',
  '{"pt": "Seus Suplementos Ideais", "en": "Your Ideal Supplements", "es": "Tus Suplementos Ideales"}',
  '{"products": [{"name": "Whey Protein", "description": "Proteína para massa muscular"}, {"name": "Creatina", "description": "Performance e força"}]}',
  '{"pt": "Ver suplementos", "en": "View supplements", "es": "Ver suplementos"}',
  '{"pt": "Olá! Vi o catálogo de suplementos e quero saber mais sobre os produtos.", "en": "Hello! I saw the supplements catalog and want to know more about the products.", "es": "¡Hola! Vi el catálogo de suplementos y quiero saber más sobre los productos."}'
),

-- QUIZ SUPLEMENTOS - PORTUGUÊS
(
  '{"pt": "Quiz: Qual Suplemento Ideal?", "en": "Quiz: Which Supplement is Right?", "es": "Quiz: ¿Cuál Suplemento Ideal?"}',
  '{"pt": "Descubra quais suplementos são ideais para seus objetivos", "en": "Discover which supplements are ideal for your goals", "es": "Descubre qué suplementos son ideales para tus objetivos"}',
  'quiz',
  'vendedor_nutraceuticos',
  'todos',
  'pt',
  'BR',
  'vender-suplementos',
  '{"pt": "Descubra Seus Suplementos Ideais", "en": "Discover Your Ideal Supplements", "es": "Descubre tus Suplementos Ideales"}',
  '{"questions": [{"id": 1, "question": "Qual seu objetivo principal?", "options": ["Emagrecer", "Ganhar massa", "Energia", "Saúde geral"]}]}',
  '{"pt": "Descobrir suplementos", "en": "Discover supplements", "es": "Descubrir suplementos"}',
  '{"pt": "Olá! Fiz o quiz de suplementos e quero saber mais sobre os produtos recomendados.", "en": "Hello! I took the supplements quiz and want to know more about the recommended products.", "es": "¡Hola! Hice el quiz de suplementos y quiero saber más sobre los productos recomendados."}'
),

-- CALCULADORA CALORIAS - PORTUGUÊS
(
  '{"pt": "Calculadora Calorias Diárias", "en": "Daily Calories Calculator", "es": "Calculadora Calorías Diarias"}',
  '{"pt": "Calcule suas necessidades calóricas diárias", "en": "Calculate your daily caloric needs", "es": "Calcula tus necesidades calóricas diarias"}',
  'calculadora',
  'todos',
  'todos',
  'pt',
  'BR',
  'capturar-leads',
  '{"pt": "Suas Necessidades Calóricas", "en": "Your Caloric Needs", "es": "Tus Necesidades Calóricas"}',
  '{"fields": ["peso", "altura", "idade", "atividade_fisica", "objetivo"]}',
  '{"pt": "Calcular calorias", "en": "Calculate calories", "es": "Calcular calorías"}',
  '{"pt": "Olá! Calculei minhas necessidades calóricas e quero uma consulta nutricional.", "en": "Hello! I calculated my caloric needs and want a nutritional consultation.", "es": "¡Hola! Calculé mis necesidades calóricas y quiero una consulta nutricional."}'
);

-- Verificar estrutura criada
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
    profession,
    COUNT(*) as total_templates
FROM templates_nutrition 
GROUP BY language, profession 
ORDER BY language, profession;

